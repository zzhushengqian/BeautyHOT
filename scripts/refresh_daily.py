#!/usr/bin/env python3
"""Build BeautyHOT's public daily feed from free discovery sources."""
import email.utils, hashlib, html, json, os, re, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / "config/sources.json").read_text(encoding="utf-8"))
UA = "BeautyHOT/1.0 (+https://github.com/zzhushengqian/BeautyHOT)"
CATEGORY_WORDS = {
    "deals": ["acqui", "funding", "investment", "stake", "merger", "融资", "收购", "投资"],
    "people": ["appoint", "chief", "ceo", "president", "executive", "任命", "离任"],
    "financials": ["sales", "revenue", "earnings", "profit", "results", "财报", "业绩"],
    "regulation": ["regulation", "recall", "fda", "ban", "warning", "监管", "召回"],
    "supply-chain": ["factory", "facility", "ingredient", "packaging", "manufactur", "原料", "工厂"],
    "channels": ["retail", "store", "sephora", "ulta", "tmall", "门店", "渠道"],
    "products": ["launch", "formula", "clinical", "patent", "新品", "研发"],
}
DISCOVERY_TERMS = [
    "beauty", "cosmetics", "skincare", "makeup", "haircare", "fragrance",
    '"personal care"', "acquisition", "funding", "earnings", "CEO", "regulation",
]
PRIORITY_ENTITY_NAMES = [
    name.lower()
    for names in CONFIG.get("priorityEntities", {}).values()
    for name in names
]
GENERAL_MEDIA_ENTITIES = [
    "beauty", "cosmetic", "skincare", "makeup", "haircare", "fragrance", "personal care",
    "l'oreal", "loreal", "estee lauder", "coty", "shiseido", "puig",
    "unilever", "procter & gamble", "p&g", "lvmh", "sephora", "ulta",
    "beiersdorf", "kao", "kose", "amorepacific", "cosmax", "elf beauty",
    *PRIORITY_ENTITY_NAMES,
]
GENERAL_NEWS_DOMAINS = {"reuters.com", "wwd.com"}
PERSONNEL_TERMS = [
    "任命", "晋升", "升任", "出任", "就任", "离任", "辞任", "辞职", "卸任",
    "新任", "接任", "接替", "履新", "换帅", "人事变动", "管理层调整",
    "董事长", "总经理", "首席执行官", "CEO", "总裁", "高管", "董事会",
]
PERSONNEL_ACTION_TERMS = [
    "任命", "晋升", "升任", "出任", "就任", "离任", "辞任", "辞职", "卸任",
    "新任", "接任", "接替", "履新", "换帅", "人事变动", "管理层调整",
]
EXCLUDED_TITLE_TERMS = [
    "招聘", "职位", "岗位", "实习", "校招", "社招", "诚聘",
    "job opening", "jobs", "hiring", "vacancy", "careers", "internship", "apprentice",
]

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as response:
        return response.read()

def category(title):
    lower = title.lower()
    for key, words in CATEGORY_WORDS.items():
        if any(word in lower for word in words): return key
    return "brands"

def signals(title, source):
    lower = title.lower(); cat = category(title)
    impact = 8 if cat in {"deals","financials","regulation"} else 6
    magnitude = 9 if re.search(r"\$|billion|million|亿|%", lower) else 6
    china = 10 if re.search(r"china|chinese|中国|国货|上海|广州|北京", lower) else 3
    novelty = 8 if re.search(r"first|new|launch|appoint|acqui|首次|推出|任命|收购", lower) else 6
    actionability = 8 if cat in {"deals","financials","regulation","channels","supply-chain"} else 6
    return {"impact":impact,"magnitude":magnitude,"china":china,"novelty":novelty,"actionability":actionability}

def excluded_title(title):
    lower = title.lower()
    return any(term.lower() in lower for term in EXCLUDED_TITLE_TERMS)

def collect_priority_personnel():
    found = []
    terms = " OR ".join(PERSONNEL_TERMS)
    for entity in CONFIG.get("priorityPersonnelEntities", []):
        query = f'"{entity}" 美妆 ({terms}) when:30d'
        url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({
            "q": query, "hl": "zh-CN", "gl": "CN", "ceid": "CN:zh-Hans"
        })
        try:
            root = ET.fromstring(fetch(url))
        except Exception as exc:
            print(f"warning: personnel {entity}: {exc}")
            continue
        for entry in root.findall("./channel/item")[:6]:
            raw_title = html.unescape(entry.findtext("title") or "").strip()
            title = re.sub(r"\s+-\s+[^-]+$", "", raw_title).strip()
            link = (entry.findtext("link") or "").strip()
            lower = title.lower()
            if not title or not link or excluded_title(title):
                continue
            if entity.lower() not in lower or not any(term.lower() in lower for term in PERSONNEL_ACTION_TERMS):
                continue
            try:
                published = email.utils.parsedate_to_datetime(
                    entry.findtext("pubDate") or ""
                ).astimezone(timezone.utc)
            except Exception:
                published = datetime.now(timezone.utc)
            source_name = (entry.findtext("source") or "公开媒体报道").strip()
            item_id = hashlib.sha1((title + entity).encode()).hexdigest()[:14]
            found.append({
                "id": item_id,
                "title": title,
                "summary": title,
                "why": f"{entity}属于国内重点美妆集团，人事与组织变化可能影响品牌战略和经营执行。",
                "category": "people",
                "source": source_name,
                "sourceTier": "C",
                "verification": "reported",
                "sourceCount": 1,
                "publishedAt": published.isoformat(),
                "publishedLabel": "最近 30 天",
                "url": link,
                "companies": [entity],
                "tags": [entity, "重点人事监测", "媒体报道"],
                "baseScore": 72,
                "priorityPersonnel": True,
                "signals": {"impact":10,"magnitude":8,"china":10,"novelty":9,"actionability":9},
            })
    return found

