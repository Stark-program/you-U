import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

/** Application users (password auth to be wired later). */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

/** Working draft profile config (JSON) per user. */
export const profileDrafts = sqliteTable('profile_drafts', {
  userId: text('user_id').primaryKey(),
  configJson: text('config_json').notNull(),
  version: integer('version').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

/** Published snapshots for rollback. */
export const profileSnapshots = sqliteTable(
  'profile_snapshots',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    version: integer('version').notNull(),
    configJson: text('config_json').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex('profile_snapshots_user_version').on(t.userId, t.version)],
);

/** Audit log for AI patch runs. */
export const profileAiChanges = sqliteTable('profile_ai_changes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  baseVersion: integer('base_version'),
  actor: text('actor').notNull(),
  prompt: text('prompt').notNull(),
  opsJson: text('ops_json').notNull(),
  decisionJson: text('decision_json').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});
