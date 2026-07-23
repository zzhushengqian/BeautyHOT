#!/usr/bin/env python3
"""Build BeautyHOT's public daily feed from free discovery sources."""
import email.utils, hashlib, html, json, os, re, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
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
    "美妆", "化妆品", "护肤", "彩妆", "香水", "奢侈品美妆", "国货美妆",
    *PRIORITY_ENTITY_NAMES,
]
GENERAL_NEWS_DOMAINS = {"reuters.com", "wwd.com", "voguebusiness.com", "ladymax.cn"}
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
    "offre d'emploi", "emploi", "beauty consultant", "beauty advisor",
    "financial analyst", "part time", "job details", "stellenanzeige",
    "archives", "locations", "discover", "category archive",
]
JOB_ROLE_TERMS = [
    "manager", "director", "assistant", "specialist", "coordinator", "intern", "apprentice",
]
CHANGE_ACTION_TERMS = [
    "appoint", "promot", "named", "joins", "joined", "resign", "steps down", "leaves",
    "任命", "晋升", "升任", "出任", "就任", "离任", "辞任", "辞职", "卸任",
    "新任", "接任", "接替", "履新", "换帅",
]
LOOKBACK_DAYS = int(os.getenv("BEAUTYHOT_DEDUP_LOOKBACK_DAYS", "30"))
MATERIAL_UPDATE_TERMS = [
    "官方", "公告", "确认", "披露", "交易所", "监管", "批准", "完成", "交割",
    "生效", "raised", "completed", "closed", "approved",
    "announced", "confirmed", "official", "filing",
]
ENTITY_ALIASES = {
    "珀莱雅": ["珀莱雅", "proya"],
    "花知晓": ["花知晓", "flower knows"],
}

for names in CONFIG.get("priorityEntities", {}).values():
    for name in names:
        ENTITY_ALIASES.setdefault(name, [name])
for name in CONFIG.get("priorityPersonnelEntities", []):
    ENTITY_ALIASES.setdefault(name, [name])

ACTION_GROUPS = {
    "people-chair": ["董事长", "chairman", "chair"],
    "people-ceo": ["首席执行官", "ceo"],
    "people-president": ["总裁", "president"],
    "people-manager": ["总经理", "general manager"],
    "people-appoint": ["任命", "晋升", "升任", "出任", "就任", "新任", "接任", "接替", "履新", "换帅", "appoint", "promot", "named", "joins", "joined"],
    "people-leave": ["离任", "辞任", "辞职", "卸任", "resign", "steps down", "leaves"],
    "deal-acquire": ["收购", "控股", "并购", "acqui", "merger", "stake"],
    "deal-funding": ["融资", "投资", "funding", "investment", "raised"],
    "financials": ["财报", "业绩", "营收", "利润", "revenue", "earnings", "profit", "sales"],
    "product-launch": ["新品", "推出", "上市", "launch"],
    "regulation": ["监管", "处罚", "召回", "recall", "fda", "warning", "ban"],
}
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
    if any(term.lower() in lower for term in EXCLUDED_TITLE_TERMS):
        return True
    looks_like_role_listing = any(term in lower for term in JOB_ROLE_TERMS)
    has_change_action = any(term.lower() in lower for term in CHANGE_ACTION_TERMS)
    return looks_like_role_listing and not has_change_action
def has_chinese_title(item):
    """Only publish an English-origin item after a Chinese display title exists."""
    title = item.get("title", "")
    original = item.get("titleOriginal", "")
    return len(re.findall(r"[\u4e00-\u9fff]", title)) >= 2 or len(re.findall(r"[\u4e00-\u9fff]", original)) >= 2

def compact_text(value):
    return re.sub(r"[\W_]+", "", (value or "").lower())

def item_text(item):
    parts = [
        item.get("title", ""),
        item.get("summary", ""),
        item.get("why", ""),
        " ".join(item.get("companies") or []),
        " ".join(item.get("tags") or []),
    ]
    return " ".join(str(part) for part in parts if part)

def item_entities(item):
    text = item_text(item).lower()
    entities = set()
    for canonical, aliases in ENTITY_ALIASES.items():
        if any(alias.lower() in text for alias in aliases):
            entities.add(canonical.lower())
    for name in item.get("companies") or []:
        if name:
            entities.add(str(name).lower())
    for entity in item.get("entities") or []:
        if isinstance(entity, dict) and entity.get("name"):
            entities.add(str(entity["name"]).lower())
    return entities

def item_actions(item):
    text = item_text(item).lower()
    actions = {item.get("category", "brands")}
    for group, terms in ACTION_GROUPS.items():
        if any(term.lower() in text for term in terms):
            actions.add(group)
    return actions

def shingles(text, size=3):
    compact = compact_text(text)
    if not compact:
        return set()
    if len(compact) <= size:
        return {compact}
    return {compact[i:i + size] for i in range(len(compact) - size + 1)}

def similarity(left, right):
    a = shingles(item_text(left))
    b = shingles(item_text(right))
    if not a or not b:
        return 0
    return len(a & b) / len(a | b)

def is_material_update(item, previous):
    text = item_text(item).lower()
    previous_text = item_text(previous).lower()
    if any(term.lower() in text for term in MATERIAL_UPDATE_TERMS):
        if not any(term.lower() in previous_text for term in MATERIAL_UPDATE_TERMS):
            return True
    if previous.get("verification") != "official" and item.get("verification") == "official":
        return True
    if previous.get("sourceTier") != "A" and item.get("sourceTier") == "A":
        return True
    return False

