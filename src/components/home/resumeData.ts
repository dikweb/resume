// 简历数据（经典版与新版共用）

export const imHighlights = [
  {
    title: "Socket 消息收发的竞态处理与增量合并",
    summary:
      "消息列表采用「按 chatSize 窗口整表重拉、整体替换」。连发多条时各发送确认回调异步乱序返回，会用过期的列表长度算出偏小的窗口并整体覆盖，导致新消息漏显示。方案：发送时按房间累计待确认条数，由首个返回的回调一次性把窗口放大到正确大小，其余回调按最新长度再拉、幂等；多条推送合并到 50ms 内刷新一次时，用 ref 把期间到达的条数全部计入窗口；socket 回调读状态统一走 ref.current / store.getState()，避免读到注册时的旧值。",
  },
  {
    title: "IntersectionObserver 驱动的消息已读追踪",
    summary:
      "基于 IntersectionObserver 对未读消息做可见性检测：进入可视区即乐观更新本地已读（DOM + store 同步，Set 防同帧重复上报），再经 socket ack 确认——成功则 unobserve 停观察并 debounce 刷新未读数；失败则三态回滚（DOM 属性、store isRead、重入标记）并保持观察，下次可见时自动重试上报，保证已读最终一致。",
  },
  {
    title: "细粒度状态管理与渲染优化",
    summary:
      "把渲染优化做成闭环：组件只订阅最小切片、派生数据经 Reselect 深比较复用旧引用，保证引用可预期；changeReadStatus 只改命中消息引用、其余保持稳定，React.memo 据此短路未变消息的整棵子树，单条更新 O(N)→O(1)；整表重拉引用必变时，用自定义比较函数按业务字段兜底——任何更新只重渲染真正受影响的子树。",
  },
  {
    title: "富媒体上传与录制",
    summary:
      "多文件逐个上传并基于 Axios onUploadProgress 实时更新进度；MediaRecorder 实现浏览器端音视频录制；js-web-screen-shot（WebRTC）窗口截图转 File 后统一上传，回填 URL 再组装为消息发出，打通「选择-上传-预览-发送」链路。",
  },
  {
    title: "Mitt 事件总线驱动的跨组件协作：播放互斥与实时通知",
    summary:
      "以轻量事件总线（Mitt：Symbol 事件键 + TS 类型化载荷）解耦无父子关系组件树间的协作：语音/音频/视频播放器经 play 事件实现全局互斥、同时只响一条；新消息、好友上下线、好友申请三类 socket 推送广播为独立事件，由 Header 的新消息横幅、好友状态条、铃铛红点分别订阅并 3s 自隐——播放不串音、消息即时提醒、好友动态实时感知，统一收敛为同一套发布订阅模型。",
  },
];

export const backendImHighlights = [
  {
    title: "多 Tab 在线状态机与定向状态广播（前后端协同）",
    summary:
      "「服务端判死活、前端判焦点」：服务端仅以连接数判定——任一 Tab 存活即在线，全部断开才置 OFFLINE 并对共同房间成员定向广播；「是否在看」由浏览器 visibilitychange 上报——页面隐藏立即置 AWAY、重新可见延迟 600ms 才回 ONLINE，接收端再按 userId 合并去抖，消除快速切 Tab 造成的状态抖动与通知风暴。",
  },
  {
    title: "私聊会话寻址复用：双人房间去重与消息定向投递",
    summary:
      "好友列表选人私聊时不携带房间号，服务端先寻址：在本用户会话中检索是否已有「仅含双方」的双人房间，命中即复用，否则才以发送者为群主新建，使任意一对用户逻辑上只维护一个会话，从机制上消除重复建房与历史割裂；房间确定后文本与多文件合并为一批落库，并向房间内在线成员定向推送，单次消息事件完成寻址-落库-广播。",
  },
  {
    title: "撤回消息的全局广播：跨端同步会话列表摘要",
    summary:
      "撤回若只向所在房间定向广播并不充分——房间列表会将每房间最后一条消息聚合为会话摘要展示在所有在线端，被撤回的若恰是最新一条，未停留在该房间的端同样需要刷新。故 revokeMsg 删除成功后采用 socket.broadcast.emit 全局广播，令所有持有该会话摘要的端联动更新，保证列表摘要与消息明细一致。",
  },
  {
    title: "阿里云 OSS 直传与 MIME 目录路由",
    summary:
      "上传走 Multer memoryStorage，文件以 Buffer 交由 OSS putBuffer 直接上云、无本地磁盘 IO；按 MIME 类型自动路由到 weChatImages/Audio/Video/Files 四个目录，文件列表按 URL 前缀聚合检索。",
  },
];

