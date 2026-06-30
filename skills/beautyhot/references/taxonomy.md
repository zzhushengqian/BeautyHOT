# BeautyHOT 分类与数据规范

## 分类

每条只设一个主分类，可附多个标签。

| slug | 中文名 | 包含事件 |
|---|---|---|
| `brands` | 品牌与公司 | 品牌战略、市场进入/退出、组织重组、授权合作 |
| `people` | 人事与组织 | 任命、晋升、离任、创始人变动、团队调整 |
| `deals` | 投融资与并购 | 融资、并购、少数股权、合资、IPO、基金动作 |
| `financials` | 财报与经营 | 业绩、指引、裁员、门店与成本调整 |
| `products` | 产品与研发 | 新品、成分、专利、临床与技术合作 |
| `channels` | 渠道与零售 | 电商、线下零售、旅行零售、分销与跨境 |
| `marketing` | 营销与趋势 | 代言、传播、消费者趋势；过滤纯软文 |
| `regulation` | 法规与合规 | 法规、抽检、召回、处罚、广告与功效宣称 |
| `supply-chain` | 供应链 | 原料、包材、代工、产能、可持续与供应风险 |

## 标准字段

```json
{
  "id": "稳定字符串或留空待系统生成",
  "title": "中文规范标题",
  "titleOriginal": "原文标题",
  "summary": "仅包含可核验事实的摘要",
  "whyItMatters": "编辑判断：为什么值得关注",
  "category": "deals",
  "tags": ["香水", "中国品牌"],
  "entities": [
    {
      "name": "品牌或公司规范名",
      "nameOriginal": "原始名称",
      "type": "brand|company|person|investor|regulator"
    }
  ],
  "region": ["CN"],
  "eventStage": "rumor|reported|announced|signed|approved|closed|effective",
  "verificationStatus": "official|corroborated|single-source|unverified",
  "publishedAt": "ISO 8601",
  "eventDate": "YYYY-MM-DD 或 null",
  "collectedAt": "ISO 8601",
  "sources": [
    {
      "name": "来源名称",
      "url": "原始页面 URL",
      "publishedAt": "ISO 8601 或 null",
      "sourceTier": "A|B|C|D",
      "isPrimary": true
    }
  ],
  "aiSelected": true,
  "selectionReason": "被选为热点的简短理由"
}
```

## 规范化规则

- `title` 使用“主体 + 动作 + 关键结果”，避免“重磅”“炸裂”等夸张词。
- 品牌和公司分开建实体；品牌归属关系不确定时不要猜测。
- 金额保留原币种与原始数值，换算值注明汇率日期。
- `eventDate` 是事件生效或发生日期，`publishedAt` 是来源发布时间。
- `eventStage` 不适用时可为 `null`，不要强行填写。
- 地域使用 ISO 3166-1 alpha-2；全球事件可用 `GLOBAL`。
- 转载只保留为补充来源，不把转载发布时间当事件发生时间。

## 核验状态

- `official`：有公司、监管、交易所或当事人正式文件。
- `corroborated`：无一手文件，但有两个以上相互独立的可靠来源。
- `single-source`：只有一个具名可靠媒体来源。
- `unverified`：社交线索、匿名爆料或无法阅读全文；不得进入正式精选，只能进入“待观察”。

## 精选评分

内部可按 100 分粗排，不向读者展示分数：

- 行业影响 0–30
- 可信度 0–25
- 新鲜度 0–15
- 中国相关性 0–15
- 信息增量 0–10
- 读者价值 0–5

出现以下情况扣分：

- 纯品牌软文：-20
- 只有单一低等级来源：-20
- 与已有事件高度重复：-30
- 标题夸大且正文无支持：-20

重大监管、安全事件即使分数不高，也应人工置顶。

## 去重键

优先使用：

`规范主体 + 事件动作 + 事件阶段 + 事件日期`

示例：

- “A 品牌获 B 基金投资”与“A 品牌完成亿元融资”可能是同一事件，应核对投资方和日期。
- “C 集团洽谈收购 D”与“C 签署收购协议”属于不同阶段，可作为同一事件链的更新。
- “E 任命新 CEO”与“前 CEO 离任”可合并，但要保留两个动作和各自生效日期。
