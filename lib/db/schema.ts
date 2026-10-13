import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: text("id").primaryKey(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  body: text("body").notNull(),
  labels: text("labels").array().notNull().default([]),
  read: boolean("read").notNull().default(false),
});

export const attachmentStatus = ["pending", "uploaded", "failed"] as const;

export const attachments = pgTable(
  "attachments",
  {
    id: text("id").primaryKey(),
    emailId: text("email_id")
      .notNull()
      .references(() => emails.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    storageKey: text("storage_key").notNull(), // object storage path, e.g. "attachments/<id>/<filename>"
    checksum: text("checksum"), // sha256, for dedup
    status: text("status", { enum: attachmentStatus })
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("attachments_email_id_idx").on(table.emailId)],
);

export type EmailRow = typeof emails.$inferSelect;
export type NewEmailRow = typeof emails.$inferInsert;
export type AttachmentRow = typeof attachments.$inferSelect;
export type NewAttachmentRow = typeof attachments.$inferInsert;