export const authSystemHighlights = [
  {
    title: "JWT + Session 混合认证与纵深防御",
    summary:
      "JWT 负责无状态 API 认证（1天/7天双过期策略），Koa Session 负责有状态验证码生命周期管理；客户端会话经 sessionStorage 承载、密码哈希后传输；Schema 层 .select('-password') 全局剔除 + maskdata 邮箱掩码脱敏，多道防线构成纵深防御体系。",
  },
  {
    title: "Koa 洋葱模型安全中间件链设计",
    summary:
      "基于 Koa 洋葱模型设计五层中间件链（CORS → session → bodyParser → autoClearSession → koaAuth），noAuthPath 白名单路由豁免 + 401 统一拦截；对 koa-session 扩展字段级独立过期时间，验证码等会话字段到期惰性清理。",
  },
  {
    title: "GitHub OAuth 2.0 账号自动合并与零操作登录",
    summary:
      "基于 Authorization Code Grant 流程：code→token 交换后并行拉取 GitHub profile 与 verified emails，通过 OAuthRel 表自动判断三路分支——已有绑定直接登录 / 邮箱匹配自动关联 / 新用户自动创建，真正实现首次 OAuth 用户零操作登录。",
  },
  {
    title: "密码重置闭环与邮箱验证发送控制",
    summary:
      "Nodemailer SMTP + EJS 动态邮件渲染；注册/改邮箱验证码、JWT 时效化重置链接与 Session 发送频控三道防线；配合邮箱域名映射一键跳转网页邮箱，打通密码重置闭环。",
  },
  {
    title: "一套凭证贯通 REST/上传/SSE/Socket 四通道",
    summary:
      "同一 JWT 贯通 JSON REST / 二进制上传 / SSE 流 / Socket 长连接四通道，均自动注入凭证并在失效时统一 dealLogout 登出；其中 Socket 在 connection 握手阶段从 handshake.auth.token 提取同一 JWT 由连接级中间件校验，失败立即 disconnect 拒绝，通过后把 userId/username 注入 socket.data 供后续事件使用。",
  },
];

export const difyHighlights = [
  {
    title: "在既有 SSE 架构上扩展多事件流式链路",
    summary:
      "Dify 已内置 SSE 流式会话。先读懂其消息构建器与事件渲染管线，再顺势扩展：定位事件分派扩展点，接入 thinking / 联网搜索 / 知识库引用等新事件类型并做差异化渲染，复用既有生命周期、以最小侵入叠加功能，保证与上游版本可持续合并——把对大厂源码设计的吸收，落实为可复用、可随上游演进的二次开发方法。",
  },
  {
    title: "深度思考推理链路可视化",
    summary:
      "解析模型返回的 reasoning_content，在对话中独立展示思考过程（折叠/展开），实现类似 DeepSeek 的思考链交互体验。",
  },
  {
    title: "联网搜索与工具调用集成",
    summary:
      "Chat 中接入联网搜索能力，工具调用以独立卡片实时呈现搜索步骤与结果摘要，来源透明可追溯。",
  },
  {
    title: "Workflow 自定义节点扩展",
    summary:
      "为 Dify Workflow 开发文档检索节点与会话文档召回节点，基于 ReactFlow 画布实现节点配置面板与参数校验。",
  },
];

export const agentHighlights = [
  {
    title: "多类型 SSE 流式响应渲染引擎",
    summary:
      "难点：回复是逐字到达的文本流，正文中会夹带 echarts/表格等代码栅栏；正文可边到边渲染，图表/表格须等栅栏闭合、内容完整才能解析。方案：流式栅栏解析 + 按块归档——正文即时推送渲染，图表/表格先攒到闭合、再整块一次性渲染，块按到达顺序排列、互不串位。",
  },
  {
    title: "指标血缘图谱与全链路追踪",
    summary:
      "难点：指标可派生/复合自其它指标，再经字段落到数据表，血缘呈多对多 DAG，用列表/树表达不了汇聚与层级。方案：将血缘数据建模为「指标→字段→表」的 node/edge，React Flow 渲染 + dagre 分层自动布局规避跨层边交叉；点选节点高亮上下游全链路、弱化无关节点。",
  },
];

