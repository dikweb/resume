"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  ExternalLink,
  ChevronRight,
  Phone,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mediaBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const imHighlights = [
  {
    title: "实时消息同步的竞态条件处理",
    summary:
      "设计模块级 pendingSendCountMap 累加计数器 + 50ms debounce 合并方案，解决高并发场景下消息丢失问题；配合 useRef 桥接模式彻底消除 Socket 回调中的 Stale State 闭包陷阱。",
    detail:
      "在 IM 场景下，用户短时间内连续发送多条消息（文字 + 多个文件）时，每个 Socket 回调异步返回后读取到的 chatList.length 可能已被前序回调覆盖，导致部分消息在刷新时丢失。解决方案：在 sendMsg 中为每个 roomId 维护模块级 pendingSendCountMap 计数器，所有回调累加未确认消息数，第一个到达的回调一次性消费全部增量并追加到 chatSize；同时在 weChatEffect 中接入 50ms debounce 窗口，用 pendingMsgCountRef 累积窗口期内所有推送的消息数，确保高并发场景下消息零丢失。对于 Socket 回调中的闭包过期问题，使用 useRef 为每个回调需要的最新 state 维护对应的 Ref，每次渲染时同步 ref.current，回调内部始终通过 ref 读取最新值，避免重订阅引入的事件窗口期。",
  },
  {
    title: "IntersectionObserver 驱动的消息已读追踪",
    summary:
      "基于可见性检测实现自动已读上报，已读后取消观察避免重复；服务端写入失败自动回滚本地状态；debounce 缓冲刷新未读数，避免 API 风暴。",
    detail:
      "传统的已读上报依赖用户滚动事件，存在频繁触发、性能开销大的问题。本方案基于 IntersectionObserver API 对每条未读消息建立可见性观察：消息进入可视区时自动标记已读并通过 Socket emit read 事件通知服务端；已读后立即调用 unobserve 取消对该消息的观察，避免重复检测。引入 readEmittedRef（Set）防止同一帧内 Observer 回调对同一条消息重复 emit read。服务端写入失败时，自动将本地 isRead 回滚为 false 并恢复该消息的 IntersectionObserver，保证已读状态的最终一致性。已读上报成功后通过 300ms debounce 缓冲调用 getRooms 刷新房间未读数，避免短时间内大量 API 请求。",
  },
  {
    title: "多 Tab 场景用户在线状态漂移",
    summary:
      "利用 600ms 延迟上线通知策略，解决浏览器 Tab 切换时 online/away 事件乱序导致的状态漂移，保证多端在线状态最终一致性。",
    detail:
      "用户打开多个 Tab 页面时，关闭一个 Tab 会触发该 Tab 的 disconnect 事件使服务端将用户状态标记为 offline/away，而浏览器自动切换到另一个 Tab 时触发 visibilitychange 使新 Tab 发送 online 事件。由于网络传输的不确定性，online 和 away 事件的到达顺序可能颠倒，导致接收方看到的最终状态为 away 而非 online。解决方案：在 visibilitychange 回调中，away 事件立即发送，online 事件通过 600ms debounce 延迟发送。利用断开事件的即时性和上线事件的延迟，确保 online 事件总是最后到达服务端，覆盖掉之前 Tab 关闭产生的 away 状态。同时在 weChatEffect 中用 1000ms debounce 合并同一 userId 的多次状态变化，只通知最新状态，避免状态快速切换造成的通知轰炸。",
  },
  {
    title: "细粒度状态管理与渲染优化",
    summary:
      "基于 Zustand + Reselect 实现 memoized selector，配合 React.memo 自定义比较器，降低高频消息场景下无效重渲染；模块化 Store 设计（chat / files / socket / login）解耦业务关注点。",
    detail:
      "IM 场景下消息列表高频更新，若无优化措施，每一次 chatList 变化都会触发整棵组件树重渲染。优化方案如下：使用 Reselect 的 createSelector 创建 memoized selector（selectCurRoom、selectCurRoomMembers），配合 lodash.isEqual 做结果引用比较，只有 selector 的结果真正变化时才通知订阅者重新渲染。在 chatContent 的 changeReadStatus 中，更新单条消息的 isRead 时保持其他消息的引用不变，让 React.memo 能命中缓存跳过渲染。对 Voice / MsgWrap / Actions 等高频更新组件包裹 React.memo 并传入自定义比较函数。模块化 Store 设计方面，将 chat、files、socket、login 分别独立为 Zustand Store，每个 Store 只维护自己关注的状态切片，避免单一巨型 Store 带来的不必要的订阅扩散。",
  },
  {
    title: "富媒体上传与录制",
    summary:
      "集成 Axios onUploadProgress 实现批量文件上传实时进度追踪；基于 MediaRecorder API 实现浏览器端音视频录制；WebRTC 窗口截图一键发送。",
    detail:
      "文件上传模块支持批量选择任意类型文件，每个文件通过 uuid 生成唯一标识，在 Zustand useFilesStore 中维护上传队列状态（uploading → success/error）。基于 Axios 的 onUploadProgress 回调逐文件更新进度百分比，UploadList 组件实时渲染进度条和状态图标。音视频录制方面，通过 navigator.mediaDevices.getUserMedia 获取媒体流，MediaRecorder 进行录制，ondataavailable 收集 Blob 数据，onstop 时通过 blobToFile 转为 File 对象并计算录制时长一并上传。截图采用 js-web-screen-shot（WebRTC 窗口模式），截取完成后 base64ToFile 转为 File 上传。上传成功后文件 URL 回填至 Store，用户点击发送时统一组装为消息体通过 Socket 发出，实现完整的「选择-上传-预览-发送」富媒体消息链路。",
  },
  {
    title: "全局音频播放互斥与事件总线设计",
    summary:
      "基于 Mitt 事件总线实现跨组件语音消息播放互斥，确保同时只有一条语音在播放，配合 useRef 消除回调闭包过期问题。",
    detail:
      "IM 聊天列表中可能存在多条语音消息，需保证同一时刻只有一条在播放。方案引入 Mitt 轻量事件总线：每个 Voice 组件在 useEffect 中注册全局 play 事件监听，任意语音开始播放时通过 emitter.emit(play, null) 广播事件，其他 Voice 实例收到事件后自动暂停并通过 setIsPlaying(false) 更新 UI。关键细节是使用 useRef 保存最新 isPlaying 状态（isPlayingRef.current = isPlaying），事件回调中通过 ref 读取而非闭包捕获的旧值，避免因为 play 事件回调注册时的闭包捕获了初始 false 值导致正在播放的音频无法被外部事件暂停。组件卸载时清理事件监听与音频资源，防止内存泄漏。",
  },
  {
    title: "Socket.io 双向类型安全体系",
    summary:
      "基于 TypeScript 泛型为 Socket.io 构建完整的 ServerToClientEvents / ClientToServerEvents 类型约束，覆盖 11 种实时事件，确保编译期类型安全。",
    detail:
      "原生 Socket.io 的 emit/on 方法缺乏类型约束，容易出现事件名拼写错误、参数类型不匹配等问题。本方案利用 Socket.io 的泛型参数在 Socket 实例化时注入类型：const socket = io<ServerToClientEvents, ClientToServerEvents>(url)。分别定义 ServerToClientEvents 和 ClientToServerEvents 两个 interface，每个事件键映射到对应的回调函数签名，参数类型复用 IChatItem、ISendInfo、IReceiveMessage 等业务领域类型。SocketState 在 Zustand 中以 Socket<ServerToClientEvents, ClientToServerEvents> | null 存储，getConnectedSocket 工具函数统一获取类型安全的 Socket 实例。在组件中使用时，socket.on('message', callback) 和 socket.emit('message', payload) 均获得完整的类型推断和自动补全，从源头杜绝运行时类型错误。",
  },
];

