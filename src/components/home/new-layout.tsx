"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  authModuleIntro,
  authSystemHighlights,
  imHighlights,
  backendImHighlights,
  difyHighlights,
  agentHighlights,
  componentHighlights,
  learningIntro,
  learningCourses,
} from "./resumeData";
import { HighlightSection } from "./section-ui";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type HighlightItem = { title: string; summary: string };

type ProjectPart = {
  head?: string;
  headColor?: string;
  items: HighlightItem[];
  stats?: string[];
};

type ProjectModule = {
  chip: string;
  label: string;
  intro?: string;
  parts: ProjectPart[];
};

type Project = {
  title: string;
  meta: string;
  intro: string;
  modules: ProjectModule[];
  tags: { name: string; accent?: boolean }[];
};

const jobs = [
  {
    company: "江苏红网",
    role: "高级前端工程师",
    range: "2024.04 - 至今",
    points: [
      "独立从零设计并全栈开发 IM 企业即时通讯系统（Next.js 15 + Koa + Socket.io + MongoDB）。",
      "主导自研智能分析 Agent 产品前端架构，设计多类型 SSE 流式渲染引擎与指标管理全链路。",
      "主导 Dify 开源平台二次开发，深度改造 Chat / Workflow / 知识库与召回测试模块。",
    ],
    tags: ["Next.js", "React", "Socket.io", "Koa", "MongoDB", "AI Agent"],
  },
  {
    company: "SHEIN",
    role: "高级前端工程师",
    range: "2021.01 - 2024.03",
    points: [
      "负责财务前端 5 个 B 端业务系统的功能开发与维护，覆盖需求评审到上线验收全流程。",
      "整合跨系统相同模块，封装通用组件与工具函数，统一多系统样式与组件规范。",
    ],
    tags: ["React", "TypeScript", "组件库"],
  },
  {
    company: "优集计算机",
    role: "软件实施 / Web 前端工程师",
    range: "2019.04 - 2020.12",
    points: [
      "使用 Vue / Vuex / Vue Router 重构门户界面，优化性能与用户体验。",
      "参与西门子 Teamcenter PLM 软件实施，覆盖产品全生命周期数据与流程。",
    ],
    tags: ["Vue", "Vuex", "PLM"],
  },
];

