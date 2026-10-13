# Troubleshooting

## encountered uncached data during prerendering

Next 16 开了 cacheComponents（见 next.config.ts），这个新架构下数据获取默认不会被预渲染，除非显式缓存或者用 <Suspense> 包起来让它在请求时流式加载。getEmails() 读 DB、内容需要保持新鲜，不该用 "use cache" 缓存，所以正确做法是用 <Suspense>：

修复方案：app/page.tsx 拆成两层——InboxSkeleton（纯静态，直接出现）包在 <Suspense> 外面，InboxData（真正跑 getEmails() 查 DB 的 async 组件）放在 <Suspense> 里面流式渲染。没有用 "use cache"，因为邮件列表要保持实时，不该被当作可复用缓存。