const backendImHighlights = [
  {
    title: "Socket.io 连接级 + 数据包级双层认证中间件",
    summary:
      "在 Socket.io 原生机制之上构建 connection 握手 JWT 校验 + packet middleware 事件级二次验证，确保每一次 Socket 通信都经过严格身份鉴权，与 HTTP 中间件形成双向安全闭环。",
    detail:
      "HTTP 层面的 koaAuth 中间件仅覆盖 REST API 请求，Socket 长连接需独立的安全机制。方案在 Socket.io 注册两层中间件：(1) socketConnectAuthMid——在 connection 握手阶段提取 socket.handshake.auth.token，调用 verifyJWT() 校验后将 userId/username 注入 socket.data，失败直接 socket.disconnect() 拒绝连接；(2) socketPacketAuthMid——对每个非连接事件进行二次验证占位，为后续扩展敏感操作（如 exitRoom、changeRoomInfo）的事件级权限校验预留钩子。通过此设计，无论客户端通过 REST API 还是 WebSocket 通信，服务端始终在入口处完成身份鉴权，防止未经认证的客户端建立长连接后窃听或伪造事件。",
  },
  {
    title: "多 Tab 在线状态三态机与全房间精准广播",
    summary:
      "基于 io.fetchSockets() 实时统计用户多 Tab 连接数，实现 ONLINE → AWAY → OFFLINE 三态转换；断开连接时自动遍历该用户所在全部房间的所有成员 Socket，逐房间精准广播状态变更事件，与前端 600ms debounce 策略协同保证多端最终一致性。",
    detail:
      "多 Tab 场景下用户真实在线状态判断是 IM 系统的经典难题。服务端为每个用户维护 userId room，所有该用户的 Socket 在连接时 join 到该 room。状态变更逻辑 handleUserStatusChange：新 Socket 连接时标记 ONLINE；Socket 断开时通过 io.fetchSockets() 获取所有活跃连接数——若仍有 ≥2 个连接则降级为 AWAY（用户仍活跃在其他 Tab），无连接则为 OFFLINE。随后查询用户所在的所有房间（WeChatRoom），提取所有成员 userId 去重，通过 io.of('/').fetchSockets() 找到每个成员的活跃 Socket，emit changeStatus 事件携带 {userId, nicknameOfRoom, status}。前端配合 600ms 延迟上线策略，利用「断开即时、上线延迟」的事件到达顺序倒置技巧，确保 online 事件始终最后到达，覆盖掉 Tab 切换产生的 away 状态，实现多端在线状态的精准同步。",
  },
  {
    title: "MongoDB 聚合管道实现高性能房间列表",
    summary:
      "将逐房间查询的 O(n×m) 次数据库 IO 压缩为少量批量查询 + 内存聚合；单 API 完成 room 列表、未读数统计、最后一条消息（含引用解析）、成员信息去重填充的完整数据组装。",
    detail:
      "房间列表 API /api/weChat/getRoomsByUserId 需要在一次请求中返回完整的聊天面板数据——包括每个房间的基本信息、未读消息数、最后一条消息内容及发送者、房间成员头像昵称等。若采用逐房间查询模式会产生 n×(1room + 1unread + 1lastMsg + m×member) 次数据库请求。优化方案：先一次查询用户所有 rooms，并行查询所有 room 的未读数+最后消息，将所有 member userId 去重后一次批量查询 User 表，最后在内存中组装完整结构（enrichedMembers、lastMessage 附着 nicknameOfRoom、sortedTime 取用户最后消息时间或 room 创建时间）。聚合过程中自动过滤仅剩 1 人的废弃房间，通过 unreadCount === 0 && lastMessage 为空 双重条件判断。相比逐房间查询，数据库请求次数从潜在数百次降至 3-5 次。",
  },
  {
    title: "消息操作的原子性与最终一致性",
    summary:
      "$addToSet 原子化已读成员追加防止并发重复写入；$nin 实现用户级软删除（deleteMembers 数组过滤）；全局 broadcast 撤回覆盖所有在线客户端；$ne 并发守卫防止好友双向重复添加。",
    detail:
      "IM 系统中多个客户端可能并发执行同一操作，需保证数据的一致性与幂等性：(1) 已读上报——服务端使用 MongoDB $addToSet 操作符向 readMembers 数组追加 userId，利用集合天然唯一性在数据库层面防止同一用户被重复标记已读，无需应用层加锁；(2) 软删除——deleteMembers 数组记录已删除此消息的用户，所有消息查询统一通过 deleteMembers: {$nin: [userId]} 过滤，实现用户视角的消息删除，同时保留数据完整性供其他成员查看；(3) 消息撤回——调用 findByIdAndDelete 后通过 socket.broadcast.emit 全局广播 revokeMsg（非仅 room 广播），确保所有在线的房间成员客户端同步删除该消息，未在线的成员在下一次拉取消息列表时自动不再返回；(4) 好友添加——使用 $push + $ne 守卫（friends: {$ne: friendId}）防止并发场景下好友关系被重复插入。所有原子操作均利用 MongoDB 的单文档原子性保证，无需引入分布式锁。",
  },
  {
    title: "阿里云 OSS 存储与 MIME 智能路由分发",
    summary:
      "Multer memoryStorage 零磁盘 IO 设计，根据文件 MIME 类型自动路由至四个 OSS 目录（Images/Audio/Video/Files），Buffer 直接上传 Ali-OSS；文件按类型聚合检索，支持按房间一键清理。",
    detail:
      "文件上传模块设计为两条路径：(1) 本地开发使用 Multer diskStorage + 本地 public/uploads/ 目录；(2) 生产环境使用 Multer memoryStorage，文件以 Buffer 形式存在于内存中，通过 OSS client 的 putBuffer() 方法直接推送到阿里云 OSS，全程不做磁盘写入。uploadWeChatFile 控制器依据 MIME 类型前缀进行四路分发——image/* 路由至 weChatImages/，audio/* 路由至 weChatAudio/，video/* 路由至 weChatVideo/，其余文件路由至 weChatFiles/——文件名通过 timestamp 后缀保证唯一性。文件列表检索通过 message 字段正则匹配 OSS 域名 + 四种路径前缀实现按类型聚合查询。clearRoomMsg 时遍历房间所有消息，解析文件 URL 调用 OSS deleteObject 批量清理 OSS 资源，保证存储空间不被废弃文件占据。",
  },
];

