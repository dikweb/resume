// 简历共享基础信息与类型定义（内容数据见 resumeData.concise.ts）

// ── 个人基础信息 ──
export const profile = {
  name: "丁凯",
  role: "AI 应用开发工程师",
  email: "1196715913@qq.com",
  phone: "18301926957",
  school: "东华大学 · 全日制硕士（211）",
  skills: [
    {
      name: "AI 应用开发",
      items: [
        "LangGraph",
        "LangChain",
        "Deep Agents",
        "多 Agent 编排",
        "结构化路由",
        "Send 扇出",
        "HITL",
        "RAG",
        "Agentic RAG",
        "Graph RAG",
        "Tool Calling / MCP",
        "Skill",
        "Nacos 治理",
        "LiteLLM",
        "MinIO",
        "Langfuse",
        "全链路可观测",
      ],
    },
    {
      name: "前端 / 产品化",
      items: [
        "React / Vue",
        "Next.js / Umi",
        "TypeScript",
        "Zustand / Redux Toolkit / Reselect",
        "TanStack Query",
        "Tailwind / shadcn/ui / Radix",
        "Ant Design / Element",
        "SSE 流式渲染",
        "React Flow",
        "WebSocket",
        "Webpack",
        "渲染性能优化",
      ],
    },
    {
      name: "后端 / 数据",
      items: [
        "Python / FastAPI",
        "Pydantic / SQLAlchemy",
        "Node.js / Koa / Socket.io",
        "REST / SSE",
        "JWT / OAuth",
        "PostgreSQL / MongoDB / Redis",
        "Milvus / Neo4j",
        "阿里云 OSS",
      ],
    },
    {
      name: "运维 / 云服务",
      items: ["Docker", "CI/CD", "监控告警", "阿里云 OSS", "阿里云沙箱服务"],
    },
  ],
};

// ── 类型定义 ──
export type JobStage = {
  label?: string;
  role: string;
  range: string;
  points: string[];
  tags: string[];
};

export type Job = {
  company: string;
  role: string;
  range: string;
  points: string[];
  tags: string[];
  note?: string;
  stages?: JobStage[];
};

export type HighlightItem = { title: string; summary: string };

export type ProjectPart = {
  head?: string;
  headColor?: string;
  items: HighlightItem[];
};

export type ProjectModule = {
  chip: string;
  label: string;
  parts: ProjectPart[];
};

export type Project = {
  title: string;
  meta: string;
  intro: string;
  modules: ProjectModule[];
  tags: { name: string; accent?: boolean }[];
};
