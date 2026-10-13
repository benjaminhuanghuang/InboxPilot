CREATE TABLE "emails" (
	"id" text PRIMARY KEY NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"subject" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"body" text NOT NULL,
	"labels" text[] DEFAULT '{}' NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