def collect():
    found = []
    for source in CONFIG["queries"]:
        keywords = " OR ".join(DISCOVERY_TERMS)
        query = f'site:{source["domain"]} ({keywords}) when:7d'
        url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q":query,"hl":"en-US","gl":"US","ceid":"US:en"})
        try: root = ET.fromstring(fetch(url))
        except Exception as exc:
            print(f"warning: {source['name']}: {exc}"); continue
        for entry in root.findall("./channel/item")[:12]:
            raw_title = html.unescape(entry.findtext("title") or "").strip()
            title = re.sub(r"\s+-\s+[^-]+$", "", raw_title).strip()
            link = (entry.findtext("link") or "").strip()
            if not title or not link or excluded_title(title): continue
            if source["domain"] in GENERAL_NEWS_DOMAINS and not any(
                word in title.lower() for word in GENERAL_MEDIA_ENTITIES
            ):
                continue
            try: published = email.utils.parsedate_to_datetime(entry.findtext("pubDate") or "").astimezone(timezone.utc)
            except Exception: published = datetime.now(timezone.utc)
            sig = signals(title, source)
            item_id = hashlib.sha1((title + source["domain"]).encode()).hexdigest()[:14]
            found.append({
                "id": item_id, "title": title, "summary": title,
                "why": "该事件进入今日公开信源候选池，建议结合原始报道判断业务影响。",
                "category": category(title), "source": source["name"], "sourceTier": source["tier"],
                "verification": "official" if source["tier"] == "A" else "reported",
                "sourceCount": 1, "publishedAt": published.isoformat(),
                "publishedLabel": "最近 7 天", "url": link, "companies": [],
                "tags": [source["name"], "官方信源" if source["tier"] == "A" else "自动采集"],
                "baseScore": 60, "signals": sig
            })
    found.extend(collect_priority_personnel())
    dedup = {}
    for item in sorted(found, key=lambda x:x["publishedAt"], reverse=True):
        key = re.sub(r"\W+", "", item["title"].lower())[:80]
        dedup.setdefault(key, item)
    candidates = list(dedup.values())
    selected = []
    selected.extend([item for item in candidates if item.get("priorityPersonnel")][:12])
    selected.extend([item for item in candidates if item["sourceTier"] == "A"][:16])
    selected.extend([item for item in candidates if item["sourceTier"] == "B"][:8])
    selected_ids = {item["id"] for item in selected}
    selected.extend(item for item in candidates if item["id"] not in selected_ids)
    return sorted(selected[:40], key=lambda x:x["publishedAt"], reverse=True)

def enrich(items):
    token = os.getenv("GITHUB_TOKEN")
    if not token or not items: return items
    enriched = []
    for start in range(0, len(items), 8):
        batch = items[start:start + 8]
        prompt = (
            "将以下美妆行业候选新闻改写为中文结构化 JSON，不要虚构事实。"
            "返回 {items:[...]}。每项必须保留 id/url/publishedAt/source/sourceTier/signals/priorityPersonnel，"
            "补全中文 title、summary、why、companies、tags；category 只能是 brands、people、"
            "deals、financials、products、channels、marketing、regulation、supply-chain 之一；"
            "保留 verification 和 sourceCount，不要降低官方信源的核验级别。候选："
            + json.dumps(batch, ensure_ascii=False)
        )
        body = json.dumps({
            "model":"openai/gpt-4.1",
            "response_format":{"type":"json_object"},
            "messages":[
                {"role":"system","content":"你是严谨的美妆商业新闻编辑，摘要简洁，优先呈现商业影响。"},
                {"role":"user","content":prompt}
            ],
            "temperature":0.1,
            "max_tokens":3500
        }).encode()
        req = urllib.request.Request(
            "https://models.github.ai/inference/chat/completions",
            data=body,
            headers={"Authorization":f"Bearer {token}","Content-Type":"application/json","User-Agent":UA}
        )
        try:
            response = json.loads(fetch_request(req))
            result = json.loads(response["choices"][0]["message"]["content"])
            enriched.extend(result.get("items") or batch)
        except Exception as exc:
            print(f"warning: GitHub Models batch fallback: {exc}")
            enriched.extend(batch)
    return enriched

def fetch_request(req):
    with urllib.request.urlopen(req, timeout=90) as response: return response.read()

def main():
    items = enrich(collect())
    if not items: raise SystemExit("No candidates collected; existing feed preserved")
    now = datetime.now(timezone.utc); payload = {"date":now.astimezone().date().isoformat(),"generatedAt":now.isoformat(),"items":items}
    data = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    (ROOT / "data/latest.json").write_text(data, encoding="utf-8")
    archive = ROOT / "data/archive"; archive.mkdir(parents=True, exist_ok=True)
    (archive / f"{payload['date']}.json").write_text(data, encoding="utf-8")
    dates = sorted(
        (path.stem for path in archive.glob("*.json") if path.stem != "index"),
        reverse=True,
    )
    archive_index = json.dumps(
        {"generatedAt": now.isoformat(), "dates": dates},
        ensure_ascii=False,
        indent=2,
    ) + "\n"
    (archive / "index.json").write_text(archive_index, encoding="utf-8")
    print(f"wrote {len(items)} items")
if __name__ == "__main__": main()