def same_event(item, previous):
    if item.get("url") and item.get("url") == previous.get("url"):
        return True
    if compact_text(item.get("title")) == compact_text(previous.get("title")):
        return True
    if item.get("category") != previous.get("category"):
        return False
    entities = item_entities(item)
    previous_entities = item_entities(previous)
    shared_entities = entities & previous_entities
    if not shared_entities:
        return False
    overlap = similarity(item, previous)
    shared_actions = item_actions(item) & item_actions(previous)
    if len(shared_entities) >= 2 and shared_actions and overlap >= 0.08:
        return True
    if shared_actions and overlap >= 0.30:
        return True
    if overlap >= 0.55:
        return True
    return False

def load_history(current_date, lookback_days=LOOKBACK_DAYS):
    archive = ROOT / "data/archive"
    if not archive.exists():
        return []
    history = []
    cutoff = datetime.now(timezone.utc) - timedelta(days=lookback_days)
    for path in sorted(archive.glob("*.json"), reverse=True):
        if path.stem == "index" or path.stem == current_date:
            continue
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for item in payload.get("items") or []:
            try:
                published = datetime.fromisoformat(item.get("publishedAt", "").replace("Z", "+00:00"))
            except Exception:
                published = cutoff
            if published >= cutoff:
                history.append(item)
    return history

def safe_log(message):
    try:
        print(message)
    except UnicodeEncodeError:
        print(message.encode("ascii", "backslashreplace").decode("ascii"))


def remove_historical_duplicates(items, current_date):
    history = load_history(current_date)
    if not history:
        return items
    kept = []
    dropped = 0
    for item in items:
        duplicate = next((old for old in history if same_event(item, old)), None)
        if duplicate and not is_material_update(item, duplicate):
            dropped += 1
            safe_log(f"dedup: dropped repeat '{item.get('title')}' seen as '{duplicate.get('title')}'")
            continue
        kept.append(item)
    safe_log(f"dedup: removed {dropped} historical repeats")
    return kept

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
                "titleOriginal": title,
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
        source_terms = source.get("keywords") or DISCOVERY_TERMS
        keywords = " OR ".join(f'"{term}"' if " " in term and not str(term).startswith("\"") else str(term) for term in source_terms)
        query = f'site:{source["domain"]} ({keywords}) when:7d'
        url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({
            "q": query,
            "hl": source.get("hl", "en-US"),
            "gl": source.get("gl", "US"),
            "ceid": source.get("ceid", "US:en"),
        })
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
                "id": item_id, "title": title, "titleOriginal": title, "summary": title,
                "why": "该事件进入今日公开信源候选池，后续将结合行业影响、信源等级和中国相关性生成编辑分析。",
                "analysis": {
                    "impact": "待 AI 生成：判断它影响品牌、渠道、资本、人事或监管的哪一环。",
                    "watch": "待 AI 生成：观察是否有官方确认、财务数据、渠道反馈或后续交易节点。",
                },
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
    for start in range(0, len(items), 1):
        batch = items[start:start + 1]
        prompt = (
            "将以下美妆行业候选新闻改写为中文结构化 JSON，不要虚构事实。"
            "返回 {items:[...]}。每项必须保留 id/url/publishedAt/source/sourceTier/signals/priorityPersonnel，"
            "必须保留 titleOriginal（原始标题，不翻译、不删减）；如果原始标题不是中文，必须将 title 翻译为自然、准确的中文标题，"
            "不能把英文原标题直接放进 title。title 不超过 36 个中文字符；summary、why、analysis 的每个字段均不超过 70 个中文字符。"
            "补全中文 summary、why、analysis、companies、tags；category 只能是 brands、people、"
            "deals、financials、products、channels、marketing、regulation、supply-chain 之一。"
            "summary 只写可核验事实；why 写一句行业意义；analysis 必须是对象，包含 impact 和 watch 两个字段，"
            "impact 用一句话分析对品牌/集团/渠道/资本/供应链的影响，watch 用一句话写后续观察点或验证缺口。"
            "保留 verification 和 sourceCount，不要降低官方信源的核验级别。候选："
            + json.dumps(batch, ensure_ascii=False)
        )
        body = json.dumps({
            "model":"openai/gpt-4.1",
            "response_format":{"type":"json_object"},
            "messages":[
                {"role":"system","content":"你是严谨的美妆商业新闻编辑，摘要只写事实，分析要具体、克制，避免营销话术和空泛判断。"},
                {"role":"user","content":prompt}
            ],
            "temperature":0.1,
            "max_tokens":2200
        }).encode()
        req = urllib.request.Request(
            "https://models.github.ai/inference/chat/completions",
            data=body,
            headers={"Authorization":f"Bearer {token}","Content-Type":"application/json","User-Agent":UA}
        )
        try:
            response = json.loads(fetch_request(req))
            content = response["choices"][0]["message"]["content"].strip()
            content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content, flags=re.IGNORECASE)
            result = json.loads(content)
            returned = {str(item.get("id")): item for item in result.get("items", []) if isinstance(item, dict) and item.get("id")}
            for original in batch:
                item = returned.get(str(original["id"]), original)
                item["titleOriginal"] = original.get("titleOriginal") or original.get("title", "")
                item.setdefault("title", original.get("title", ""))
                item.setdefault("summary", original.get("summary", ""))
                enriched.append(item)
        except Exception as exc:
            print(f"warning: GitHub Models batch fallback: {exc}")
            enriched.extend(batch)
    return enriched

def fetch_request(req):
    with urllib.request.urlopen(req, timeout=90) as response: return response.read()

def main():
    now = datetime.now(timezone.utc)
    current_date = now.astimezone().date().isoformat()
    items = [
        item for item in enrich(collect())
        if not excluded_title(item.get("title", "")) and has_chinese_title(item)
    ]
    items = remove_historical_duplicates(items, current_date)
    if not items: raise SystemExit("No candidates collected; existing feed preserved")
    payload = {"date":current_date,"generatedAt":now.isoformat(),"items":items}
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