export const componentHighlights = [
  {
    title: "React Query 驱动的页面级缓存架构",
    summary:
      "以页面路径 + API + 查询参数为复合缓存 Key，实现查询条件与 Table 数据的双层缓存，Tab 切换、路由往返零重新请求；配合 dev 模式内置缓存面板，开发者可直接查看缓存内容与失效策略。",
  },
  {
    title: "FMSSearchTable — 查询列表一体化组件",
    summary:
      "将「查询条件 + Table 展示 + 分页 + Tab 缓存 + 辅助操作」封装为单一组件，对外暴露极简 API（仅需传入 searchItems + columns + api），开发者交付速度提升数倍。",
  },
  {
    title: "FMSModal — 声明式生命周期弹窗",
    summary:
      "将 Modal visible 状态管理下沉至组件内部，开发者仅需关注 open / close / cancel / submit 四个声明式回调，代码集中度与可维护性大幅提升。",
  },
  {
    title: "业务组件 NPM 包发布全链路",
    summary:
      "首次在业务组件平台发布财务业务组件 NPM 包，走通「脚手架开发 → 组件构建 → 文档站点部署 → NPM 发布」全流程，并输出标准化操作文档供团队复用。",
  },
];

// ── AI Agent 体系化学习与实践（系统学习 · 动手实践，尚未接入生产） ──
export const learningIntro =
  "以下为个人在 Python、后端工程与 LLM/Agent 方向利用业余时间自学的学习与实践成果，旨在补齐从前端到 Python 后端、再到 LLM 原理与 Agent 工程的完整能力闭环。";

export type CoursePoint = { title: string; desc: string };

export type Course = {
  title: string;
  position: string;
  points: CoursePoint[];
  tags: { name: string; accent?: boolean }[];
};

