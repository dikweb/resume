// 简历数据（经典版与新版共用）

export const imHighlights = [
  {
    title: "Socket 消息收发的竞态处理与增量合并",
    summary:
      "连续发送（文字+多文件）与 Socket 推送同时发生时，各回调异步返回可能基于过期的 chatList.length 覆盖增量，造成消息未上屏。方案用房间级未确认计数 + 50ms debounce 窗口合并增量追加；回调内通过 useRef 桥接读取最新 state，规避闭包捕获旧值。",
  },
  {
    title: "IntersectionObserver 驱动的消息已读追踪",
    summary:
      "基于 IntersectionObserver 对未读消息做可见性检测，进入视口即自动已读上报，已读后 unobserve 避免重复；服务端写入失败回滚本地已读标记；已读上报后用 300ms debounce 刷新房间未读数。",
  },
  {
    title: "细粒度状态管理与渲染优化",
    summary:
      "基于 Zustand 模块化 store（chat/files/socket/login），用 Reselect memoized selector（结果深比较、值相等时复用旧引用）降低高频消息场景的无效订阅渲染；changeReadStatus 更新单条消息时保持其余消息引用稳定，配合高频子组件的 React.memo + 自定义比较函数跳过重渲染。",
  },
  {
    title: "富媒体上传与录制",
    summary:
      "多文件逐个上传并基于 Axios onUploadProgress 实时更新进度；MediaRecorder 实现浏览器端音视频录制；js-web-screen-shot（WebRTC）窗口截图转 File 后统一上传，回填 URL 再组装为消息发出，打通「选择-上传-预览-发送」链路。",
  },
  {
    title: "全局音频播放互斥与事件总线设计",
    summary:
      "用轻量事件总线（Mitt）实现跨组件的播放互斥：任一音频/视频开播即广播，其余实例自动暂停；配合 useRef 读取最新播放状态，避免回调闭包读到旧值，组件卸载时清理监听。",
  },
  {
    title: "Socket.io 双向事件类型契约",
    summary:
      "为 Socket.io 定义 ServerToClientEvents / ClientToServerEvents 事件契约接口，并以该类型标注 Zustand 中持有的 socket 实例，使 emit/on 调用获得编译期事件名与参数校验提示，降低拼写与载荷错配。",
  },
];

export const backendImHighlights = [
  {
    title: "Socket.io 连接握手 JWT 鉴权",
    summary:
      "Socket 长连接在 connection 握手阶段从 socket.handshake.auth.token 提取 JWT 校验，失败立即 disconnect 拒绝；通过后将 userId/username 注入 socket.data，供后续事件处理与状态广播使用。",
  },
  {
    title: "多 Tab 在线状态机与定向状态广播（前后端协同）",
    summary:
      "断开连接后服务端用 io.fetchSockets() 统计该用户剩余活跃连接，据此判定 ONLINE/AWAY/OFFLINE 并落库，同时对当前在线成员 Socket 定向 emit changeStatus；前端配合 600ms 延迟上线 / 立即下线与 1000ms 合并去抖，降低多标签切换的状态抖动与通知风暴。",
  },
  {
    title: "房间列表接口的多查询并行组装",
    summary:
      "房间列表接口先查询用户全部房间，随后以 Promise.all 并行获取各房间未读数与最后一条消息，成员信息经 Map 去重后逐条填充并在内存中拼接，一次请求即产出排序、未读、最后消息、成员等完整列表数据。",
  },
  {
    title: "基于 MongoDB 原子操作符的幂等写入",
    summary:
      "已读追加用 $addToSet 保证同用户不重复；软删除以 deleteMembers 数组 + 查询侧 $nin 过滤实现用户级删除；撤回用 findByIdAndDelete + Socket 全局广播通知在线端移除；好友双向添加用 $ne 守卫防止并发重复，全部为单文档原子写。",
  },
  {
    title: "阿里云 OSS 直传与 MIME 目录路由",
    summary:
      "上传走 Multer memoryStorage，文件以 Buffer 交由 OSS putBuffer 直接上云、无本地磁盘 IO；按 MIME 类型自动路由到 weChatImages/Audio/Video/Files 四个目录，文件列表按 URL 前缀聚合检索。",
  },
];

