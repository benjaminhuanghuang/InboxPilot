import { tool } from "ai";
import { z } from "zod";
import { getAttachments, searchEmailHistory } from "@/lib/db/queries";

/** Lets the model look up prior emails from the same sender for context. */
export function createSearchEmailHistoryTool(excludeId?: string) {
  return tool({
    description:
      "Search past emails from the same sender to find prior context, " +
      "commitments, or details relevant to the current email. Returns up " +
      "to 5 matching emails (subject, date, and a short body snippet), " +
      "most recent first.",
    inputSchema: z.object({
      from: z
        .string()
        .describe("The sender's email address or display name to search for"),
      query: z
        .string()
        .optional()
        .describe("Optional keyword to narrow results by subject or body"),
    }),
    execute: async ({ from, query }) => {
      const results = await searchEmailHistory({
        from,
        query,
        excludeId,
        limit: 5,
      });
      return results.map((e) => ({
        subject: e.subject,
        date: e.date,
        snippet: e.body.slice(0, 300),
      }));
    },
  });
}

/** Lets the model check what attachments (if any) are on the current email. */
export function createGetAttachmentsTool(emailId?: string) {
  return tool({
    description:
      "List the attachments on the email being drafted a reply to " +
      "(filename, content type, size, upload status). Use this when the " +
      "email references an attachment (e.g. \"see attached\") and you need " +
      "to know what it is before replying. Does not return file contents.",
    inputSchema: z.object({}),
    execute: async () => {
      if (!emailId) return [];
      return getAttachments(emailId);
    },
  });
}
