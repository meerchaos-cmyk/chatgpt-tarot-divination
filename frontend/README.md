# ChatGPT Tarot Divination (Frontend)

React + Vite 前端项目。

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
```

这样打包后会使用 `HashRouter`，刷新或直达子路由不会再触发平台 404。

部署后请确认：

1. 构建输出目录为 `dist`
2. 平台使用 `pnpm build` 作为构建命令
3. 重写规则已生效（清缓存后再访问子路由）