export const learningCourses: Course[] = [
  {
    title: "Python 语言与全栈后端工程",
    position:
      "系统性自学 Python 语言核心并贯通企业级后端工程：从对象模型与元编程、asyncio 异步编程，到 FastAPI 三层架构、SQLAlchemy 2.0 异步 ORM 与依赖注入、自动化测试，形成从前端到 Python 后端的完整工程能力。",
    points: [
      {
        title: "深入对象模型与异步编程",
        desc: "系统掌握元类、装饰器、描述符与魔术方法，理解 type 动态建类与对象创建过程，实现自动注册、单例、惰性计算等机制；并系统学习事件循环、Future、协程与 Task 等 asyncio 运行机制，掌握 gather 等官方 API。",
      },
      {
        title: "完整工程工具链",
        desc: "全量类型标注、迭代器/生成器、上下文管理器与标准库，配合 pyproject/hatchling 构建发布、uv 依赖与版本管理、uv workspace monorepo 多包组织，具备规范化的 Python 工程协作能力。",
      },
      {
        title: "企业级三层架构与数据层",
        desc: "FastAPI + 依赖注入（IoC/DI）分层为 api/service/model 三层，统一异常与统一响应、中间件；SQLAlchemy 2.0 异步 ORM + Alembic 数据迁移，覆盖长短事务、CRUD、文件上传（OSS）等真实业务；pytest 单元/集成/E2E 分层测试，覆盖率约 80%。",
      },
    ],
    tags: [
      { name: "Python", accent: true },
      { name: "asyncio" },
      { name: "FastAPI", accent: true },
      { name: "SQLAlchemy 2.0", accent: true },
      { name: "Alembic" },
      { name: "PostgreSQL" },
      { name: "依赖注入" },
      { name: "pytest" },
      { name: "SSE 流式" },
      { name: "Docker / k8s / CI/CD", accent: true },
    ],
  },
  {
    title: "LLM 底层原理与自研 Agent",
    position:
      "从神经元与 Transformer 原理逐层推导，再逐步搭建可运行的 Agent 工程，亲手打通 LLM → Tool Calling → ReAct → MCP → Skill → 子代理全链路。",
    points: [
      {
        title: "LLM 底层原理推导",
        desc: "实现 BPE 分词器并训练中文词表，理解词嵌入、注意力与多头 QKV、RoPE、残差归一化；掌握推理侧 Prefill/KV Cache、Temperature、Top-K/Top-P 采样与训练侧 SFT/RLHF/CoT。",
      },
      {
        title: "自研可运行 Agent 包",
        desc: "分层实现 model / session（会话持久化以命中 prompt cache）/ prompt（Jinja2 系统提示词）/ tool（Pydantic 动态 Schema + @tool 注册表）/ ReAct 主循环 / 事件驱动 listener，驱动 Agent 自主产出代码与架构分析文档。",
      },
      {
        title: "Agent 能力外延",
        desc: "接入 Ollama 本地模型与 Tavily 搜索构建“Agent 搜索引擎”；实现 Skill 渐进式披露；封装 MCP（JSON-RPC 2.0，stdio/http）Client、用 FastMCP 自建天气服务器并接入；子代理多线程并发编排。",
      },
    ],
    tags: [
      { name: "Transformer" },
      { name: "BPE 分词器" },
      { name: "ReAct", accent: true },
      { name: "Tool Calling", accent: true },
      { name: "Pydantic" },
      { name: "Ollama" },
      { name: "MCP", accent: true },
      { name: "Skill" },
      { name: "子代理" },
    ],
  },
  {
    title: "LangGraph 工作流开发",
    position:
      "基于 LangGraph 构建带记忆、可中断、可动态编排的 AI Agent 工作流，覆盖图状态管理、Checkpointer 持久化、长期记忆、人机协同与子 Agent，并在 Agent Server 上完成接口暴露与容器化生产部署。",
    points: [
      {
        title: "图编排与流程控制",
        desc: "StateGraph + Reducer/add_messages 状态管理、节点与条件边、循环/并行、Send 动态扇出（map-reduce）与子图/子 Agent 组合。",
      },
      {
        title: "生产级状态与记忆",
        desc: "Checkpointer/Thread 实现会话快照与时间旅行（replay/fork）；Store 按用户维护长期记忆，在系统提示词中经 mustache 渲染冻结为快照注入，支持记忆复用。",
      },
      {
        title: "人机协同与中断",
        desc: "interrupt 实现 human-in-the-loop，Agent 在需要时暂停询问用户（ask_user_question）后携带回答继续执行，打通人工审核与自动化执行边界。",
      },
      {
        title: "模型与工具解耦",
        desc: "按 ContextSchema 动态选择多模型（mock/Anthropic/OpenAI），bind_tools + ToolNode + Tavily 联网搜索/抓取与多工具调度，配置驱动便于测试。",
      },
      {
        title: "Agent Server 生产落地",
        desc: "LangGraph API Server 暴露 Assistant/Thread/Run/Store/Cron/MCP/A2A 等 REST 接口，Docker + Postgres/Redis 部署，打通 Agent 前后端对接与生产上线链路。",
      },
    ],
    tags: [
      { name: "LangGraph", accent: true },
      { name: "StateGraph" },
      { name: "Checkpointer" },
      { name: "Human-in-the-loop", accent: true },
      { name: "Store 长期记忆" },
      { name: "Send 动态扇出" },
      { name: "子 Agent" },
      { name: "Agent Server" },
    ],
  },
];

// ── 个人基础信息（经典版与新版共用） ──
export const profile = {
  name: "丁凯",
  role: "高级前端开发工程师",
  summary: "7 年经验 · 3 年+ 财务系统 · 近2年+ 银行/券商 AI 应用",
  email: "1196715913@qq.com",
  phone: "18301926957",
  school: "东华大学 · 全日制硕士（211）",
  skills: [
    {
      name: "前端",
      detail: "React · Next.js · Vue · TypeScript · Tailwind",
    },
    {
      name: "后端 / 数据",
      detail:
        "Python FastAPI · Koa2 · Socket.io · PostgreSQL · MySQL · MongoDB",
    },
    {
      name: "AI / Agent",
      detail:
        "LangGraph · LangChain · DeepAgent · ReAct · Tool Calling · MCP · Skill",
    },
    {
      name: "工程化",
      detail: "Docker · Webpack · monorepo · CI/CD",
    },
  ],
};