export const authModuleIntro =
  "多模式身份认证（账号密码+图形验证码 / GitHub OAuth 2.0 / 邮箱注册 / token 化密码重置）+ 前端 PageAuth 路由守卫、safeFetch 统一请求出口（自动注入 JWT、401 全局登出）与后端 koaAuth 白名单、Socket.io 握手鉴权，构成「路由 → 请求 → 会话 → 长连接」全链路认证闭环。";

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
    title: "GitHub OAuth 2.0 三路分支自动合并与并行数据拉取",
    summary:
      "基于 Authorization Code Grant 流程：code→token 交换后并行拉取 GitHub profile 与 verified emails，通过 OAuthRel 表自动判断三路分支——已有绑定直接登录 / 邮箱匹配自动关联 / 新用户自动创建，真正实现首次 OAuth 用户零操作登录。",
  },
  {
    title: "Nodemailer 邮件服务与 EJS 模板化密码重置闭环",
    summary:
      "Nodemailer SMTP 集成 + EJS 模板引擎实现动态邮件渲染；验证码校验、JWT 时效化密码重置链接、Session 发送频控三重保障；配合前端按邮箱域名映射一键跳转网页版邮箱，打通重置闭环。",
  },
];

export const difyHighlights = [
  {
    title: "SSE 流式响应与多阶段渲染管线",
    summary:
      "基于 SSE 实现 Chat 流式对话，解析 token-level streaming；设计消息构建器模式渐进式渲染 LLM 输出，支持 thinking / message / tool_call / error 多种事件类型的差异化 UI 渲染。",
  },
  {
    title: "深度思考推理链路可视化",
    summary:
      "解析模型返回的 reasoning_content，在对话中独立展示思考过程（折叠/展开），实现类似 DeepSeek 的思考链交互体验；Zustand Store 管理 thinking 状态，与 message 流并行处理。",
  },
  {
    title: "联网搜索与工具调用集成",
    summary:
      "Chat 中接入联网搜索能力，工具调用事件以独立卡片呈现搜索步骤与结果摘要；多工具调用并行处理，错误与超时优雅降级。",
  },
  {
    title: "Workflow 自定义节点扩展",
    summary:
      "为 Dify Workflow 开发文档检索节点与会话文档召回节点，基于 ReactFlow 画布实现节点配置面板、参数校验与流式输出预览。",
  },
  {
    title: "知识库召回测试体系",
    summary:
      "构建独立召回测试模块：支持上传测试集、多检索策略并行对比、可视化召回结果（命中率、MRR 等指标）、参数热调优。",
  },
  {
    title: "大型开源项目的组件架构与深度定制",
    summary:
      "在 Dify 50 万+ 行代码的 Next.js 项目中完成深度二次开发，理解其 RSC + App Router 架构、i18n 体系、插件化设计；在保持与上游同步的前提下实现定制功能。",
  },
];