const projects: Project[] = [
  {
    title: "IM 即时通讯系统",
    meta: "全栈项目 · 独立开发",
    intro:
      "企业级 IM 即时通讯与统一身份认证一体化平台。前端 Next.js 15 + React 19，后端 Koa + Socket.io + MongoDB，前后端分离架构，独立从零设计并实现全部功能链路。",
    modules: [
      {
        chip: "bg-primary/70",
        label: "模块一：统一身份认证体系",
        intro: authModuleIntro,
        parts: [
          {
            items: authSystemHighlights,
            stats: [
              "5 层中间件链",
              "JWT + Session 混合认证",
              "GitHub OAuth 2.0",
              "Nodemailer + EJS",
              "多模式认证 + 路由守卫",
            ],
          },
        ],
      },
      {
        chip: "bg-chart-1/70",
        label: "模块二：实时通讯系统",
        parts: [
          {
            head: "前端 — Next.js + React 架构",
            headColor: "bg-sky-500/70",
            items: imHighlights,
            stats: [
              "36+ 组件",
              "Socket.io 双向类型契约",
              "8 套 RESTful API",
              "4 层 Zustand Store",
            ],
          },
          {
            head: "后端 — Koa + Socket.io + MongoDB 架构",
            headColor: "bg-emerald-500/70",
            items: backendImHighlights,
            stats: [
              "10 类 Socket 事件处理",
              "5 个 MongoDB 集合",
              "原子化消息操作",
              "Ali-OSS 直传",
            ],
          },
        ],
      },
    ],
    tags: [
      { name: "Next.js 15", accent: true },
      { name: "React 19", accent: true },
      { name: "TypeScript", accent: true },
      { name: "Socket.io", accent: true },
      { name: "Zustand" },
      { name: "Reselect" },
      { name: "Tailwind CSS" },
      { name: "Radix UI" },
      { name: "Ant Design" },
      { name: "Zod", accent: true },
      { name: "React Hook Form", accent: true },
      { name: "Mitt" },
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
    ],
  },
  {
    title: "智能分析 Agent（自研产品）",
    meta: "自研产品 · 前端架构",
    intro:
      "基于指标平台的 AI 智能分析产品，支持自然语言问答、智能推荐与趋势分析。底层对接数据源 → 数据集 → 维度 → 指标 → 物化全链路，前端实现多类型 SSE 流式渲染引擎，一条连接承载 Markdown/图表/表格/操作建议等多种内容形态。",
    modules: [
      {
        chip: "bg-amber-500/70",
        label: "指标全链路 & 多类型 SSE 流渲染 & 问答系统",
        parts: [{ items: agentHighlights }],
      },
    ],
    tags: [
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
    ],
  },
  {
    title: "Dify 开源平台二次开发",
    meta: "Next.js · shadcn/ui · 50 万+ 行代码",
    intro:
      "基于开源 Dify 平台进行深度二次开发，改造 Chat 对话模块、Workflow 工作流模块、知识库与召回测试模块，满足企业级 AI 应用场景需求；在保持与上游定期同步的前提下实现定制功能可持续迭代。",
    modules: [
      {
        chip: "bg-violet-500/70",
        label: "Chat 对话模块 & Workflow 工作流模块 & 知识库体系",
        parts: [{ items: difyHighlights }],
      },
    ],
    tags: [
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
    ],
  },
  {
    title: "财务业务组件库 FMS",
    meta: "业务组件 · NPM 包",
    intro:
      "针对财务前端多系统组件版本不一致、辅助功能重复编写、Tab 缓存难维护等痛点，封装 FMSSearchTable 与 FMSModal 两个核心业务组件，首次将业务组件发布为公司级 NPM 包。",
    modules: [
      {
        chip: "bg-orange-500/70",
        label: "FMSSearchTable & FMSModal & NPM 发布",
        parts: [{ items: componentHighlights }],
      },
    ],
    tags: [
      { name: "React", accent: true },
      { name: "React Query", accent: true },
      { name: "TypeScript" },
      { name: "Axios" },
      { name: "Ant Design" },
      { name: "dumi" },
      { name: "semantic-release" },
      { name: "commitlint" },
    ],
  },
];

const skills = [
  {
    name: "前端",
    detail: "React · Next.js · Vue · TypeScript · Tailwind",
  },
  {
    name: "后端 / 数据",
    detail: "Python FastAPI · Koa2 · Socket.io · PostgreSQL · MySQL · MongoDB",
  },
  {
    name: "AI / Agent",
    detail: "LangGraph · LangChain · DeepAgent · ReAct · Tool Calling · MCP · Skill",
  },
  {
    name: "工程化",
    detail: "Docker · Webpack · monorepo · CI/CD",
  },
];