// ── 工作经历（经典版与新版共用） ──
export type Job = {
  company: string;
  role: string;
  range: string;
  points: string[];
  tags: string[];
};

export const jobs: Job[] = [
  {
    company: "江苏红网",
    role: "高级前端工程师",
    range: "2024.04 - 至今",
    points: [
      "所在业务线服务银行/券商/基金等金融机构客户，主导其 AI 应用类产品的数据分析、对话交互与工程落地，对接真实业务口径需求。",
      "独立从零设计并全栈开发 IM 企业即时通讯系统（Next.js 15 + Koa + Socket.io + MongoDB）。",
      "主导自研智能分析 Agent 产品 SSE 流式对话部分，实现按事件类型增量渲染的流式响应链路。",
      "主导 Dify 开源平台二次开发，深度改造 Chat / Workflow / 知识库模块。",
      "此外还负责服务金融机构客户的若干常规业务系统的前端开发与维护，多为表单 + 增删改查类页面，此处不再展开。",
    ],
    tags: ["Next.js", "React", "Socket.io", "Koa", "MongoDB", "umi", "Vue"],
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

// ── 项目经历（经典版与新版共用） ──
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

export const projects: Project[] = [
  {
    title: "IM 即时通讯系统",
    meta: "全栈项目 · 独立开发",
    intro:
      "企业级 IM 即时通讯与统一身份认证一体化平台。前端 Next.js 15 + React 19，后端 Koa + Socket.io + MongoDB，前后端分离架构，独立从零设计并实现全部功能链路。认证侧提供多模式身份认证（账号密码+图形验证码 / GitHub OAuth 2.0 / 邮箱注册 / token 化密码重置），配合前端 PageAuth 路由守卫、safeFetch 统一请求出口（自动注入 JWT、401 全局登出）与后端 koaAuth 白名单、Socket.io 握手鉴权，构成「路由 → 请求 → 会话 → 长连接」全链路认证闭环。",
    modules: [
      {
        chip: "bg-primary/70",
        label: "模块一：统一身份认证体系",
        parts: [
          {
            items: authSystemHighlights,
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
          },
          {
            head: "后端 — Koa + Socket.io + MongoDB 架构",
            headColor: "bg-emerald-500/70",
            items: backendImHighlights,
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
    title: "金融数据分析 Agent（自研产品）",
    meta: "自研产品 · 前端架构",
    intro:
      "面向银行/券商等金融机构业务分析场景的智能分析产品：前端自研多类型 SSE 流式渲染引擎，Agent 的回答在单条 SSE 连接内按事件类型增量推送并渲染 Markdown 正文/图表/表格等内容形态；指标侧提供血缘图谱，实现指标→字段→表全链路依赖追踪。",
    modules: [
      {
        chip: "bg-amber-500/70",
        label: "多类型 SSE 流渲染 & 指标血缘图谱",
        parts: [{ items: agentHighlights }],
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
      { name: "WebSocket" },
    ],
  },
  {
    title: "东北证券 Dify 平台二次开发",
    meta: "Next.js · shadcn/ui",
    intro:
      "基于开源 Dify 平台进行深度二次开发，改造 Chat 对话模块、Workflow 工作流模块、知识库模块，支撑银行/券商等金融机构的智能对话、知识库检索与工作流自动化场景需求；在保持与上游定期同步的前提下实现定制功能可持续迭代。",
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

// ── 个人实践及发展方向（经典版与新版共用） ──
export const practiceProfile = {
  title: "技术画像与发展方向",
  intro:
    "7 年前端经验，其中 3 年+ 深耕财务 B 端系统、近 2 年+ 服务银行/券商等金融机构的数据与 AI 应用，理解金融业务对数据口径与准确性的要求，沉淀了扎实的工程化与产品化能力；近一年系统自学 Python 后端与 LLM/Agent 工程并全程动手实践，已补齐「前端 → Python 后端 → LLM 原理与 Agent 工程」的完整闭环。发展方向聚焦",
  highlight: "AI 应用与 Agent 工程",
  outro:
    "：以 AI 应用的工程化落地为目标，将前端体验优势与 LLM/Agent、Python 后端能力结合，可独立承担从需求到上线的全链路交付。",
};

export const learningTitle = "AI Agent 体系化学习与实践";