const authHighlights = [
  {
    title: "多层表单校验与 Zod Schema 继承体系",
    summary:
      "基于 react-hook-form + Zod 构建 5 套表单校验 Schema，通过 extend/pick/refine 实现继承式设计；密码强度正则校验 + 跨字段确认 + 条件验证（遮盖密码场景）。",
    detail:
      "认证系统涉及注册、登录、忘记密码、重置密码、个人信息修改等 5 个表单场景，为避免重复定义，设计 BaseSchema 基础模式（username / password / passwordAgain / email / nickname），各表单通过 Zod 的 extend、pick、merge 派生特定模式。SignSchema 在 BaseSchema 上扩展 captcha 并添加 .refine() 交叉验证 password === passwordAgain。ResetSchema 通过 .pick 仅提取 username 和 password 字段再扩展 token。UserInfoSchema 处理个人信息编辑的特殊场景——表单预填充遮盖密码 ******——通过 Zod 条件验证：密码不为空且非遮盖值时进行强度校验，否则跳过，避免修改其他信息时误报密码错误。密码强度规则（/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,16}$/）要求大写、小写、数字、特殊字符四要素，通过 @hookform/resolvers 的 zodResolver 无缝集成至 react-hook-form。",
  },
  {
    title: "全局安全中间件 safeFetch 设计",
    summary:
      "统一请求客户端，自动注入 Authorization 头、按内容类型分发响应解析（JSON / Blob / Text）、401 全局拦截自动登出、响应头 token 续期机制。",
    detail:
      "safeFetch 是对原生 fetch 的增强封装，作为项目中所有 API 调用的唯一出口。核心机制包括：(1) 请求拦截——自动从 sessionStorage 读取 Authorization 令牌并注入请求头，支持 params 参数自动序列化为 URL 查询字符串（含 URL 编码）；(2) 响应分发——根据 Content-Type 头分类处理，image/* 类型（验证码）通过 URL.createObjectURL 转为 Blob URL，text/* 返回纯文本，application/json 解析后校验 code === 0 返回 data 否则 toast 错误；(3) Token 续期——若响应头包含新的 Authorization，自动写回 sessionStorage 实现无感续期；(4) 401 全局处理——收到 401 时调用 dealLogout(true)，延迟 1 秒 toast 提示「登录已过期」后硬重定向至登录页，清除 sessionStorage 中所有会话数据。通过此设计，业务层完全无需关心认证头注入和过期处理。",
  },
  {
    title: "多模式认证与路由守卫体系",
    summary:
      "支持账号密码 + 图形验证码登录、GitHub OAuth 2.0 登录、邮箱注册（含验证码倒计时）、token 化密码重置；PageAuth 高阶组件实现路由级别访问控制。",
    detail:
      "账号密码登录：集成 Captcha 图形验证码组件（Blob URL 生命周期管理、失败自动刷新），密码客户端 MD5 哈希后传输，支持「7 天免登录」选项。GitHub OAuth 2.0：通过重定向至 GitHub 授权端点，回调路由 /oauth-token 由 OAuthToken 组件接收 URL 参数中的 token，写入 sessionStorage 后重定向至主页面。邮箱注册：发送验证码前先对 email 字段做独立校验（form.trigger('email')），使用自定义 hook useCount 实现 60 秒倒计时按钮，独立 emailLoading / submitLoading 状态防止重复提交。密码重置：通过 token 化链接（?username=xxx&token=xxx）保证安全性，ResetSchema 校验后提交。路由守卫 PageAuth：维护 noAuthPath 白名单数组，未命中白名单时调用 whoami API 验证会话，失败则重定向至登录页；会话验证过程中显示全屏 Loading 组件防止内容闪现。",
  },
  {
    title: "会话安全与密码传输策略",
    summary:
      "双层 sessionStorage 会话存储（JWT + AES 加密 userId）、MD5 客户端密码哈希、7 天免登录、忘记密码智能邮箱跳转。",
    detail:
      "会话管理采用双层存储策略：第一层为服务端签发的 JWT 令牌（key: Authorization），所有 API 请求通过 safeFetch 自动携带；第二层为 AES 加密的 userId（key: Local），使用 cryptoSecret 作为密钥，在 whoami 成功后将用户 ID 加密存储，忘记密码流程中用于查找用户邮箱。密码安全方面，所有密码在客户端先进行 MD5 哈希再传输，避免明文暴露（虽不能替代 HTTPS，但提供了基本的中间人防护）。忘记密码流程设计考虑了用户体验闭环：用户输入用户名 → GET API 查找绑定邮箱 → 跳转确认页 → 根据邮箱域名（@qq.com / @163.com / @gmail.com）智能映射网页版邮箱 URL 提供一键跳转 → 用户点击邮件中的 token 链接进入重置页完成密码更新。",
  },
];

