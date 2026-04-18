# ChatGPT Tarot Divination (Frontend)

React + Vite 前端项目。

> 现在支持两种模式：  
> 1) **后端模式**：前端请求 `/api/v1/settings` 与 `/api/divination`；  
> 2) **纯前端模式**：不配置 `VITE_API_BASE`，由浏览器直接调用模型 API（需在设置页填写 API 参数）。

### 后端是做什么的？

- 提供 `/api/v1/settings`，下发登录开关、限流配置、默认模型等运行时配置。
- 提供 `/api/divination`，统一封装占卜 Prompt、模型调用与流式输出（SSE）。
- 可选提供登录鉴权、频率限制、错误日志等服务端能力。

### 可以不要后端吗？

可以。当前前端已内置纯前端模式，不配置 `VITE_API_BASE` 时会：

1. 使用本地默认设置（不开启登录、限流）；
2. 直接调用你在设置页填写的模型接口；
3. 在前端完成 Prompt 组装和流式解析。

> 注意：纯前端模式会把 API Key 放在浏览器侧，存在泄露风险，仅建议个人自用。

### 纯前端默认 Key + 限流（环境变量）

参考 `TarotWhisper` 方案，纯前端模式支持通过构建时变量提供“默认可用配置”，用户也可在设置页填写自己的配置覆盖默认值：

```bash
# 默认可用模型配置（可选）
VITE_FALLBACK_API_BASE=https://api.openai.com/v1
VITE_FALLBACK_API_KEY=sk-xxxx
VITE_FALLBACK_MODEL=gpt-4o-mini

# 默认 Key 的前端限流（每小时，默认 10）
VITE_RATE_LIMIT_PER_HOUR=10
```

- 当用户未填写自定义配置时，前端会使用 `VITE_FALLBACK_API_*`。
- 当用户填写了自己的 API 配置时，优先使用用户配置（不占用默认 Key 限额）。

### 腾讯 EdgeOne 应该填哪些变量？

建议按下面分组填写：

**必填（推荐）**

```bash
VITE_ROUTER_MODE=hash
```

**二选一**

1. 后端模式（二选一方案 A）

```bash
VITE_API_BASE=https://你的后端地址
```

2. 纯前端模式（二选一方案 B）

```bash
VITE_FALLBACK_API_BASE=https://api.openai.com/v1
VITE_FALLBACK_API_KEY=sk-xxxx
VITE_FALLBACK_MODEL=gpt-4o-mini
VITE_RATE_LIMIT_PER_HOUR=10
```

说明：
- 你说的“api 和密钥、限流”都已支持（对应 `VITE_FALLBACK_API_BASE / KEY / RATE_LIMIT_PER_HOUR`）。
- 如果用户在页面设置里填了自己的 API 配置，会自动覆盖默认值，不占默认 key 限额。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建与预览

```bash
pnpm build
pnpm preview
```

## 部署后打开子路由出现 404（NOT_FOUND）怎么办？

这是单页应用（SPA）常见问题：直接访问 `/divination/tarot` 这类前端路由时，托管平台会尝试查找同名物理文件，导致 404。

本仓库已提供两种回退配置：

- **Vercel**：`vercel.json` 中将所有路径重写到 `index.html`。
- **Netlify / 静态托管兼容**：`public/_redirects` 中配置 `/* /index.html 200`。

- **腾讯 EdgeOne Pages**：不支持用 `edgeone.json` 对 SPA 前端路由做重写，建议将路由切换为 Hash 模式（URL 形如 `/#/divination/tarot`）。

如果你部署在腾讯 EdgeOne Pages，建议额外配置：

```bash
# 在 EdgeOne Pages 的环境变量里添加
VITE_ROUTER_MODE=hash
# 后端 API 地址（必须是可公网访问的后端域名）
VITE_API_BASE=https://your-api-domain.com
```

如果你没有域名，也可以先用后端服务器的公网 IP（如 `http://1.2.3.4:8000`，生产建议 HTTPS）。

这样打包后会使用 `HashRouter`，刷新或直达子路由不会再触发平台 404。


如果你的 EdgeOne 项目是“从仓库根目录构建”（不是 `frontend/` 子目录），可直接在仓库根目录放置 `edgeone.json`：

```json
{
  "installCommand": "cd frontend && pnpm install",
  "buildCommand": "cd frontend && VITE_ROUTER_MODE=hash pnpm build",
  "outputDirectory": "frontend/dist"
}
```

这能避免平台在根目录找不到 `index.html`（典型报错就是 `404: NOT_FOUND / The page does not exist`）。

> 如果你看到 `Failed to fetch settings: Unexpected token '<' ...`，通常说明前端请求到了 HTML 页面而不是后端 JSON 接口。请检查 `VITE_API_BASE` 是否正确指向后端服务。

部署后请确认：

1. 构建输出目录为 `dist`
2. 平台使用 `pnpm build` 作为构建命令
3. 重写规则已生效（清缓存后再访问子路由）