export const agentHighlights = [
  {
    title: "多类型 SSE 流式响应渲染引擎",
    summary:
      "Agent 对话接口返回多种流类型（文本/Markdown/图表/表格/操作建议），通过 event type 字段动态路由到对应渲染组件，一条 SSE 连接承载多种内容形态。",
  },
  {
    title: "指标管理全链路前端建模",
    summary:
      "实现数据源配置 → 数据集 SQL 编辑器 → 维度管理 → 指标定义 → 时间限定 → 指标物化调度的完整前端操作链路；React Hook Form + Zod 多层校验体系。",
  },
  {
    title: "问答上下文与多轮对话管理",
    summary:
      "基于对话历史维护分析上下文（当前指标、维度、时间范围等），Agent 回答自动关联已有分析上下文；上下文面板实时展示当前分析焦点，支持手动切换与清除。",
  },
  {
    title: "智能推荐与异常检测",
    summary:
      "Agent 主动推送异常波动检测（环比/同比异常）和优化建议；推荐卡片组件支持一键采纳，自动将建议转化为实际分析操作。",
  },
  {
    title: "指标视图多维可视化与大数据量渲染优化",
    summary:
      "支持表格/折线图/柱状图/饼图/热力图多种视图切换；维度下钻上卷、时间拖拽缩放；虚拟滚动 + 图表数据采样（LTTB）应对 10 万+ 数据量。",
  },
  {
    title: "指标物化调度与状态追踪",
    summary:
      "异步物化任务的前端调度与全生命周期状态追踪；WebSocket + 轮询双通道状态同步；时间线组件可视化物化历史和增量更新。",
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
      "系统性自学 Python 语言核心并贯通企业级后端工程：从对象模型与元编程、asyncio 异步编程，到 FastAPI 三层架构、SQLAlchemy 2.0 异步 ORM 与依赖注入、自动化测试，再到 AI 导购流式应用与 Docker/k8s 全链路部署，形成从前端到 Python 后端的完整工程能力。",
    points: [
      {
        title: "深入对象模型与元编程",
        desc: "系统掌握元类、装饰器、描述符与魔术方法，理解 type 动态建类与对象创建过程，实现自动注册、单例、惰性计算等机制，从“会写”进阶到理解 Python 类型系统本质。",
      },
      {
        title: "自底向上还原异步编程",
        desc: "从零手写事件循环、Future、协程与 Task 理解 asyncio 运行机制，再衔接 gather / TaskGroup / Queue / to_thread 等官方 API，并基于 httpx + LLM 流式搭建“多智能体协同调研”综合实战。",
      },
      {
        title: "完整工程工具链",
        desc: "全量类型标注、迭代器/生成器、上下文管理器与标准库，配合 pyproject/hatchling 构建发布、uv 依赖与版本管理、uv workspace monorepo 多包组织，具备规范化的 Python 工程协作能力。",
      },
      {
        title: "企业级三层架构与数据层",
        desc: "FastAPI + 依赖注入（IoC/DI）分层为 api/service/model 三层，统一异常与统一响应、中间件；SQLAlchemy 2.0 异步 ORM + Alembic 数据迁移，覆盖长短事务、CRUD、文件上传（OSS）等真实业务；pytest 单元/集成/E2E 分层测试，覆盖率约 80%。",
      },
      {
        title: "大模型流式应用（AI 导购）",
        desc: "Jinja2 按商品数据渲染系统提示词并持久化会话，基于 DeepSeek（OpenAI 兼容协议）实现对话，通过 SSE 逐字推送 + WebSocket 双通道流式输出，前端配套 useSSEChat Hook。",
      },
      {
        title: "全链路交付部署",
        desc: "多阶段 Docker（uv）构建镜像，打通阿里云 OSS/ACR/RDS/ACS 云资产，Helm 部署（3 副本、initContainer 迁移、健康检查、HPA、Ingress），并以阿里云效完成 CI/CD 自动构建发布。",
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
    title: "LLM 底层原理与手写 Agent",
    position:
      "从神经元与 Transformer 原理逐层推导，再逐步手写可运行的 Agent 工程，亲手打通 LLM → Tool Calling → ReAct → MCP → Skill → 子代理全链路，可直接对标 Cursor / Claude Code 类产品结构。",
    points: [
      {
        title: "LLM 底层原理推导",
        desc: "手写 BPE 分词器并训练中文词表，理解词嵌入、注意力与多头 QKV、RoPE、残差归一化；掌握推理侧 Prefill/KV Cache、Temperature、Top-K/Top-P 采样与训练侧 SFT/RLHF/CoT。",
      },
      {
        title: "手写可运行自研 Agent 包",
        desc: "分层实现 model / session（会话持久化以命中 prompt cache）/ prompt（Jinja2 系统提示词）/ tool（Pydantic 动态 Schema + @tool 注册表）/ ReAct 主循环 / 事件驱动 listener，驱动 Agent 自主产出代码与架构分析文档。",
      },
      {
        title: "Agent 能力外延",
        desc: "接入 Ollama 本地模型与 Tavily 搜索构建“Agent 搜索引擎”；实现 Skill 渐进式披露；封装 MCP（JSON-RPC 2.0，stdio/http）Client、用 FastMCP 自建天气服务器并接入；子代理多线程并发编排。",
      },
      {
        title: "可视化表达沉淀",
        desc: "以 React 实现“神经网络交互实验室”（神经元/词嵌入/自注意力页），用前端技术栈可视化 Attention 计算过程，反哺前端表达与讲解能力。",
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
        desc: "StateGraph + Reducer/add_messages 状态管理、节点与条件边、循环/并行、Send 动态扇出（map-reduce）与子图/子 Agent 组合，与前端状态管理心智高度同构、易于迁移。",
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