const backendAuthHighlights = [
  {
    title: "Koa 洋葱模型安全中间件链设计",
    summary:
      "基于 Koa 洋葱模型设计五层中间件链（session → CORS → bodyParser → autoClearSession → koaAuth），白名单路由豁免 + 401 统一拦截；自定义 sub-millisecond TTL 的会话管理器实现验证码自动过期清理。",
    detail:
      "Koa 中间件的洋葱模型允许在每个请求的生命周期中按序穿过各层中间件。本项目按安全优先级设计了五层中间件链：(1) koa-session——签名 Cookie + HttpOnly + SameSite strict 模式保障会话不可窃取；(2) @koa/cors——生产环境白名单 origin（dikweb.top），credentials 为 true 支持跨域携带 Cookie；(3) koa-bodyparser——自动解析 JSON 请求体；(4) autoClearSession——自定义中间件，在每次请求时遍历 session 所有键值，通过对比 Date.now() 与 _createdAt + _maxAge 清理已过期字段，以 sub-millisecond 精度控制 email_captcha（5min）、login_captcha（5min）、email_sended（10min）三类会话数据的生命周期；(5) koaAuth——JWT 认证中间件，维护 13 个 noAuthPath 白名单，白名单外请求从 Authorization 头提取 Bearer token 调用 verifyJWT 校验，失败返回 401，成功将 userId 注入 ctx.state 供下游控制器使用。此链式设计确保每一层职责单一，新增安全中间件只需插入到链中对应位置即可。",
  },
  {
    title: "GitHub OAuth 2.0 三路分支自动合并与并行数据拉取",
    summary:
      "基于 Authorization Code Grant 流程：code→token 交换后并行拉取 GitHub profile 与 verified emails，通过 OAuthRel 表自动判断三路分支——已有绑定直接登录 / 邮箱匹配自动关联 / 新用户自动创建，真正实现首次 OAuth 用户零操作登录。",
    detail:
      "GitHub OAuth 回调路由 /passport/github/callback 不携带 /api 前缀，自动绕过 koaAuth 白名单（OAuth 流程无需预先登录）。回调处理的核心逻辑：(1) 用 code 向 GitHub 授权端点 POST 请求 exchange access_token，携带 client_id + client_secret；(2) 获得 token 后并行发起两个 API 请求——GET /user 获取 GitHub profile（login、name、avatar_url）、GET /user/emails 获取所有邮箱列表——使用 Promise.all 并行而非串行，减少 50% 等待时间；(3) 筛选 primary && verified 的邮箱作为注册邮箱；(4) 三路分支判断：若 providerId 在 OAuthRel 表中存在（已有绑定关系）→ 直接查找用户登录；若无绑定但邮箱已在系统中注册 → 自动创建 OAuthRel 关联记录实现账号合并；若无绑定且邮箱未注册 → 自动创建 User 文档（username=login、nickname=name、email、avatarUrl）并创建 OAuthRel。所有 OAuthRel 写入使用 findOneAndUpdate + upsert 保证幂等性。最终重定向至前端 /oauth-token?token=xxx，前端 OAuthToken 组件摘取 token 写入 sessionStorage 完成登录。",
  },
  {
    title: "JWT + Session 混合认证与 Schema 级纵深防御",
    summary:
      "JWT 负责无状态 API 认证（1天/7天双过期策略），Koa Session 负责有状态验证码生命周期管理；Mongoose Schema 层 .select('-password') 全局剔除密码字段，maskdata 库实现邮箱掩码脱敏，多道防线构成纵深防御体系。",
    detail:
      "认证系统采用 JWT 与 Session 分工协作的混合策略：JWT 通过 jsonwebtoken.sign() 签发，payload 仅包含 userId，密钥存储在环境变量中，默认 1 天过期、用户勾选「7天免登录」则 7 天过期，适用于无状态 API 请求的频繁校验；Session 则用于管理登录验证码、注册/修改信息邮箱验证码、密码重置邮件发送频控等有状态场景，每个 session 字段通过 setSessionField(ctx, key, value, maxAge) 独立设置过期时间（5min/10min），由 autoClearSession 中间件自动清理过期数据。数据库层面：所有 User 查询统一使用 .select('-password -__v') 剔除密码和版本字段，从 Mongoose Query 层杜绝密码泄漏的可能性；邮箱查询结果通过 maskdata 库进行部分脱敏（如 123***@qq.com），仅在前端「账户与安全」页面展示脱敏后的邮箱，防止屏幕窥探。这种多层防御策略——路由级 JWT、会话级 Session、数据层 Select 剔除、展示层 Mask——构成纵深安全体系。",
  },
  {
    title: "Nodemailer 邮件服务与 EJS 模板化密码重置闭环",
    summary:
      "Nodemailer SMTP 集成 + EJS 模板引擎实现动态邮件渲染；注册邮证码验证、JWT 时效化密码重置链接、Session 发送频控三重保障；智能邮箱域名映射实现一键跳转网页版邮箱。",
    detail:
      "邮件服务通过 Nodemailer 对接 QQ 邮箱 SMTP（587 端口，STARTTLS），封装为 sendEmail 函数，支持 to/subject/template 三个参数，内部渲染 EJS 模板（email.ejs 用于密码重置、email_captcha.ejs 用于注册验证码）并注入动态变量（nickname、token 化重置链接、6 位随机验证码）。密码重置流程：(1) 用户输入用户名，GET API 查询关联邮箱，使用 maskdata 脱敏后返回（如 123***@qq.com）；(2) 用户确认发送，服务端检查 EMAIL_SENDED session 标志位（10min TTL）防止重复发送，通过后签发 10min 有效期的 JWT（payload 含 userId）作为重置凭证；(3) 用户点击邮件中的重置链接（?username=xxx&token=xxx），前端展示重置表单，POST 提交新密码 + JWT，服务端 verifyJWT 后更新密码。用户体验细节：确认页根据邮箱域名智能映射网页版邮箱 URL（@qq.com→mail.qq.com、@163.com→mail.163.com、@gmail.com→mail.google.com），提供「前往邮箱」一键跳转按钮。",
  },
];

