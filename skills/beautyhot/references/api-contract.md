# BeautyHOT 建议 API 契约

本文件用于网站 API 尚未定型时的设计基线。已有真实 API 时，以其 OpenAPI 文档为准，不要假设端点存在。

## 推荐公开端点

| 端点 | 用途 |
|---|---|
| `GET /api/public/items` | 查询资讯条目 |
| `GET /api/public/daily` | 最新日报 |
| `GET /api/public/daily/{date}` | 指定日期日报 |
| `GET /api/public/dailies` | 日报存档索引 |
| `GET /openapi.yaml` | 机器可读接口文档 |

## `items` 推荐参数

- `mode=selected|all`
- `category=<taxonomy slug>`
- `since=<ISO 8601>`
- `until=<ISO 8601>`
- `q=<关键词>`
- `entity=<品牌、公司或人物>`
- `region=<ISO 地域代码>`
- `take=1..100`
- `cursor=<不透明翻页 token>`

默认行为建议：

- 默认 `mode=selected`
- 默认最多返回最近 7 天
- 按 `publishedAt` 倒序
- `cursor` 视为黑盒，不允许客户端解析

## 条目返回

字段采用 [taxonomy.md](taxonomy.md) 中的标准结构。列表响应建议为：

```json
{
  "count": 20,
  "hasNext": false,
  "nextCursor": null,
  "items": []
}
```

## 日报返回

```json
{
  "date": "2026-06-30",
  "generatedAt": "2026-06-30T00:30:00Z",
  "lead": {
    "title": "今日主线",
    "paragraph": "主编速读"
  },
  "sections": [
    {
      "category": "deals",
      "label": "投融资与并购",
      "items": []
    }
  ],
  "watchlist": []
}
```

## 接入原则

1. 先读取 `/openapi.yaml`，核对真实参数、鉴权、限流和字段。
2. 公开查询接口尽量匿名只读；后台写入接口必须单独鉴权。
3. API Token 只从环境变量或安全凭据存储读取，不写入 skill 或仓库。
4. 为每条内容永久保留原始来源 URL、采集时间和核验状态。
5. 对外输出不要泄漏后台 token、内部注释、抓取日志或版权受限正文。
