# BeautyHOT（个人研究版）

仅供仓库所有者个人、非商业的美妆行业信息研究使用。

- 私有 GitHub 仓库存储
- GitHub Actions 每天北京时间 08:00 更新
- `data/latest.json` 保存最新候选
- `data/archive/YYYY-MM-DD.json` 保存每日存档
- 网页仅通过 Cloudflare Access 登录保护后供本人跨设备使用
- 不提供公开网站、不用于广告或商业服务

## 内容边界

- 只保存标题、事实性短摘要、来源名称、发布时间和原始链接。
- 不保存新闻全文、原文导语、图片、视频或付费内容。
- 不绕过登录、付费墙、验证码、robots.txt 或技术访问限制。
- 自动摘要可能出错，重要事项必须回到原始来源核验。
- 权利人要求停止处理或删除内容时，应及时删除对应记录和存档。

## 手动更新

在仓库的 Actions 页面运行 **BeautyHOT Personal Daily**。

## 私有跨设备访问

不要重新开启公开 GitHub Pages。使用 Cloudflare Pages 连接本私有仓库，并为生产主机名配置 Cloudflare Access，只允许本人邮箱。具体步骤见 `CLOUDFLARE_PRIVATE_DEPLOY.md`。