const difyHighlights = [
  {
    title: "SSE 流式响应与多阶段渲染管线",
    summary:
      "基于 SSE 实现 Chat 流式对话，解析 token-level streaming；设计消息构建器模式渐进式渲染 LLM 输出，支持 thinking / message / tool_call / error 多种事件类型的差异化 UI 渲染。",
    detail:
      "Dify Chat 模块的核心是 SSE 流式响应处理。服务端通过 text/event-stream 推送 token 级别数据，前端需要将增量 token 拼接为完整消息并实时渲染。方案设计分三层：(1) SSE 事件解析层——使用 fetch + ReadableStream 接收流数据，按 event type（message / agent_message / agent_thought / tool_call / error）分发到对应处理器；(2) 消息构建层——维护消息对象构建器，每收到 delta 增量追加到对应字段（content / reasoning_content / tool_calls），通过 Zustand Store 通知 UI 更新；(3) 渲染层——根据消息角色（user / assistant / tool）和内容类型（text / thinking / image_file / tool_call_result）动态选择渲染组件，thinking 内容以折叠面板展示、tool_call 以步骤卡片呈现、普通消息以 Markdown 渲染。整套管线确保流式数据的正确拼接与 UI 的增量更新。",
  },
  {
    title: "深度思考推理链路可视化",
    summary:
      "解析模型返回的 reasoning_content，在对话中独立展示思考过程（折叠/展开），实现类似 DeepSeek 的思考链交互体验；Zustand Store 管理 thinking 状态，与 message 流并行处理。",
    detail:
      "DeepSeek-R1 等推理模型会在正式回答前输出一段思考过程（CoT），SSE 数据流中 thinking 和 message 交替出现。前端实现：(1) 在消息构建器中维护 thinkingBuffer 和 messageBuffer 两个独立缓冲区，根据 event type 分别追加；(2) ThinkingBlock 组件以折叠面板展示思考链，默认展开最近一次思考，其余折叠，支持代码块高亮和分段展示；(3) 思考过程支持流式渲染——每收到 reasoning_content delta 立即追加显示，光标闪烁动画标识思考进行中，思考完成后自动折叠并平滑过渡到正式回答；(4) 思考链与最终回答之间用动画过渡区隔，视觉上清晰区分推理过程与结论。",
  },
  {
    title: "联网搜索与工具调用集成",
    summary:
      "Chat 中接入联网搜索能力，工具调用事件以独立卡片呈现搜索步骤与结果摘要；多工具调用并行处理，错误与超时优雅降级。",
    detail:
      "用户启用联网搜索后，Agent 会先调用搜索工具获取外部信息再综合回答。前端实现要点：(1) 工具调用生命周期管理——tool_call → tool_processing → tool_result 状态流转，每一步对应 UI 状态（搜索中 / 搜索完成 / 搜索失败）；(2) 多工具并行调用——一次提问可能触发 3-5 个并行搜索，使用唯一 tool_call_id 区分，并行展示多个搜索卡片；(3) 结果摘要——搜索结果可能很长，对返回内容做前端截断（前 200 字 + 来源 URL），用户可点击展开查看全部；(4) 搜索来源引用——最终回答中的引用以 superscript 数字标记，底部展示引用列表（标题 + URL），点击可跳转。",
  },
  {
    title: "Workflow 自定义节点扩展",
    summary:
      "为 Dify Workflow 开发文档检索节点与会话文档召回节点，基于 ReactFlow 画布实现节点配置面板、参数校验与流式输出预览。",
    detail:
      "Dify Workflow 基于 ReactFlow 构建可视化工作流编辑器，每个节点类型需前端注册节点定义 + 配置面板 + 运行面板三部分。(1) 文档检索节点——对接知识库 RAG 接口，配置面板支持选择知识库、设置 TopK 和相似度阈值、选择检索策略（语义/关键词/混合）；运行面板展示检索到的文档片段列表（标题、匹配分数、内容预览）；(2) 会话文档召回节点——从当前对话历史中召回相关文档，配置面板支持自定义召回范围（最近 N 条消息 / 整个会话）、相关性阈值过滤；节点输出以 LLM 变量形式注入下游节点；(3) 节点间的变量映射——实现上游节点输出变量到下游节点输入参数的自动映射与类型校验。",
  },
  {
    title: "知识库召回测试体系",
    summary:
      "构建独立召回测试模块：支持上传测试集、多检索策略并行对比、可视化召回结果（命中率、MRR 等指标）、参数热调优。",
    detail:
      "知识库的检索质量直接影响 RAG 效果，召回测试模块用于量化评估检索策略。实现方案：(1) 测试集管理——支持 CSV/JSON 上传，每行包含查询文本 + 预期召回文档 ID；(2) 多策略并行对比——同时运行语义检索、关键词检索、混合检索等多种策略，横向对比各策略的命中率、MRR、NDCG 等指标；(3) 结果可视化——以热力图展示「查询 × 文档」的匹配分数矩阵，以柱状图对比各策略指标，以表格展示逐查询的详细结果（召回文档排名、是否命中预期）；(4) 参数热调优——调整 TopK / 相似度阈值后即时重新评估，无需重新上传测试集。",
  },
  {
    title: "大型开源项目的组件架构与深度定制",
    summary:
      "在 Dify 50 万+ 行代码的 Next.js 项目中完成深度二次开发，理解其 RSC + App Router 架构、i18n 体系、插件化设计；在保持与上游同步的前提下实现定制功能。",
    detail:
      "Dify 是一个大型全栈项目，前端采用 Next.js 14 App Router + RSC 架构，组件嵌套层次可达 10+ 层，状态管理分散在 Context / SWR / 全局 Store 中。二次开发的关键挑战：(1) 理解架构——梳理核心页面链路（App 列表 → App 详情 → Chat/Workflow/Knowledge）、RSC 与 Client Component 边界、API 客户端封装（swr fetcher 工厂模式）；(2) 最小侵入定制——在 Chat 页面注入自定义 hook（useCustomChatEffect）而非直接修改核心组件，通过 React.Context patch 方式覆盖默认行为；(3) 上游同步策略——公司 GitLab 维护 fork 版本，定期 git merge 上游 master；定制功能集中在独立模块目录，git merge 时冲突量控制在个位数；(4) 国际化——新增 UI 文案追加到 en-US / zh-Hans 翻译文件，复用 Dify 的 i18n hook。整个过程极大提升了阅读大型开源项目代码和架构设计的能力。",
  },
];

