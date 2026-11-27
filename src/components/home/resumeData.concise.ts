// 简历内容数据（唯一数据源）
// 根路由 /、打印路由 /pdf 均使用本文件的数据。

import type { Job, Project } from "./resumeData";

export const conciseJobs: Job[] = [
  {
    company: "江苏红网",
    role: "高级前端工程师 → AI 应用开发工程师",
    range: "2024.04 - 至今",
    note: "内部转岗",
    points: [],
    tags: [],
    stages: [
      {
        role: "AI 应用开发工程师",
        range: "2025.08 - 至今",
        points: [
          "负责金融 AI 应用的多 Agent 能力建设与调度：规划主/子 Agent 的职责拆分，将检索、执行等能力封装为独立子 Agent 并按任务类型路由分发、并行汇总，支撑可中断、可恢复的复杂任务流程，服务银行/券商/基金/保险等客户。",
          "负责企业 RAG 知识库从索引到检索的全链路建设：打通文档解析、结构化切片、向量化与混合检索流程，支持多路召回与多种重排策略，提升复杂问题的回答质量。",
          "负责 AI 平台基础能力建设与治理：统一模型接入与网关，沉淀对象存储、配置管理与隔离沙箱等基础能力，标准化新 AI 应用的接入与交付流程，降低新应用接入成本。",
          "负责 AI 应用的效果评估与线上可观测：建立评估基准、回归门槛与告警机制，结合全链路 trace 与自动评估，定位幻觉、召回和工具调用问题，持续跟踪线上效果与稳定性，推动问题从发现、定位到修复闭环。",
        ],
        tags: [
          "Python",
          "FastAPI",
          "LangGraph",
          "Deep Agents",
          "LangChain",
          "RAG",
          "Milvus",
          "MinIO",
          "OpenSandbox",
          "Nacos",
          "LiteLLM",
          "Langfuse",
        ],
      },
      {
        role: "高级前端工程师",
        range: "2024.04 - 2025.07",
        points: [
          "负责金融 B 端前端开发，覆盖多业务系统从需求评审到上线，后续延伸至银行/券商 AI 应用前端。",
          "主导 SSE 流式产品化：多类型事件渲染，Agent 回答、图表、表格按事件增量呈现。",
          "主导 Dify 二次开发：Chat / Workflow / 知识库，保持与上游可持续合并。",
        ],
        tags: ["React", "Next.js", "TypeScript", "SSE", "Dify"],
      },
    ],
  },
  {
    company: "SHEIN",
    role: "高级前端工程师",
    range: "2021.01 - 2024.03",
    points: [
      "负责财务前端 5 个 B 端系统；整合跨系统通用模块，统一组件与样式规范。",
    ],
    tags: ["React", "TypeScript", "组件库"],
  },
  {
    company: "优集计算机",
    role: "软件实施 / Web 前端工程师",
    range: "2019.04 - 2020.12",
    points: ["Vue / Vuex / Vue Router 重构门户；参与西门子 Teamcenter PLM 实施。"],
    tags: ["Vue", "Vuex", "PLM"],
  },
];

