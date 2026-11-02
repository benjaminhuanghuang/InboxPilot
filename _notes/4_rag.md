# RAG

## Embed emails

Add embedding column

```ts
embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
```

lib/ai/embedding.ts：embedOne/embedBatch，用 google.embedding("gemini-embedding-001")

```sh
npm run db:embed
```

## Query

lib/db/queries.ts

searchEmailsBySimilarity（pgvector cosineDistance 排序）

## API

app/api/search/route.ts：POST {query}
embed(RETRIEVAL_QUERY) → 相似度检索，无 API key 时降级为关键词匹配

Google Gemini Embedding API（gemini-embedding-001，通过 @ai-sdk/google 的 embed()）把搜索词转成向量

Postgres（Neon + pgvector）：用 cosineDistance 对 emails.embedding 列排序查最相似的邮件
