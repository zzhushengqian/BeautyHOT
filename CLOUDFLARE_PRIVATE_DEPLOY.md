# BeautyHOT 私有跨设备部署

目标：GitHub 私有仓库继续保存代码和每日数据，Cloudflare Pages 提供网页，Cloudflare Access 只允许指定邮箱登录。

## 一、连接私有仓库

1. 登录 Cloudflare，进入 **Workers & Pages**。
2. 选择 **Create application → Pages → Connect to Git**。
3. 安装 Cloudflare GitHub App 时只授权 `zzhushengqian/BeautyHOT`。
4. 生产分支选择 `main`。
5. 本项目是纯静态网页：构建命令留空，输出目录填写 `.`。
6. 完成首次部署，但在 Access 配置完成前不要把地址发给别人。

## 二、限制访问

1. 进入 **Zero Trust → Access → Applications**。
2. 新建 **Self-hosted application**。
3. Hostname 填写实际的 BeautyHOT Pages 主机名，例如 `beautyhot.pages.dev`。
4. 建立 Allow 策略，只允许你自己的邮箱；登录方式可用 Email one-time PIN。
5. 不要添加 `Everyone`、`Bypass` 或公开允许规则。
6. 用无痕窗口访问网页，确认先出现 Cloudflare 登录页；未授权邮箱应被拒绝。

注意：只开启 Pages 的“预览部署保护”不等于保护生产网址，生产主机名也必须单独加入 Access 应用。

## 三、设备切换

手机或另一台电脑打开同一个 Pages 地址，输入获准邮箱，使用邮件验证码登录。无需公开 GitHub 仓库，也无需在每台设备运行本地服务器。

## 四、安全与内容边界

- 私有仓库和 Access 是访问控制，不等于获得新闻转载授权。
- 页面只保存标题、事实性短摘要、来源、时间和原文链接。
- 不保存原文全文、图片、付费内容，不绕过登录、验证码、robots.txt 或反爬限制。
- `robots.txt` 和 `_headers` 用于减少搜索引擎收录，但真正的保密依赖 Cloudflare Access。
- Cloudflare、GitHub 账户都应开启双重验证。

## 五、每天更新

GitHub Actions 中的 **BeautyHOT Personal Daily** 每天北京时间 08:00 更新 `data/latest.json`。Cloudflare Pages 连接仓库后会在新提交出现时自动重新部署。