export const conciseAgentProjects: Project[] = [
  {
    title: "东北证券 — 企业知识库 RAG 与 Agent 平台",
    meta: "券商企业知识库 · RAG / 多 Agent 应用",
    intro:
      "面向东北证券投研、合规等业务条线的企业知识库与智能问答平台。随着切片级权限、企业系统集成与平台治理等需求超出低代码平台边界，自研重构为以飞书文档归一化、结构化切片、Milvus 混合检索与 Agentic RAG 为核心的知识底座，并叠加多 Agent 编排、可观测评估、模型网关与飞书协作，服务券商内部知识检索与问答场景。",
    modules: [
      {
        chip: "bg-cyan-500/70",
        label: "模块一：RAG 检索",
        parts: [
          {
            head: "索引构建",
            headColor: "bg-cyan-500/70",
            items: [
              {
                title: "",
                summary:
                  "聚焦飞书知识库 Docx，统一解析正文、表格、图片、代码等块类型，归一化为带标题层级与来源元数据的标准文档，为后续结构化切片与向量索引提供统一输入。",
              },
              {
                title: "",
                summary:
                  "针对飞书图片需参与语义检索的问题，按文档顺序串行处理图片，结合标题轨迹与前后兄弟节点作为上下文交由视觉模型生成描述；原图存 MinIO 私有桶，检索时预签名还原展示。",
              },
              {
                title: "",
                summary:
                  "通过 BlockNode Tree 实现精细结构化的切片索引，确保每个切片语义完整、来源可溯、版本可控，并可通过切片间的父子引用还原上下文。",
              },
              {
                title: "",
                summary:
                  "实现 Milvus Schema 兼容性预检与原地同步，支持字段新增、字符串扩容及历史元数据局部回填。",
              },
              {
                title: "",
                summary:
                  "构建完善的多模态 RAG 索引流水线，结合版本对比实现实时增量索引与旧版本清理。",
              },
            ],
          },
          {
            head: "检索与推理",
            headColor: "bg-teal-500/70",
            items: [
              {
                title: "",
                summary:
                  "基于 HNSW 建立 Milvus 的 ANN 索引，实现稠密 + BM25 稀疏的多路召回，然后基于 RRF / Weighted / Model 多策略 Rerank。",
              },
              {
                title: "",
                summary:
                  "Milvus Entity 附带 Role Metadata，检索时强制新增角色筛选条件，实现严格带权限的数据检索。",
              },
              {
                title: "",
                summary:
                  "实现 Agentic RAG 检索，构建「首轮材料注入 + 自主检索 + 结构补查」的多跳推理机制，支持 Agent 根据已有证据改写查询、限定来源，并沿父块与引用块补充上下文。",
              },
            ],
          },
        ],
      },
      {
        chip: "bg-emerald-500/70",
        label: "模块二：Agent 编排与平台底座",
        parts: [
          {
            items: [
              {
                title: "",
                summary:
                  "主 Agent 基于 Deep Agents 负责任务规划、工具调用与结果汇总，把知识型问题委派给检索子 Agent；子 Agent 以状态、回答、来源与缺口等结构化结果回传，便于主 Agent 引用、校验与统一汇总。",
              },
              {
                title: "",
                summary:
                  "通过 after_agent 中间件归一化轮次上下文：只保留用户消息、无工具调用的 AI 回复与结构化结果，过滤工具调用噪声并写入扩展的 turn_summary 状态，便于多轮展示与复用。",
              },
              {
                title: "",
                summary:
                  "针对多 Agent 共享且需热更新的 Skill 包，在共享沙箱内直连下载解压，避免大文件经过 Agent 进程；以内容 SHA-256 判断是否更新，临时目录原子替换、失败回滚，配合文件锁与名称校验防止并发冲突和路径穿越。",
              },
              {
                title: "",
                summary:
                  "在多步任务中引入人工协同：需要补充信息或确认高风险操作时，通过 ask_user_question 触发 interrupt 暂停、给出 2–5 个选项等待用户选择，恢复后带着答案继续执行，确保高风险操作经用户确认后再落地。",
              },
            ],
          },
        ],
      },
      {
        chip: "bg-amber-500/70",
        label: "模块三：观测与评估",
        parts: [
          {
            items: [
              {
                title: "",
                summary:
                  "通过 Langfuse 建立线上全链路可观测：自动记录一次请求内模型、工具与子 Agent 的调用链路及耗时，便于快速定位幻觉、召回与工具调用失败。",
              },
              {
                title: "",
                summary:
                  "建立 Agent Benchmark 回归基线，持续纳入真实场景评估数据集，为每轮迭代提供可对照的效果评估与回归依据。",
              },
              {
                title: "",
                summary:
                  "构建覆盖成本、线上评估和异常错误的告警流水线，接入企业 SMS 系统实现多渠道通知，提升关键问题的发现与响应效率。",
              },
              {
                title: "",
                summary:
                  "离线评估实验将 trace 上下文透传至 Agent 服务：Benchmark 跑实验时以当前 span 作为父上下文继续打点，使评估结果可下钻到真实执行链路，快速定位检索、工具调用或模型回答导致的失分。",
              },
            ],
          },
        ],
      },
      {
        chip: "bg-violet-500/70",
        label: "模块四：基础建设",
        parts: [
          {
            items: [
              {
                title: "",
                summary:
                  "基于 LiteLLM 实施模型与网关双层并发控制：模型侧采用熔断与回退机制保障调用连续性，网关侧通过请求排队与等待缓解瞬时流量压力，提升服务可用性。",
              },
              {
                title: "",
                summary:
                  "通过会话粘性路由保持同一会话的模型路由一致性，避免跨模型切换造成 KV Cache 失效，提升会话请求的推理效率。",
              },
              {
                title: "",
                summary:
                  "引入 Nacos AI Registry 统一治理 Prompt、Skill、MCP 与 AgentSpec，打通 AI 能力的注册发现与动态配置，降低资源分散和版本割裂带来的治理成本。",
              },
              {
                title: "",
                summary:
                  "基于 OpenSandbox 构建用户级隔离执行环境，通过私有卷持久化与共享卷只读复用，兼顾 Agent 执行隔离、工作数据延续与公共能力复用。",
              },
              {
                title: "",
                summary:
                  "针对私有对象存储下产物与图片的安全交付问题：沙箱内直传 MinIO 并按用户对象前缀隔离，避免大文件经应用层转发；产物通过默认 1 小时的预签名链接按需授权访问，RAG 图片存入私有桶并在切片记录桶名与对象键，检索时预签名还原展示，兼顾可访问性与私有隔离。",
              },
            ],
          },
        ],
      },
      {
        chip: "bg-sky-500/70",
        label: "模块五：与飞书链接",
        parts: [
          {
            items: [
              {
                title: "",
                summary:
                  "以独立子进程承载飞书 WebSocket，事件经 IPC 回传主进程异步处理，避免长连接阻塞 Agent Server 事件循环。",
              },
              {
                title: "",
                summary:
                  "取 open_id 作为用户身份并签发短期 JWT，按「用户 + Agent」复用会话线程，执行状态与增量回复实时更新卡片。",
              },
              {
                title: "",
                summary:
                  "逐字流式片段拼装去重，思考/工具/回复状态实时显示，卡片 200ms 合并刷新，结束后复核真实状态。",
              },
            ],
          },
        ],
      },
    ],
    tags: [
      { name: "LangGraph", accent: true },
      { name: "Deep Agents", accent: true },
      { name: "RAG", accent: true },
      { name: "Milvus", accent: true },
      { name: "BM25", accent: true },
      { name: "Agentic RAG", accent: true },
      { name: "LiteLLM", accent: true },
      { name: "Nacos", accent: true },
      { name: "OpenSandbox", accent: true },
      { name: "MinIO", accent: true },
      { name: "Langfuse", accent: true },
      { name: "JWT" },
      { name: "Feishu OpenAPI" },
      { name: "HITL", accent: true },
      { name: "Sub Agent", accent: true },
      { name: "MCP" },
      { name: "SMS" },
      { name: "KV Cache" },
      { name: "Python" },
      { name: "FastAPI" },
    ],
  },
];

