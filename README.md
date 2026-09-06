# 丁凯 · 简历

独立可运行的简历页面（Next.js 15 + Tailwind CSS v4），源代码来自主项目
`dikweb/src/components/home/index.tsx`，抽取出其依赖的 shadcn/ui 组件与样式配置，可单独运行/部署。

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000 查看。

## 目录结构

```
src/
  app/page.tsx              # 首页：渲染 <Home />
  app/layout.tsx            # 根布局（引入 globals.css）
  app/globals.css           # Tailwind v4 + 主题变量
  components/home/index.tsx # 简历内容主体
  components/ui/            # 依赖的 shadcn/ui 组件（card/badge/separator/collapsible）
  lib/utils.ts              # cn() 工具
public/avatars/avatar.webp  # 头像
```
