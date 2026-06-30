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

def collect():
    found = []
    for source in CONFIG["queries"]:
        query = f'site:{source["domain"]} ({CONFIG["keywords"]}) when:2d'
        url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q":query,"hl":"en-US","gl":"US","ceid":"US:en"})
        try: root = ET.fromstring(fetch(url))
        except Exception as exc:
            print(f"warning: {source['name']}: {exc}"); continue
        for entry in root.findall("./channel/item")[:12]:
            raw_title = html.unescape(entry.findtext("title") or "").strip()
            title = re.sub(r"\s+-\s+[^-]+$", "", raw_title).strip()
            link = (entry.findtext("link") or "").strip()
            if not title or not link: continue
            try: published = email.utils.parsedate_to_datetime(entry.findtext("pubDate") or "").astimezone(timezone.utc)
            except Exception: published = datetime.now(timezone.utc)
            sig = signals(title, source)
            item_id = hashlib.sha1((title + source["domain"]).encode()).hexdigest()[:14]
            found.append({
                "id": item_id, "title": title, "summary": title,
                "why": "该事件进入今日公开信源候选池，建议结合原始报道判断业务影响。",
                "category": category(title), "source": source["name"], "sourceTier": source["tier"],
                "verification": "reported", "sourceCount": 1, "publishedAt": published.isoformat(),
                "publishedLabel": "最近 48 小时", "url": link, "companies": [],
                "tags": [source["name"], "自动采集"], "baseScore": 60, "signals": sig
            })
    dedup = {}
    for item in sorted(found, key=lambda x:x["publishedAt"], reverse=True):
        key = re.sub(r"\W+", "", item["title"].lower())[:80]
        dedup.setdefault(key, item)
    return list(dedup.values())[:40]

def enrich(items):
    token = os.getenv("GITHUB_TOKEN")
    if not token or not items: return items
    prompt = "将以下美妆行业候选新闻改写为中文结构化 JSON。不要虚构事实。返回 {items:[...]}，每项保留 id/url/publishedAt/source/sourceTier/signals，补全中文 title、summary、why、category、companies、tags；verification 固定 reported，sourceCount 固定 1。候选：" + json.dumps(items, ensure_ascii=False)
    body = json.dumps({"model":"openai/gpt-4.1","response_format":{"type":"json_object"},"messages":[{"role":"system","content":"你是严谨的美妆商业新闻编辑。"},{"role":"user","content":prompt}],"temperature":0.1,"max_tokens":7000}).encode()
    req = urllib.request.Request("https://models.github.ai/inference/chat/completions", data=body, headers={"Authorization":f"Bearer {token}","Content-Type":"application/json","User-Agent":UA})
    try:
        response = json.loads(fetch_request(req)); result = json.loads(response["choices"][0]["message"]["content"])
        return result.get("items") or items
    except Exception as exc:
        print(f"warning: GitHub Models fallback: {exc}"); return items

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
    print(f"wrote {len(items)} items")
if __name__ == "__main__": main()