const agentHighlights = [
  {
    title: "多类型 SSE 流式响应渲染引擎",
    summary:
      "Agent 对话接口返回多种流类型（文本/Markdown/图表/表格/操作建议），通过 event type 字段动态路由到对应渲染组件，一条 SSE 连接承载多种内容形态。",
    detail:
      "智能分析 Agent 的对话不同于普通 Chat，回答中可能穿插 Markdown 分析文本、ECharts 图表、数据表格、操作建议按钮等多种内容形式。方案设计：(1) SSE event type 协议定义——text（Markdown 增量文本）、chart（图表配置 JSON）、table（列定义 + 行数据）、suggestion（操作建议卡片）、thinking（思考过程）、error（错误信息）六种类型；(2) 流式渲染引擎——ContentDispatcher 组件根据 event type 分发到对应渲染器（MarkdownBlock / ChartBlock / TableBlock / SuggestionBlock / ThinkingBlock），每个渲染器独立管理自己的流式构建状态；(3) 混合内容的排序与布局——Agent 回答由多个 content block 组成，每个 block 独立流式渲染，block 间自动分隔，支持 block 级别的加载/完成/错误状态；(4) 图表增量构建——chart 类型的 SSE delta 逐步构建 ECharts option 对象，每收到完整 option 后触发图表渲染，避免高频重绘。",
  },
  {
    title: "指标管理全链路前端建模",
    summary:
      "实现数据源配置 → 数据集 SQL 编辑器 → 维度管理 → 指标定义 → 时间限定 → 指标物化调度的完整前端操作链路；React Hook Form + Zod 多层校验体系。",
    detail:
      "指标管理是 Agent 的数据底座，前端需提供从数据接入到指标物化的完整操作链路：(1) 数据源管理——支持 MySQL / ClickHouse / Hive 等多种数据源连接配置，连接测试反馈机制；(2) 数据集管理——集成 Monaco Editor 提供 SQL 查询编辑器，支持语法高亮、自动补全、格式化，查询预览功能（分页 + 列定义自动推断）；(3) 维度管理——支持从数据集字段中选择维度（分组字段），支持维度层级关系定义（如城市 → 省份 → 大区），维度值枚举与搜索；(4) 指标定义——支持聚合指标（SUM/COUNT/AVG）、派生指标（A/B*100%）、复合指标（嵌套计算），公式编辑器实时语法校验；(5) 指标物化——定时任务调度物化计算，前端展示物化历史时间线，支持增量/全量物化。全链路通过 React Hook Form 管理表单状态，Zod Schema 做字段级校验。",
  },
  {
    title: "问答上下文与多轮对话管理",
    summary:
      "基于对话历史维护分析上下文（当前指标、维度、时间范围等），Agent 回答自动关联已有分析上下文；上下文面板实时展示当前分析焦点，支持手动切换与清除。",
    detail:
      "智能分析场景中用户通常会连续追问，Agent 需要理解当前的分析上下文。实现方案：(1) 上下文模型——ContextState 维护 { metrics, dimensions, timeRange, filters, chartType } 六元组，每次 Agent 回答中提取结构化上下文并更新；(2) 上下文面板——侧边栏实时展示当前分析焦点（正在分析的指标名、维度、时间范围），点击可切换或清除；(3) 上下文传递——每次发送消息时将 ContextState 序列化后附带在请求中，Agent 后端据此理解用户意图；(4) 上下文推断——当用户说「换成柱状图看看」或「只看华东地区」时，前端做简单意图识别（关键词匹配）预填充上下文，减少后端推断压力；(5) 去上下文化——用户说「重新分析」或切换页面时清除上下文，避免旧状态干扰新分析。",
  },
  {
    title: "智能推荐与异常检测",
    summary:
      "Agent 主动推送异常波动检测（环比/同比异常）和优化建议；推荐卡片组件支持一键采纳，自动将建议转化为实际分析操作。",
    detail:
      "Agent 不仅被动回答，还能主动推送洞察：(1) 异常检测——基于指标历史数据计算环比/同比波动，超过阈值自动生成异常卡片，标注波动幅度与可能原因；(2) 推荐卡片——分为趋势推荐（「最近 7 天销售额呈上升趋势，建议加大推广」）、关联推荐（「销售额与广告投放量的相关系数为 0.87」）、优化建议（「建议将库存周转天数从 45 天降至 30 天」）三种类型；(3) 一键采纳——推荐卡片底部提供操作按钮，点击后自动将推荐转化为具体的分析查询或图表配置；(4) 流式推送——异常和推荐通过 SSE 事件流主动推送到对话中，无需用户额外提问。",
  },
  {
    title: "指标视图多维可视化与大数据量渲染优化",
    summary:
      "支持表格/折线图/柱状图/饼图/热力图多种视图切换；维度下钻上卷、时间拖拽缩放；虚拟滚动 + 图表数据采样（LTTB）应对 10 万+ 数据量。",
    detail:
      "指标视图是用户分析数据的主要界面：(1) 多维可视化——ECharts 封装统一图表组件，支持折线图/柱状图/饼图/热力图/散点图，通过 chartType 切换，图表支持多 Y 轴（不同量级指标在同一视图展示）；(2) 维度下钻——点击图表维度值触发下钻（如省份 → 城市），面包屑导航支持上卷回退；(3) 时间交互——时间轴支持拖拽缩放和区间选择，图表联动更新；(4) 大数据量优化——表格使用 @tanstack/react-virtual 虚拟滚动支持 10 万+ 行数据；图表端做数据采样（LTTB 算法），10 万数据点采样为 1000 个显示点，保留趋势特征的同时保证渲染帧率；(5) 图表联动——多个图表共享 crosshair，鼠标悬停时所有图表同步显示对应时间点的数据详情。",
  },
  {
    title: "指标物化调度与状态追踪",
    summary:
      "异步物化任务的前端调度与全生命周期状态追踪；WebSocket + 轮询双通道状态同步；时间线组件可视化物化历史和增量更新。",
    detail:
      "指标物化是将逻辑指标预计算为物理数据表的异步任务，前端需完整追踪其生命周期：(1) 物化任务创建——选择物化范围（全量/增量）、调度策略（手动/定时/事件触发），表单提交后返回 taskId；(2) 双通道状态同步——WebSocket 实时推送任务状态变更（pending → running → success/failed），轮询作为 fallback（30s 间隔）；(3) 物化历史时间线——以时间线组件展示每次物化记录（时间、耗时、数据量、状态），绿色成功 / 红色失败 / 黄色运行中，增量物化以蓝色标记区别于全量；(4) 失败处理——物化失败自动 toast 通知，支持一键重试（带上次失败原因提示）和查看错误日志；(5) 物化后操作——物化成功后自动刷新依赖该指标的所有视图，前端维护指标→视图的依赖图（DAG），只刷新受影响的视图。",
  },
];

