CREATE TABLE `profile_ai_changes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`base_version` integer,
	`actor` text NOT NULL,
	`prompt` text NOT NULL,
	`ops_json` text NOT NULL,
	`decision_json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile_drafts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`config_json` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`version` integer NOT NULL,
	`config_json` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profile_snapshots_user_version` ON `profile_snapshots` (`user_id`,`version`);