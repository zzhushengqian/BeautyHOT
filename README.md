# BeautyHOT

美妆行业热点聚合与个性化排序网站。

- GitHub Pages 免费托管
- GitHub Actions 每天北京时间 08:00 更新
- GitHub Models 免费额度用于中文归纳
- 浏览器本地保存个人信息权重
- 自动归档每日 `data/archive/YYYY-MM-DD.json`

## 手动更新

在 Actions 页面运行 **BeautyHOT Daily** 的 `workflow_dispatch`。

## 信源

公开候选来自 `config/sources.json` 中配置的垂直媒体、监管与可靠新闻来源。自动采集只保存标题、摘要与原文链接，不复制受版权保护的全文。