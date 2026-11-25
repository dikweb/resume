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

// ── 个人基础信息（经典版与新版共用） ──
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

// ── 工作经历（经典版与新版共用） ──
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

export const jobs: Job[] = [
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
          "负责金融 AI 应用的多 Agent 编排：基于 Deep Agents 构建主 Agent 与检索/执行等子 Agent，结合 LangGraph Server + Python/FastAPI 完成任务规划、工具调用、异步子代理协作与状态/记忆管理，服务银行/券商/基金/保险客户。",
          "负责子 Agent 的编排与调度：基于 LangGraph 将检索、执行等能力拆分为独立子 Agent/子图并注册为服务入口，通过结构化路由按任务类型分发、Send 动态扇出并汇总结果，结合 Checkpointer 会话快照与 Store 长期记忆，实现可中断、可恢复的多 Agent 协作流程。",
          "负责 RAG 知识库：文档解析、结构化切片、Embedding、Milvus 稠密 + BM25 稀疏混合检索，支持 RRF/加权/模型重排；实现 Agentic RAG 多跳补查。",
          "负责 AI 基础建设：统一模型接入与 API 网关、MinIO 对象存储；基于 Nacos AI Registry 统一管理 AgentSpec、Prompt、Skill、MCP 与沙箱配置，支持注册发现与动态加载；基于 OpenSandbox 建设用户级隔离的沙箱执行环境，提供私有可写卷与共享只读卷，结合 LangGraph 运行时标准化新 AI 应用的接入与交付流程。",
          "负责评估与可观测：Langfuse trace + 评估集 + LLM-as-Judge/规则评估，建立回归门槛，定位幻觉、召回与工具调用失败；同时建立 Agent Benchmark 回归基线与成本/线上评估/异常告警流水线，接入企业 SMS 多渠道通知，持续跟踪效果与稳定性。",
        ],
        tags: ["Python", "FastAPI", "LangGraph", "Deep Agents", "LangChain", "RAG", "Milvus", "MinIO", "OpenSandbox", "Nacos", "LiteLLM", "Langfuse"],
      },
      {
        role: "高级前端工程师",
        range: "2024.04 - 2025.07",
        points: [
          "负责金融 B 端产品前端开发，覆盖多个业务系统、从需求评审到上线验收全流程；后续延伸至银行/券商 AI 应用前端。",
          "主导 SSE 流式产品化：多类型事件流渲染，Agent 回答、图表、表格按事件增量呈现。",
          "主导 Dify 平台二次开发：Chat / Workflow / 知识库模块，保持与上游版本可持续合并。",
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
      "负责财务前端 5 个 B 端业务系统，覆盖需求评审到上线；整合跨系统通用模块，统一组件与样式规范。",
    ],
    tags: ["React", "TypeScript", "组件库"],
  },
  {
    company: "优集计算机",
    role: "软件实施 / Web 前端工程师",
    range: "2019.04 - 2020.12",
    points: [
      "使用 Vue / Vuex / Vue Router 重构门户界面；参与西门子 Teamcenter PLM 软件实施。",
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
    title: "智能问数Agent（自研产品）",
    meta: "自研产品 · Agent 产品化",
    intro:
      "面向银行/券商/保险等金融机构业务分析场景的智能分析产品：前端自研多类型 SSE 流式渲染引擎，Agent 的回答在单条 SSE 连接内按事件类型增量推送并渲染 Markdown 正文/图表/表格等内容形态；指标侧提供血缘图谱，实现指标→字段→表全链路依赖追踪。",
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
];

// ── Agent 项目 ──
export const dealPilotRagIndexHighlights: HighlightItem[] = [
  {
    title: "飞书文档多模态归一化",
    summary:
      "聚焦飞书知识库 Docx，解析正文、表格、图片、代码等块类型；图片经 VL 模型生成文字描述并落 MinIO 私有桶，正文与表格统一归一化为带标题层级和来源元数据的标准文档；结合 revision_id 版本对比实现实时增量索引与旧版本清理。",
  },
  {
    title: "BlockNode Tree 结构化切片",
    summary:
      "以 BlockNode Tree 按标题层级组织飞书 Docx，正文/表格/图片/代码分别切片，表格保留表头并按行切分，图片整体保留并生成描述；确保每个切片语义完整、来源可溯、版本可控，可通过切片间父子引用还原上下文，索引时以 LangGraph Send 动态扇出、默认 3 并发。",
  },
  {
    title: "Milvus Schema 兼容性预检与原地同步",
    summary:
      "Collection 变更前做全量预检，支持字段新增、字符串扩容及历史元数据局部回填；仅允许 nullable 标量新增与 VARCHAR 扩容，避免维度/类型/分析器变化导致线上集合不可用。",
  },
  {
    title: "全量文档 + 精选知识图谱双路索引",
    summary:
      "针对全量知识图谱抽取成本高、维护投入大的问题，设计全量文档索引 + 精选知识图谱的双路索引：全量文档进入 Milvus，围绕高价值业务数据抽取实体与关系存入 Neo4j，按需构建社区，并支持管理后台人工录入实体关系，兼顾知识覆盖、关系表达与建设成本。",
  },
];

export const dealPilotRagRetrievalHighlights: HighlightItem[] = [
  {
    title: "稠密 + BM25 混合检索与多策略重排",
    summary:
      "基于 HNSW 建立 Milvus ANN 索引，实现稠密向量 + BM25 稀疏倒排的多路召回，再基于 RRF / Weighted / Model 三种策略 Rerank；封装 milvus_search / milvus_query 工具，检索 Agent 输出 status/answer/sources/gaps 结构化结果。",
  },
  {
    title: "Role Metadata 权限检索",
    summary:
      "Milvus Entity 附带 Role Metadata，检索时强制新增角色筛选条件，实现严格带权限的数据检索，避免越权召回。",
  },
  {
    title: "Agentic RAG 多跳补查",
    summary:
      "构建「首轮材料注入＋自主检索＋结构补查」的多跳推理机制：首轮检索材料经中间件注入，Agent 根据已有证据改写查询、限定来源，并沿父块与引用块补充上下文，形成「首轮注入—自主补查—综合回答」的闭环。",
  },
  {
    title: "Graph RAG × Agentic RAG 协同",
    summary:
      "针对客户、产品、项目等关联信息分散、单次文档检索难以获取完整证据的问题，设计文档检索 + 图谱检索双路召回：并行检索 Milvus 文档片段与 Neo4j 图谱知识，通过向量匹配定位相关实体及可选社区信息；并在文档搜索、切片补查工具之外增加图谱查询工具，由 Agent 根据证据缺口自主选择检索路径，形成「首轮双路召回—按需多轮补查—综合证据回答」的检索闭环。",
  },
];

export const dealPilotPlatformHighlights: HighlightItem[] = [
  {
    title: "主/子 Agent 编排与人工中断",
    summary:
      "基于 LangGraph Server + Deep Agents 搭建主 Agent 与检索子 Agent：主 Agent 负责任务规划与工具调用，检索子 Agent 负责知识库检索与结构化输出；关键节点可通过 interrupt / ask_user_question 中断等待人工确认，打通人工审核与自动化执行的边界。",
  },
  {
    title: "多智能体协作",
    summary:
      "采用异步子代理 + 结构化路由 + Send 动态扇出 + 汇总的协作模型，按任务类型分发到不同 Agent，并由主 Agent 统一汇总结果，兼顾并行效率与结果一致性。",
  },
  {
    title: "Nacos 配置驱动装配",
    summary:
      "从 Nacos 动态加载 AgentSpec / Prompt / Skill / MCP 与沙箱配置，按配置组装模型、工具与子 Agent；实现「并发请求合并 + 过期旧值先返回、后台异步刷新」的缓存机制，降低远程配置依赖对请求延迟的影响。",
  },
  {
    title: "Skill 包安全下发与热更新",
    summary:
      "针对 Skill 包体积大、多 Agent 共享且需热更新的场景，在共享沙箱内直连 Nacos 下载解压，避免大文件经过 Agent 进程；用内容 SHA-256 做幂等判断，临时目录 + 原子替换 + 失败回滚保证一致性，配合进程内锁 / 文件锁防并发，并校验名称防路径穿越；普通用户沙箱只读挂载，兼顾热更新、隔离与安全。",
  },
  {
    title: "HITL 权限与长上下文治理",
    summary:
      "通过 interrupt_on 实现工具审批，结合文件权限、上下文摘要与 TodoList 计划，控制高风险操作并压缩长上下文，让 Agent 在受控边界内完成多步任务。",
  },
];

export const dealPilotEvalHighlights: HighlightItem[] = [
  {
    title: "Langfuse 全链路可观测",
    summary:
      "Langfuse CallbackHandler 注入 trace/user/session，父子 trace/span 关联，记录模型调用、工具调用与耗时；支持过期 trace 定时清理，便于定位幻觉、召回与工具调用失败。",
  },
  {
    title: "Agent Benchmark 回归基线与 LLM-as-Judge 评估",
    summary:
      "建立 Agent Benchmark 回归基线，基于 Langfuse 数据集持续纳入真实场景评估用例，用 LLM-as-Judge 评估 correctness / completeness（阈值 0.8），接入 pytest 跑回归，任一用例未达标即失败；为每轮迭代提供可对照、可追溯的效果评估与回归依据，避免效果回退。",
  },
  {
    title: "成本 / 线上评估 / 异常告警流水线",
    summary:
      "构建覆盖成本、线上评估和异常错误的告警流水线，接入企业 SMS 系统实现多渠道通知，提升关键问题的发现与响应效率。",
  },
  {
    title: "评估与线上 Trace 跨服务串联",
    summary:
      "Benchmark 跑实验时从 Langfuse 当前 span 取 trace_id / parent_span_id，随任务下发给 LangGraph Server；Agent 侧用 CallbackHandler 以该 trace 为父上下文继续打点，并注入 session / user / environment，使评估结果可一路下钻到真实 Agent 执行 trace，快速定位是检索、工具调用还是模型回答导致失分。",
  },
];

export const dealPilotInfraHighlights: HighlightItem[] = [
  {
    title: "LiteLLM 模型与网关双层并发控制",
    summary:
      "模型侧采用熔断与回退机制保障调用连续性，网关侧通过请求排队与等待缓解瞬时流量压力，提升服务可用性。",
  },
  {
    title: "会话粘性路由与 KV Cache 复用",
    summary:
      "以会话/线程 ID 作为路由标识，将同一会话的请求固定到同一模型部署，避免跨部署或跨模型切换导致 KV Cache 失效；在保证路由一致性的同时复用前缀缓存，提升会话请求的推理效率，减少重复计算带来的算力消耗与调用成本。",
  },
  {
    title: "Nacos AI Registry 统一治理",
    summary:
      "引入 Nacos AI Registry 统一治理 Prompt、Skill、MCP 与 AgentSpec，打通 AI 能力的注册发现与动态配置，降低资源分散和版本割裂带来的治理成本。",
  },
  {
    title: "OpenSandbox 用户级隔离执行环境",
    summary:
      "基于 OpenSandbox 构建用户级隔离执行环境，普通用户使用私有可写 /root 与共享只读 /shared；通过私有卷持久化与共享卷只读复用，兼顾 Agent 执行隔离、工作数据延续与公共能力复用。",
  },
  {
    title: "产物部署与对象存储",
    summary:
      "沙箱内直传 MinIO 并按用户对象前缀隔离，支持生成默认 1 小时的 MinIO GET 预签名链接完成产物交付；RAG 文档中的图片统一存入 MinIO 私有桶，切片记录桶名与对象键，检索时通过预签名链接还原并展示图片，兼顾可访问性与私有隔离。",
  },
];

export const dealPilotFeishuHighlights: HighlightItem[] = [
  {
    title: "飞书长连接隔离",
    summary:
      "以独立子进程承载飞书 WebSocket 长连接，子进程收到事件后通过进程间管道（IPC）回传主进程，由分发器异步处理，避免长连接阻塞 Agent Server 的事件循环；监听器单例幂等，并随 FastAPI 生命周期启停。",
  },
  {
    title: "飞书消息接入与会话绑定",
    summary:
      "飞书用户发来消息后，取发送者的 open_id 作为用户身份并签发短期 JWT；再按「用户 + Agent」复用同一个会话线程，把请求排队交给 Agent Server 执行；执行状态和增量回复实时更新到与发送者的单聊卡片。",
  },
  {
    title: "流式回复与卡片增量刷新",
    summary:
      "主 Agent 和检索子 Agent 都在逐字流式输出：系统把每次模型调用的片段拼成完整正文并去重，再把「思考中 / 调用工具 / 回复中 / 完成 / 失败」实时显示到飞书卡片；流结束后再查一次任务的真实状态，避免把超时或中断误报成完成；卡片每 200ms 合并刷新一次，只提交最新内容，避免高频请求积压。",
  },
];

export const agentProjects: Project[] = [
  {
    title: "东北证券 — 企业知识库 RAG 与 Agent 平台",
    meta: "券商知识库重构 · Agent 后端",
    intro:
      "面向东北证券投研、合规等业务条线的企业知识库与智能问答平台。在 Dify 版知识库受限于切片粒度、混合检索、权限隔离、增量索引与评估闭环的背景下，自研重构为多源归一化 + 结构化切片 + Milvus 混合检索 + Agentic RAG 的知识底座，并叠加多 Agent 编排、可观测评估、模型网关与飞书协作，服务券商内部知识检索与问答场景。",
    modules: [
      {
        chip: "bg-cyan-500/70",
        label: "模块一：RAG 检索",
        parts: [
          {
            head: "索引构建",
            headColor: "bg-cyan-500/70",
            items: dealPilotRagIndexHighlights,
          },
          {
            head: "检索与推理",
            headColor: "bg-teal-500/70",
            items: dealPilotRagRetrievalHighlights,
          },
        ],
      },
      {
        chip: "bg-emerald-500/70",
        label: "模块二：Agent 编排与平台底座",
        parts: [{ items: dealPilotPlatformHighlights }],
      },
      {
        chip: "bg-amber-500/70",
        label: "模块三：观测与评估",
        parts: [{ items: dealPilotEvalHighlights }],
      },
      {
        chip: "bg-violet-500/70",
        label: "模块四：基础建设",
        parts: [{ items: dealPilotInfraHighlights }],
      },
      {
        chip: "bg-sky-500/70",
        label: "模块五：与飞书链接",
        parts: [{ items: dealPilotFeishuHighlights }],
      },
    ],
    tags: [
      { name: "LangGraph", accent: true },
      { name: "Deep Agents", accent: true },
      { name: "RAG", accent: true },
      { name: "Milvus", accent: true },
      { name: "BM25", accent: true },
      { name: "Agentic RAG", accent: true },
      { name: "Graph RAG", accent: true },
      { name: "Neo4j" },
      { name: "MinerU" },
      { name: "PaddleOCR" },
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