function LeftPanel() {
  return (
    <aside className="h-fit rounded-2xl border border-border/60 bg-card shadow-sm px-6 py-6 flex flex-col gap-5 text-sm">
      <div className="flex flex-col items-center text-center gap-1">
        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-border shadow-md mb-1">
          <Image
            src={`${mediaBasePath}/avatars/avater.jpg`}
            alt="丁凯"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground">丁凯</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          高级前端开发工程师
          <br />7 年经验 · AI Agent 全栈方向
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wider">
          联系方式
        </h3>
        <ul className="space-y-2 text-xs text-foreground/90">
          <li className="flex items-start gap-2">
            <Mail size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
            <a
              href="mailto:1196715913@qq.com"
              className="break-all hover:underline"
            >
              1196715913@qq.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Phone size={14} className="shrink-0 text-muted-foreground" />
            <a href="tel:18301926957" className="hover:underline">
              18301926957
            </a>
          </li>
          <li className="flex items-start gap-2">
            <GraduationCap
              size={14}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />
            <span>东华大学 · 全日制硕士（211）</span>
          </li>
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 tracking-wider">
          专业技能
        </h3>
        <div className="space-y-2.5 text-xs">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="font-semibold text-foreground/90">{s.name}</div>
              <div className="text-muted-foreground leading-relaxed mt-0.5">
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ModuleBlock({ module }: { module: ProjectModule }) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-1.5 h-4 rounded-full ${module.chip}`} />
        <h4 className="text-sm font-semibold text-foreground/80">
          {module.label}
        </h4>
      </div>

      {module.intro && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {module.intro}
        </p>
      )}

      {module.parts.map((part, i) => (
        <div key={i} className={i > 0 ? "mt-3" : ""}>
          {part.head && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 ${part.headColor} rounded-sm shrink-0`}
              />
              <h5 className="text-xs font-semibold text-foreground/70">
                {part.head}
              </h5>
            </div>
          )}
          <HighlightSection items={part.items} />
          {part.stats && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-muted-foreground/50 font-mono ml-1">
              {part.stats.map((s, si) => (
                <span key={si}>{s}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function WorkTab() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.company} className="shadow-none border-border/60">
          <CardContent className="pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-foreground">
                  {job.company}
                </h3>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {job.role}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{job.range}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
              {job.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-3">
              {job.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProjectTab() {
  return (
    <div className="space-y-4">
      {projects.map((proj) => (
        <Card key={proj.title} className="shadow-none border-border/60">
          <CardContent className="pt-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-foreground">
                  {proj.title}
                </h3>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  {proj.meta}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {proj.intro}
            </p>

            {proj.modules.map((m) => (
              <ModuleBlock key={m.label} module={m} />
            ))}

            <div className="flex flex-wrap gap-2 mt-5">
              {proj.tags.map((t) => (
                <Badge
                  key={t.name}
                  variant={t.accent ? "default" : "secondary"}
                >
                  {t.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PracticeTab() {
  return (
    <div className="space-y-4">
      <Card className="shadow-none border-border/60">
        <CardContent className="pt-5">
          <h3 className="text-base font-semibold text-foreground">
            技术画像与发展方向
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            7 年前端经验沉淀了扎实的工程化与产品化能力；近一年系统自学 Python
            后端与 LLM/Agent 工程并全程动手实践，已补齐「前端 → Python 后端 →
            LLM 原理与 Agent 工程」的完整闭环。发展方向聚焦
            <b className="text-foreground"> AI 应用与 Agent 工程</b>
            ：以 AI 应用的工程化落地为目标，将前端体验优势与 LLM/Agent、Python
            后端能力结合，可独立承担从需求到上线的全链路交付。
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-none border-border/60">
        <CardContent className="pt-5">
          <h3 className="text-base font-semibold text-foreground">
            AI Agent 体系化学习与实践
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {learningIntro}
          </p>
        </CardContent>
      </Card>

      {learningCourses.map((course) => (
        <Card key={course.title} className="shadow-none border-border/60">
          <CardContent className="pt-3">
            <div className="flex items-center gap-2 flex-wrap">
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
            <ul className="mt-3 space-y-2">
              {course.points.map((p) => (
                <li key={p.title} className="text-sm leading-relaxed">
                  <span className="font-medium text-foreground/90">
                    {p.title}
                  </span>
                  <span className="block text-muted-foreground mt-0.5">
                    {p.desc}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-4">
              {course.tags.map((t) => (
                <Badge
                  key={t.name}
                  variant={t.accent ? "default" : "secondary"}
                >
                  {t.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const tabMeta = [
  { value: "work", label: "工作经历", icon: Briefcase },
  { value: "project", label: "项目经历", icon: FolderKanban },
  { value: "practice", label: "个人实践及发展方向", icon: Rocket },
];

export default function NewResumeLayout() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
        <LeftPanel />

        <div className="rounded-2xl border border-border/60 bg-card shadow-sm px-5 py-5 md:px-7">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="w-full h-auto gap-1 flex flex-wrap md:flex-nowrap">
              {tabMeta.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="flex-1 min-w-fit"
                  >
                    <Icon />
                    {t.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="work" className="mt-4">
              <WorkTab />
            </TabsContent>
            <TabsContent value="project" className="mt-4">
              <ProjectTab />
            </TabsContent>
            <TabsContent value="practice" className="mt-4">
              <PracticeTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
