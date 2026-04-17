import { randomUUID } from 'node:crypto';

import { and, desc, eq } from 'drizzle-orm';

import type { PatchOp, ProfileConfig } from '@you-u/shared';
import { defaultProfileConfig } from '@you-u/shared';

import { getDb } from '../db/index.js';
import {
  profileAiChanges,
  profileDrafts,
  profileSnapshots,
} from '../db/schema.js';

import { applyPatchOps } from './applyPatchOps.js';

function mergeMissingModules(
  config: ProfileConfig,
  defaults: ProfileConfig,
): ProfileConfig {
  const have = new Set(config.modules.map((m) => m.id));
  const extra = defaults.modules.filter((m) => !have.has(m.id));
  if (extra.length === 0) {
    return config;
  }
  const moduleOrder = [...config.layout.moduleOrder];
  for (const id of defaults.layout.moduleOrder) {
    if (!moduleOrder.includes(id)) {
      moduleOrder.push(id);
    }
  }
  return {
    ...config,
    modules: [...config.modules, ...extra],
    layout: { ...config.layout, moduleOrder },
  };
}

export async function loadDraft(userId: string): Promise<ProfileConfig> {
  const db = getDb();
  const row = await db
    .select()
    .from(profileDrafts)
    .where(eq(profileDrafts.userId, userId))
    .limit(1);

  if (row.length === 0) {
    const fresh = defaultProfileConfig(userId, userId);
    await saveDraft(userId, fresh);
    return fresh;
  }

  const parsed = JSON.parse(row[0].configJson) as ProfileConfig;
  const defaults = defaultProfileConfig(
    parsed.profileId ?? userId,
    parsed.userId ?? userId,
  );
  return mergeMissingModules(parsed, defaults);
}

export async function saveDraft(userId: string, config: ProfileConfig): Promise<void> {
  const db = getDb();
  const json = JSON.stringify(config);
  await db
    .insert(profileDrafts)
    .values({
      userId,
      configJson: json,
      version: config.version,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: profileDrafts.userId,
      set: {
        configJson: json,
        version: config.version,
        updatedAt: new Date(),
      },
    });
}

export async function applyOpsToDraft(
  userId: string,
  ops: PatchOp[],
): Promise<ProfileConfig> {
  const current = await loadDraft(userId);
  const next = applyPatchOps(current, ops);
  await saveDraft(userId, next);
  return next;
}

export async function publishDraft(userId: string): Promise<ProfileConfig> {
  const draft = await loadDraft(userId);
  const db = getDb();
  const id = randomUUID();
  await db.insert(profileSnapshots).values({
    id,
    userId,
    version: draft.version,
    configJson: JSON.stringify(draft),
    createdAt: new Date(),
  });
  return draft;
}

export async function rollbackToVersion(
  userId: string,
  version: number,
): Promise<ProfileConfig> {
  const db = getDb();
  const match = await db
    .select()
    .from(profileSnapshots)
    .where(
      and(
        eq(profileSnapshots.userId, userId),
        eq(profileSnapshots.version, version),
      ),
    )
    .limit(1);

  const snap = match[0];
  if (!snap) {
    throw new Error(`No snapshot for version ${version}`);
  }

  const config = JSON.parse(snap.configJson) as ProfileConfig;
  await saveDraft(userId, config);
  return config;
}

export async function listSnapshots(userId: string) {
  const db = getDb();
  return db
    .select()
    .from(profileSnapshots)
    .where(eq(profileSnapshots.userId, userId))
    .orderBy(desc(profileSnapshots.version));
}


export async function getPublishedConfig(
  userId: string,
): Promise<ProfileConfig | null> {
  const rows = await listSnapshots(userId);
  if (rows.length === 0) {
    return null;
  }
  const latest = rows[0];
  return JSON.parse(latest.configJson) as ProfileConfig;
}

export async function logAiChange(input: {
  userId: string;
  baseVersion: number | null;
  actor: 'user' | 'ai';
  prompt: string;
  ops: PatchOp[];
  decision: unknown;
}): Promise<void> {
  const db = getDb();
  await db.insert(profileAiChanges).values({
    id: randomUUID(),
    userId: input.userId,
    baseVersion: input.baseVersion,
    actor: input.actor,
    prompt: input.prompt,
    opsJson: JSON.stringify(input.ops),
    decisionJson: JSON.stringify(input.decision),
    createdAt: new Date(),
  });
}

export async function listAiChanges(userId: string, limit = 20) {
  const db = getDb();
  return db
    .select()
    .from(profileAiChanges)
    .where(eq(profileAiChanges.userId, userId))
    .orderBy(desc(profileAiChanges.createdAt))
    .limit(limit);
}

