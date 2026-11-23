#!/usr/bin/env python3
"""Build a browsable, de-duplicated index from existing daily snapshots."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = ROOT / 'data'
paths = [data / 'latest.json', *sorted((data / 'archive').glob('????-??-??.json'), reverse=True)]
items, seen_ids, seen_titles = [], set(), set()
for path in paths:
    try:
        payload = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        continue
    for item in payload.get('items', []):
        item_id = str(item.get('id', ''))
        title = re.sub(r'\W+', '', (item.get('titleOriginal') or item.get('title') or '').lower())
        if not item_id or not title or item_id in seen_ids or title in seen_titles:
            continue
        seen_ids.add(item_id)
        seen_titles.add(title)
        items.append(item)
(data / 'history.json').write_text(json.dumps({'items': items}, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f'Indexed {len(items)} unique historical items')