const componentHighlights = [
  {
    title: "React Query 驱动的页面级缓存架构",
    summary:
      "以页面路径 + API + 查询参数为复合缓存 Key，实现查询条件与 Table 数据的双层缓存，Tab 切换、路由往返零重新请求；配合 dev 模式内置缓存面板，开发者可直接查看缓存内容与失效策略。",
    detail:
      "共性场景：多个 Tab 页切换时反复触发相同 API 请求，导致后端压力大、用户体验差。方案基于 React Query 构建了页面级缓存体系：(1) 复合 Cache Key 设计——将 window.location.pathname + API URL + 序列化后的 params 拼接为唯一 Key，保证不同页面不同查询条件的缓存互不干扰；(2) 双层缓存——不仅缓存 Table 数据，查询条件表单的值也纳入缓存，Tab 切回时条件 + 数据同步恢复，真正实现页面级状态保持；(3) 缓存失效策略——通过 staleTime 控制新鲜度，支持手动 invalidate 或通过 Tab 关闭事件自动清理；(4) DevTools 集成——开发模式下内置缓存可视化面板，可查看所有缓存的 Key → Value 映射、缓存命中率、失效时间，极大提升开发体验。此机制从最初的仅 Table 缓存演进为页面级缓存，最终替代了老系统的页签功能模块。",
  },
  {
    title: "FMSSearchTable — 查询列表一体化组件",
    summary:
      "将「查询条件 + Table 展示 + 分页 + Tab 缓存 + 辅助操作」封装为单一组件，对外暴露极简 API（仅需传入 searchItems + columns + api），开发者交付速度提升数倍。",
    detail:
      "各业务系统中查询列表页是最高频的场景，但每个页面除核心业务外还需编写大量辅助代码（loading 状态、空数据态、分页控制、筛选条件收集、Tab 切换缓存等），导致大量重复劳动和 Bug。FMSSearchTable 的设计理念：(1) 声明式配置——开发者只需定义 searchItems（查询字段 Schema）和 columns（Table 列定义），组件自动完成表单渲染、条件收集、API 调用、分页联动；(2) 内部状态封闭——loading、empty、error 等边界状态由组件内部统一处理，通过 render props 暴露自定义插槽；(3) 内置插件体系——搜索区域支持自定义插件注册（如批量导出、高级筛选面板），Table 区域支持行选择、行展开、列固定等功能扩展；(4) 请求去重与缓存——同一 QueryKey 的并发请求自动去重，已缓存的页面 Tab 间秒切不闪屏。",
  },
  {
    title: "FMSModal — 声明式生命周期弹窗",
    summary:
      "将 Modal visible 状态管理下沉至组件内部，开发者仅需关注 open / close / cancel / submit 四个声明式回调，代码集中度与可维护性大幅提升。",
    detail:
      "原有 Modal 使用模式中，开发者需手动管理 visible 状态、destroy 时机、表单重置逻辑，大量分散的状态代码降低可维护性。FMSModal 的改进：(1) visible 内部化——组件通过 trigger（按钮/链接）自动控制 visible 开关，销毁时自动清理内部状态，开发者无需手动 toggle；(2) 集中式回调——提供 onOpen / onClose / onCancel / onSubmit 四个生命周期钩子，所有业务逻辑集中在 hook 内部编排，代码紧凑且清晰；(3) 多形态覆盖——通过 type 参数支持 Form 弹窗（自动集成表单校验与提交）、Log 弹窗（滚动日志列表）、Content 弹窗（自定义内容展示）三种常见场景；(4) 链式调用——支持 beforeOpen / afterClose 拦截器，可用于权限校验、数据预加载等前置逻辑。",
  },
  {
    title: "业务组件 NPM 包发布全链路",
    summary:
      "首次在业务组件平台发布财务业务组件 NPM 包，走通「脚手架开发 → 组件构建 → 文档站点部署 → NPM 发布」全流程，并输出标准化操作文档供团队复用。",
    detail:
      "组件开发完成后，若仅在单个项目中引用，无法实现跨系统版本统一。方案推动将组件发布为公司级业务组件 NPM 包：(1) 使用公司内部业务组件脚手架初始化项目，获得开箱即用的开发环境、构建配置、测试框架；(2) 按组件拆分独立目录（SearchTable / Modal），每个目录包含 index.tsx + useXXX.ts + styles + __tests__，代码结构规范一致；(3) 文档站点自动生成——基于 JSDoc 注释 + dumi 自动生成组件 API 文档与 Demo 示例，CI 流程在代码合入后自动部署到组件平台文档站；(4) NPM 发包流程——semantic-release 自动管理版本号，commitizen + commitlint 规范 Git 提交，所有 MR 合并到 master 后自动发布新版本。整个过程沉淀为标准化文档，成为后续团队发布其他业务组件的参照模板。",
  },
];