export const conciseProjects: Project[] = [
  {
    title: "智能问数Agent（自研产品）",
    meta: "自研产品 · Agent 产品化",
    intro:
      "面向银行/券商/保险业务分析场景的智能分析产品：自研多类型 SSE 流式渲染引擎，单连接内按事件增量推送 Markdown/图表/表格；指标侧提供血缘图谱，实现指标→字段→表全链路追踪。",
    modules: [
      {
        chip: "bg-amber-500/70",
        label: "多类型 SSE 流渲染 & 指标血缘图谱",
        parts: [
          {
            items: [
              {
                title: "多类型 SSE 流式响应渲染引擎",
                summary: "正文即时渲染，图表/表格栅栏闭合后整块渲染，按序不串位。",
              },
              {
                title: "指标血缘图谱与全链路追踪",
                summary: "指标→字段→表建模 node/edge，React Flow + dagre 分层布局，点选高亮全链路。",
              },
            ],
          },
        ],
      },
    ],
    tags: [
      { name: "金融数据分析", accent: true },
      { name: "React", accent: true },
      { name: "TypeScript", accent: true },
      { name: "SSE", accent: true },
      { name: "ECharts", accent: true },
      { name: "React Flow" },
      { name: "dagre" },
      { name: "Zustand" },
      { name: "Ant Design" },
    ],
  },
  {
    title: "东北证券 Dify 平台二次开发",
    meta: "Next.js · shadcn/ui",
    intro:
      "基于开源 Dify 深度二次开发，改造 Chat、Workflow、知识库模块，在保持与上游同步的前提下支撑银行/券商智能对话、知识库检索与工作流自动化。",
    modules: [
      {
        chip: "bg-violet-500/70",
        label: "Chat 对话模块 & Workflow 工作流模块 & 知识库体系",
        parts: [
          {
            items: [
              {
                title: "在既有 SSE 架构上扩展多事件流式链路",
                summary: "定位事件分派扩展点，接入 thinking/联网/知识引用并差异化渲染，保持上游可合并。",
              },
              {
                title: "深度思考推理链路可视化",
                summary: "解析 reasoning_content，折叠/展开展示思考过程。",
              },
              {
                title: "联网搜索与工具调用集成",
                summary: "工具调用以独立卡片实时呈现搜索步骤与结果摘要。",
              },
              {
                title: "Workflow 自定义节点扩展",
                summary: "文档检索与会话召回节点，ReactFlow 配置面板与参数校验。",
              },
            ],
          },
        ],
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
      { name: "SWR" },
      { name: "i18n" },
    ],
  },
  {
    title: "IM 即时通讯系统",
    meta: "全栈项目 · 独立开发",
    intro:
      "企业级 IM 与统一身份认证一体化平台：前端 Next.js 15 + React 19，后端 Koa + Socket.io + MongoDB，独立从零实现全部功能链路。",
    modules: [
      {
        chip: "bg-primary/70",
        label: "模块一：统一身份认证体系",
        parts: [
          {
            items: [
              {
                title: "JWT + Session 混合认证与纵深防御",
                summary: "JWT 无状态认证 + Session 验证码生命周期，Schema 剔除密码 + 邮箱掩码脱敏。",
              },
              {
                title: "Koa 洋葱模型安全中间件链设计",
                summary: "五层中间件链 + 白名单豁免 + 401 拦截，会话字段级独立过期。",
              },
              {
                title: "GitHub OAuth 2.0 账号自动合并与零操作登录",
                summary: "code→token 后并行拉取 profile/emails，自动判断绑定、关联或新建。",
              },
              {
                title: "密码重置闭环与邮箱验证发送控制",
                summary: "Nodemailer + EJS 渲染，验证码/JWT 时效链接 + Session 频控。",
              },
              {
                title: "一套凭证贯通 REST/上传/SSE/Socket 四通道",
                summary: "同一 JWT 贯通 REST/上传/SSE/Socket，失效统一登出，Socket 握手校验。",
              },
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
            items: [
              {
                title: "Socket 消息收发的竞态处理与增量合并",
                summary: "按房间累计待确认条数，首个回调放大窗口，其余按最新长度幂等重拉。",
              },
              {
                title: "IntersectionObserver 驱动的消息已读追踪",
                summary: "进入可视区乐观更新已读并 socket ack，失败三态回滚并保持观察重试。",
              },
              {
                title: "细粒度状态管理与渲染优化",
                summary: "最小切片订阅 + Reselect 复用引用 + React.memo，单条更新 O(N)→O(1)。",
              },
              {
                title: "富媒体上传与录制",
                summary: "多文件上传进度、MediaRecorder 录制、WebRTC 截图转 File 统一上传。",
              },
              {
                title: "Mitt 事件总线驱动的跨组件协作",
                summary: "Symbol 事件键 + 类型化载荷，播放互斥、新消息/好友状态广播订阅。",
              },
            ],
          },
          {
            head: "后端 — Koa + Socket.io + MongoDB 架构",
            headColor: "bg-emerald-500/70",
            items: [
              {
                title: "多 Tab 在线状态机与定向状态广播",
                summary: "服务端按连接数判在线，前端 visibilitychange 报焦点，接收端按 userId 合并去抖。",
              },
              {
                title: "私聊会话寻址复用与消息定向投递",
                summary: "检索双方双人房间，命中复用否则新建，消息落库后向房间在线成员定向推送。",
              },
              {
                title: "撤回消息的全局广播",
                summary: "删除成功后 socket.broadcast.emit 全局广播，联动更新各端会话摘要。",
              },
              {
                title: "阿里云 OSS 直传与 MIME 目录路由",
                summary: "Multer 内存存储直传 OSS，按 MIME 路由到图片/音频/视频/文件目录。",
              },
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
];
