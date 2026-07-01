# BeautyHOT 新聊天交接说明

生成日期：2026-07-01

## 项目目标

构建一个仅供个人、非商业研究使用的美妆行业热点网站，体验参考 AIHOT。内容覆盖品牌动态、人事变动、投融资与并购、财报业绩、新品研发、渠道零售、营销趋势、供应链和监管。

## 当前状态

- 本地项目：`C:\Users\neil\Documents\BeautyHOT`
- 私有 GitHub 仓库：`zzhushengqian/BeautyHOT`
- GitHub Pages 已关闭，因此旧公开网址无法访问，这是预期结果。
- 本地网页可通过开发服务器访问 `http://127.0.0.1:4173/`。
- GitHub Actions 工作流 `BeautyHOT Personal Daily` 设置为每天北京时间 08:00 更新。
- 最新候选写入 `data/latest.json`，每日结果写入 `data/archive/YYYY-MM-DD.json`。
- 网页支持新闻浏览、分类筛选、搜索和按用户权重排序。

## 已纳入的重要信源

- Global Cosmetics News
- HAPPI
- Cosmetics Business
- Cosmetics & Toiletries
- Global Cosmetic Industry / GCI Magazine
- 品牌官网、集团投资者关系页面、监管公告、交易所披露等一手来源

## 排名原则

用户已经调整过信息权重。排序引擎读取每条新闻的 `signals` 和 `flags`，结合类别、企业重要性、事件级别、来源可靠性、时效性与风险提示计算分数。

特别偏好：

- 国际前十和国内前十化妆品集团的消息权重更高。
- 财报、重大人事、投融资并购和监管变化通常优先。
- 一手官方信源高于转述和聚合来源。
- 未确认消息、重复报道和营销软文应降权或排除。

## 合规选择

- 仅个人、非商业使用。
- GitHub 仓库保持私有。
- 不存储或展示新闻全文、原文导语、图片、视频或付费内容。
- 只保留标题、事实性短摘要、来源、发布时间、原文链接和排序元数据。
- 不绕过登录、付费墙、验证码、robots.txt 或技术访问限制。
- 人事新闻只处理公开职业身份与任职事实。
- 权利人提出删除要求时，删除对应记录及存档。

私有访问只能降低暴露面，不能消除版权、网站条款、个人信息或不正当竞争风险。

## 当前推荐的跨设备方案

使用 **Cloudflare Pages + Cloudflare Access**：

1. 私有 GitHub 仓库继续作为代码与数据源。
2. Cloudflare Pages 从该私有仓库部署静态网页。
3. Cloudflare Access 对生产主机名启用登录保护，只允许用户指定邮箱。
4. 手机和电脑使用同一地址，通过邮箱验证码登录。

详细步骤见仓库根目录 `CLOUDFLARE_PRIVATE_DEPLOY.md`。

重要：Pages 的预览保护不自动保护生产地址；必须为实际生产主机名单独创建 Access 应用和 Allow 策略。

## 关键文件

- `index.html`：页面结构
- `styles.css`、`weights.css`：页面样式
- `app.js`：新闻加载、搜索和筛选
- `weight-engine.js`：权重和排名
- `data/latest.json`：最新候选新闻
- `scripts/refresh_daily.py`：每日抓取与摘要脚本
- `config/sources.json`：信源配置
- `.github/workflows/beautyhot.yml`：每日自动更新
- `PERSONAL_USE.md`：个人使用和合规边界
- `robots.txt`、`_headers`：减少索引与浏览器安全响应头

## 下一步

1. 用户登录或注册 Cloudflare。
2. 只授权 Cloudflare GitHub App 访问 `zzhushengqian/BeautyHOT`。
3. 创建 Pages 项目，生产分支为 `main`，无构建命令，输出目录为 `.`。
4. 对实际 `pages.dev` 主机名创建 Cloudflare Access 应用，只允许用户邮箱。
5. 用无痕窗口验证未登录和未授权邮箱均无法访问。
6. 验证 08:00 自动更新和 Cloudflare 自动部署。

## 不包含的敏感信息

本交接材料不包含 GitHub 密码、Cloudflare 密码、访问令牌、Cookie、邮箱验证码或其他认证凭据。新聊天也不应要求用户把这些信息粘贴进对话。