// ── AI Agent 体系化学习与实践（系统学习 · 动手实践，尚未接入生产） ──
const learningIntro =
  "以下为个人在 Python、后端工程与 LLM/Agent 方向利用业余时间自学的学习与实践成果，旨在补齐从前端到 Python 后端、再到 LLM 原理与 Agent 工程的完整能力闭环。";

type CoursePoint = { title: string; desc: string };

type Course = {
  title: string;
  position: string;
  points: CoursePoint[];
  tags: { name: string; accent?: boolean }[];
};

const learningCourses: Course[] = [
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

function HighlightSection({
  items,
  openIndex,
  setOpenIndex,
}: {
  items: typeof imHighlights;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}) {
  return (
    <div className="space-y-px">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <Collapsible
            key={i}
            open={isOpen}
            onOpenChange={() => setOpenIndex(isOpen ? null : i)}
          >
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex gap-3 text-sm text-left py-2.5 px-2 -mx-2 rounded-lg transition-colors cursor-pointer group ${
                  isOpen ? "bg-muted/60" : "hover:bg-muted/30"
                }`}
              >
                <ChevronRight
                  size={16}
                  className={`shrink-0 mt-0.5 text-muted-foreground/40 transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
                <div className="min-w-0">
                  <span className="font-medium text-foreground/90">
                    {item.title}
                  </span>
                  {!isOpen && (
                    <span className="text-muted-foreground ml-1">
                      —— {item.summary}
                    </span>
                  )}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <div className="flex gap-3 text-sm pl-7 pr-2 pb-3 text-muted-foreground leading-relaxed">
                <div className="w-px shrink-0 bg-border/50 mt-1.5 mb-1.5" />
                <span>{item.detail}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

function LearningCard({ course }: { course: Course }) {
  return (
    <Card className="shadow-none border-border/60 hover:border-border transition-colors">
      <CardContent className="pt-6">
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

export default function Home() {
  const [imOpenIndex, setImOpenIndex] = useState<number | null>(null);
  const [authOpenIndex, setAuthOpenIndex] = useState<number | null>(null);
  const [backendImOpenIndex, setBackendImOpenIndex] = useState<number | null>(
    null,
  );
  const [backendAuthOpenIndex, setBackendAuthOpenIndex] = useState<
    number | null
  >(null);
  const [difyOpenIndex, setDifyOpenIndex] = useState<number | null>(null);
  const [agentOpenIndex, setAgentOpenIndex] = useState<number | null>(null);
  const [componentOpenIndex, setComponentOpenIndex] = useState<number | null>(
    null,
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-10">
      {/* ── Header ── */}
      <header className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-border shadow-lg">
            <Image
              src={`${mediaBasePath}/avatars/avatar.webp`}
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
          <CardContent className="pt-6">
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
              <a
                href="/wechat"
                className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                在线演示
                <ExternalLink size={12} />
              </a>
            </div>

            {/* ── Module 1: 统一身份认证体系 ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-primary/70" />
                <h4 className="text-sm font-semibold text-foreground/80">
                  模块一：统一身份认证体系
                </h4>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-sky-500/70 rounded-sm shrink-0" />
                <h5 className="text-xs font-semibold text-foreground/70">
                  前端 — Next.js + React 架构
                </h5>
              </div>
              <HighlightSection
                items={authHighlights}
                openIndex={authOpenIndex}
                setOpenIndex={setAuthOpenIndex}
              />
              <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                <span>5 套 Zod Schema</span>
                <span>3 种登录方式</span>
                <span>8 个认证组件</span>
                <span>路由守卫 + 安全中间件</span>
              </div>

              {/* 后端实现 */}
              <div className="pt-4 mt-4 border-t border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-emerald-500/70 rounded-sm shrink-0" />
                  <h5 className="text-xs font-semibold text-foreground/70">
                    后端 — Koa 服务架构
                  </h5>
                </div>
                <HighlightSection
                  items={backendAuthHighlights}
                  openIndex={backendAuthOpenIndex}
                  setOpenIndex={setBackendAuthOpenIndex}
                />
                <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                  <span>5 层中间件链</span>
                  <span>JWT + Session 混合认证</span>
                  <span>GitHub OAuth 2.0</span>
                  <span>Nodemailer + EJS</span>
                </div>
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
                openIndex={imOpenIndex}
                setOpenIndex={setImOpenIndex}
              />
              <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                <span>36+ 组件</span>
                <span>11 种 Socket.io 实时事件</span>
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
                  openIndex={backendImOpenIndex}
                  setOpenIndex={setBackendImOpenIndex}
                />
                <div className="flex flex-wrap gap-5 mt-4 text-xs text-muted-foreground/50 font-mono ml-1">
                  <span>18 种 Socket.io 事件</span>
                  <span>5 个 MongoDB 集合</span>
                  <span>原子化消息操作</span>
                  <span>Ali-OSS 集成</span>
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
          <CardContent className="pt-6">
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
              openIndex={difyOpenIndex}
              setOpenIndex={setDifyOpenIndex}
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
          <CardContent className="pt-6">
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
              openIndex={agentOpenIndex}
              setOpenIndex={setAgentOpenIndex}
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
          <CardContent className="pt-6">
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
              openIndex={componentOpenIndex}
              setOpenIndex={setComponentOpenIndex}
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
