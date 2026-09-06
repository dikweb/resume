"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  ExternalLink,
  Phone,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  imHighlights,
  backendImHighlights,
  authModuleIntro,
  authSystemHighlights,
  difyHighlights,
  agentHighlights,
  componentHighlights,
  learningIntro,
  learningCourses,
  type Course,
} from "./resumeData";
import { HighlightSection } from "./section-ui";
import NewResumeLayout from "./new-layout";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";


function LearningCard({ course }: { course: Course }) {
  return (
    <Card className="shadow-none border-border/60 hover:border-border transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-foreground">
            {course.title}
          </h3>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            系统学习 · 动手实践
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {course.position}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
          {course.points.map((point) => (
            <li key={point.title}>
              <b className="font-semibold text-foreground/80">{point.title}：</b>
              {point.desc}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          {course.tags.map((tag) => (
            <Badge key={tag.name} variant={tag.accent ? "default" : "secondary"}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type ViewMode = "new" | "classic";

function LayoutSwitch({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const items: { key: ViewMode; label: string }[] = [
    { key: "new", label: "新版 · Tab 布局" },
    { key: "classic", label: "经典版 · 长文" },
  ];
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 rounded-l-2xl rounded-r-none bg-background/80 backdrop-blur p-1 border border-r-0 border-border/60 shadow-md">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onChange(it.key)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            view === it.key
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<ViewMode>("new");
  return (
    <div className="w-full flex flex-col items-center">
      <LayoutSwitch view={view} onChange={setView} />
      {view === "new" ? <NewResumeLayout /> : <ClassicResume />}
    </div>
  );
}

function ClassicResume() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-10">
      {/* ── Header ── */}
      <header className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-border shadow-lg">
            <Image
              src={`${mediaBasePath}/avatars/avater.jpg`}
              alt="丁凯"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          丁凯
        </h1>
        <p className="mt-1.5 text-base font-light">
          高级前端开发工程师 · 7 年经验
        </p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground/80">
          热爱技术，持续学习
        </p>

        <div className="flex items-center gap-5 mt-4 text-sm text-muted-foreground">
          <a
            href="mailto:1196715913@qq.com"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Mail size={14} />
            1196715913@qq.com
          </a>
          <a
            href="tel:18301926957"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Phone size={14} />
            18301926957
          </a>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap size={14} />
            东华大学 · 全日制硕士(211)
          </span>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* ── Work Experience ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          工作经历
        </h2>

        <Card className="shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent>
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground">
                      江苏红网
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      高级前端工程师
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      umi
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      next
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      vue
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      koa2
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    2024.04 - 至今
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                    <li>
                      独立从零设计并开发 DikWeb IM
                      企业内网即时通讯系统（全栈），技术栈 Next.js 15 + React 19
                      + Koa + Socket.io + MongoDB，服务于云桌面内网通讯场景。
                    </li>
                    <li>
                      主导自研智能分析 Agent 产品前端架构设计，实现多类型 SSE
                      流式响应渲染引擎、指标管理全链路（数据源 → 数据集 → 维度 →
                      指标 → 物化）、问答与智能建议功能。
                    </li>
                    <li>
                      主导 Dify 开源项目二次开发，深度改造 Chat
                      模块（联网搜索、深度思考推理链路、文件上传）、Workflow
                      模块（自定义文档检索节点、会话文档召回节点）、知识库与召回测试模块，技术栈为
                      Next.js + shadcn/ui。
                    </li>
                    <li>
                      主导指数项目（指数管理系统、指数系统、门户系统）前端开发，在系统权限模块中自研
                      Webpack 插件将 Umi 路由配置文件输出至 dist
                      目录，实现前后端共用路由配置，消除手动同步的不一致问题。
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-border/50 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground">
                      SHEIN
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      高级前端工程师
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      react
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    2021.01 - 2024.03
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                    <li>
                      主要负责财务前端系统中5个不同业务系统（B端）的功能开发及维护，同时协助其他同事完成其他业务系统的开发工作。
                    </li>
                    <li>
                      与产品对接评审PRD，完成日常需求/项目的开发，协助测试工程师及产品测试验收，顺利按时上线。
                    </li>
                    <li>
                      整合系统相同模块、去差异化、封装多系统间公用的组件以及工具函数。
                    </li>
                    <li>
                      统一了各系统间的样式，以及组件的使用，使得多系统具备相同的维护习惯，注重前端标准化。
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold text-foreground">
                      优集计算机
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      软件实施/Web前端工程师
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      vue
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    2019.04 - 2020.12
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                    <li>
                      使用 Vue、Vuex 和 Vue Router
                      将现有门户界面进行重构，提高了应用性能并优化用户体验。
                    </li>
                    <li>
                      与后端、产品和设计团队紧密合作，确保功能与视觉设计的实现，同时根据产品反馈快速迭代。
                    </li>
                    <li>
                      西门子 Teamcenter ‌产品生命周期管理 (PLM)
                      <b className="font-bold text-zinc-700"> 软件‌实施</b>
                      ，主要帮企业管产品从设计、制造到服务的全流程数据和流程。
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Project Experience ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          项目经历
        </h2>

        {/* DikWeb IM */}
        <Card className="shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4">
            {/* 项目头部 */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground">
                    DikWeb IM 即时通讯系统
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    全栈项目 · 独立开发
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  企业级 IM 即时通讯与统一身份认证一体化平台。前端 Next.js 15 +
                  React 19，后端 Koa + Socket.io +
                  MongoDB，前后端分离架构，独立从零设计并实现全部功能链路。
                </p>
              </div>
            </div>

            {/* ── Module 1: 统一身份认证体系 ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-primary/70" />
                <h4 className="text-sm font-semibold text-foreground/80">
                  模块一：统一身份认证体系
                </h4>
              </div>
              <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                {authModuleIntro}
              </p>
              <HighlightSection items={authSystemHighlights} />
              <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                <span>5 层中间件链</span>
                <span>JWT + Session 混合认证</span>
                <span>GitHub OAuth 2.0</span>
                <span>Nodemailer + EJS</span>
                <span>多模式认证 + 路由守卫</span>
              </div>
            </div>

            {/* ── Module 2: 实时通讯系统 ── */}
            <div className="pt-5 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-chart-1/70" />
                <h4 className="text-sm font-semibold text-foreground/80">
                  模块二：实时通讯系统
                </h4>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-sky-500/70 rounded-sm shrink-0" />
                <h5 className="text-xs font-semibold text-foreground/70">
                  前端 — Next.js + React 架构
                </h5>
              </div>
              <HighlightSection
                items={imHighlights}
              />
              <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                <span>36+ 组件</span>
                <span>Socket.io 双向类型契约</span>
                <span>8 套 RESTful API</span>
                <span>4 层 Zustand Store</span>
              </div>

              {/* 后端实现 */}
              <div className="pt-4 mt-4 border-t border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-emerald-500/70 rounded-sm shrink-0" />
                  <h5 className="text-xs font-semibold text-foreground/70">
                    后端 — Koa + Socket.io + MongoDB 架构
                  </h5>
                </div>
                <HighlightSection
                  items={backendImHighlights}
                />
                <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                  <span>10 类 Socket 事件处理</span>
                  <span>5 个 MongoDB 集合</span>
                  <span>原子化消息操作</span>
                  <span>Ali-OSS 直传</span>
                </div>
              </div>
            </div>

            {/* 技术栈 */}
            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Next.js 15", accent: true },
                  { name: "React 19", accent: true },
                  { name: "TypeScript", accent: true },
                  { name: "Socket.io", accent: true },
                  { name: "Zustand" },
                  { name: "Reselect" },
                  { name: "Tailwind CSS" },
                  { name: "Radix UI" },
                  { name: "Ant Design" },
                  { name: "Axios" },
                  { name: "Zod", accent: true },
                  { name: "React Hook Form", accent: true },
                  { name: "Mitt" },
                  { name: "MediaRecorder API" },
                  { name: "IntersectionObserver" },
                  { name: "js-web-screen-shot" },
                  { name: "Crypto-JS" },
                  { name: "MD5" },
                  // 后端技术栈
                  { name: "Koa", accent: true },
                  { name: "MongoDB/Mongoose", accent: true },
                  { name: "JWT" },
                  { name: "Nodemailer" },
                  { name: "Ali-OSS" },
                  { name: "Multer" },
                  { name: "EJS" },
                  { name: "koa-session" },
                  { name: "svg-captcha" },
                  { name: "maskdata" },
                ].map((tech) => (
                  <Badge
                    key={tech.name}
                    variant={tech.accent ? "default" : "secondary"}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dify 二次开发 */}
        <Card className="mt-4 shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground">
                    Dify 企业级 AI 平台二次开发
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    Next.js · shadcn/ui · 二次开发
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  基于开源 Dify 平台进行深度二次开发，改造 Chat
                  对话模块、Workflow
                  工作流模块、知识库与召回测试模块，满足企业级 AI 应用场景需求。
                  项目规模 50 万+
                  行代码，在保持与上游开源仓库定期同步的前提下完成定制功能的可持续迭代。
                </p>
              </div>
              <a
                href="https://github.com/langgenius/dify"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dify 开源仓库
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 rounded-full bg-violet-500/70" />
              <h4 className="text-sm font-semibold text-foreground/80">
                Chat 对话模块 &amp; Workflow 工作流模块 &amp; 知识库体系
              </h4>
            </div>
            <HighlightSection
              items={difyHighlights}
            />
            <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
              <span>6 大功能模块改造</span>
              <span>4 种 SSE 事件类型</span>
              <span>2 个自定义 Workflow 节点</span>
              <span>50 万+ 行代码项目</span>
            </div>

            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Next.js", accent: true },
                  { name: "TypeScript", accent: true },
                  { name: "shadcn/ui", accent: true },
                  { name: "SSE" },
                  { name: "Zustand" },
                  { name: "ReactFlow", accent: true },
                  { name: "Tailwind CSS" },
                  { name: "Radix UI" },
                  { name: "TanStack Query" },
                  { name: "RAG" },
                  { name: "SWR" },
                  { name: "i18n" },
                ].map((tech) => (
                  <Badge
                    key={tech.name}
                    variant={tech.accent ? "default" : "secondary"}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 智能分析 Agent */}
        <Card className="mt-4 shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground">
                    智能分析 Agent
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    自研产品 · 前端架构
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  基于指标平台的 AI
                  智能分析产品，支持自然语言问答、智能推荐与趋势分析。底层对接数据源
                  → 数据集 → 维度 → 指标 → 物化全链路，前端实现多类型 SSE
                  流式响应渲染引擎，一条连接承载
                  Markdown/图表/表格/操作建议等多种内容形态。
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 rounded-full bg-amber-500/70" />
              <h4 className="text-sm font-semibold text-foreground/80">
                指标全链路 &amp; 多类型 SSE 流渲染 &amp; 问答系统
              </h4>
            </div>
            <HighlightSection
              items={agentHighlights}
            />
            <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
              <span>6 种 SSE 流类型</span>
              <span>5 层指标管理链路</span>
              <span>4 种推荐类型</span>
              <span>10 万+ 数据量优化</span>
            </div>

            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "React", accent: true },
                  { name: "TypeScript", accent: true },
                  { name: "SSE", accent: true },
                  { name: "ECharts", accent: true },
                  { name: "Monaco Editor" },
                  { name: "Zustand" },
                  { name: "React Hook Form" },
                  { name: "Zod" },
                  { name: "Ant Design" },
                  { name: "Vite" },
                  { name: "WebSocket" },
                  { name: "LTTB 采样" },
                ].map((tech) => (
                  <Badge
                    key={tech.name}
                    variant={tech.accent ? "default" : "secondary"}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 财务业务组件库 FMS */}
        <Card className="mt-4 shadow-none border-border/60 hover:border-border transition-colors">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground">
                    财务业务组件库 FMS
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    业务组件 · NPM 包
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  针对财务前端多系统间组件版本不一致、辅助功能重复编写、Tab
                  缓存难以维护等痛点，封装 FMSSearchTable 与 FMSModal
                  两个核心业务组件，首次将业务组件发布为公司级 NPM
                  包，统一了跨系统组件版本并显著提升团队开发效率。
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 rounded-full bg-orange-500/70" />
              <h4 className="text-sm font-semibold text-foreground/80">
                FMSSearchTable &amp; FMSModal &amp; NPM 发布
              </h4>
            </div>
            <HighlightSection
              items={componentHighlights}
            />
            <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
              <span>2 个核心组件</span>
              <span>跨 N 系统统一版本</span>
              <span>页面级缓存</span>
              <span>NPM 包全链路</span>
            </div>

            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "React", accent: true },
                  { name: "React Query", accent: true },
                  { name: "TypeScript" },
                  { name: "Axios" },
                  { name: "Ant Design" },
                  { name: "dumi" },
                  { name: "semantic-release" },
                  { name: "commitlint" },
                ].map((tech) => (
                  <Badge
                    key={tech.name}
                    variant={tech.accent ? "default" : "secondary"}
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── AI Agent 体系化学习与实践 ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-5">
          AI Agent 全栈 · 体系化学习与实践
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-3xl">
          {learningIntro}
        </p>
        <div className="space-y-4">
          {learningCourses.map((course) => (
            <LearningCard key={course.title} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
