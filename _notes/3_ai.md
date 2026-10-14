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
