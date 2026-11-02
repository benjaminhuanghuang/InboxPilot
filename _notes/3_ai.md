# AI

Add Gemini API Key

```json
@ai-sdk/google
```

## Code

app/api/summarize/route.ts

## TextDecoder.decode()

服务端发送前：string → TextEncoder.encode() → bytes，塞进 stream
客户端接收后：bytes → TextDecoder.decode() → string，还原成文本

.json()/.text() 适合"等全部数据到齐再处理"，手动 getReader()+TextDecoder 适合"数据一边到一边处理"（streaming UI 这种场景）。

## Summarize

app/api/summarize/route.ts

subject + body -> prompt -> LLM

```ts
prompt: `Subject: ${payload.subject ?? ""}\nFrom: ${payload.from ?? ""}\n\n${payload.body}`,
```

## Draft: prompt + tool calling

app/api/draft/route.ts

- createSearchEmailHistoryTool: 让模型在写回复前先看同一发件人过去的邮件，给草稿加上历史上下文，而不是只看这一封邮件的 subject/from/body 当上下文。
- createGetAttachmentsTool: 给模型一个"按需查附件元数据"的能力，而不是把所有附件信息都硬塞进 prompt
