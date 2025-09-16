CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL
);
