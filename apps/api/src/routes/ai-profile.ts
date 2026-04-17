import type { FastifyInstance } from 'fastify';
import type { PatchOp } from '@you-u/shared';
import { z } from 'zod';

import { mockGeneratePatch } from '../services/aiGeneratePatch.js';
import { evaluatePolicy, evaluatePolicyConfirmed } from '../services/policyEngine.js';
import {
  applyOpsToDraft,
  getPublishedConfig,
  listAiChanges,
  listSnapshots,
  loadDraft,
  logAiChange,
  publishDraft,
  rollbackToVersion,
} from '../services/profileConfigService.js';

const patchBodySchema = z.object({
  prompt: z.string().min(1),
  baseVersion: z.number().int().optional(),
  mode: z.enum(['suggest', 'autoSafe']),
});

const applyBodySchema = z.object({
  ops: z.array(z.custom<PatchOp>()),
  confirmApproval: z.boolean().optional(),
});

export async function registerAiProfileRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.post<{
    Params: { profileId: string };
  }>('/profile/:profileId/ai/patch', async (request, reply) => {
    const { profileId } = request.params;
    const parsed = patchBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const { prompt, mode } = parsed.data;
    const proposedOps = mockGeneratePatch(prompt);
    const decision = await evaluatePolicy(proposedOps);

    const requiresUserApproval =
      decision.pendingApprovalOps.length > 0 || !decision.allowed;

    let summary = `Evaluated ${proposedOps.length} proposed operations.`;
    if (!decision.allowed) {
      summary = 'Some operations were blocked by policy.';
    } else if (requiresUserApproval) {
      summary =
        'Some operations require approval before they can be applied to your draft.';
    } else if (mode === 'autoSafe' && decision.autoOps.length > 0) {
      summary = 'Safe changes can be applied to your draft automatically.';
    }

    await logAiChange({
      userId: profileId,
      baseVersion: parsed.data.baseVersion ?? null,
      actor: 'ai',
      prompt,
      ops: proposedOps,
      decision,
    });

    return reply.send({
      summary,
      patchOps: proposedOps,
      decision,
      warnings: decision.reasons,
      requiresUserApproval,
      suggestedAutoOps: decision.autoOps,
      suggestedPendingOps: decision.pendingApprovalOps,
    });
  });

  app.post<{
    Params: { profileId: string };
  }>('/profile/:profileId/ai/apply', async (request, reply) => {
    const { profileId } = request.params;
    const parsed = applyBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const { ops, confirmApproval } = parsed.data;
    const decision = confirmApproval
      ? await evaluatePolicyConfirmed(ops)
      : await evaluatePolicy(ops);

    if (!decision.allowed || decision.blockedOps.length > 0) {
      return reply.status(422).send({
        error: 'Ops blocked or failed moderation',
        decision,
      });
    }

    if (!confirmApproval && decision.pendingApprovalOps.length > 0) {
      return reply.status(422).send({
        error: 'Ops require user approval',
        decision,
      });
    }

    const config = await applyOpsToDraft(profileId, ops);
    return reply.send({ ok: true, config });
  });

  app.post<{
    Params: { profileId: string };
  }>('/profile/:profileId/publish', async (request, reply) => {
    const { profileId } = request.params;
    const config = await publishDraft(profileId);
    return reply.send({ ok: true, config });
  });

  app.post<{
    Params: { profileId: string; version: string };
  }>('/profile/:profileId/rollback/:version', async (request, reply) => {
    const { profileId, version } = request.params;
    const v = Number(version);
    if (!Number.isFinite(v)) {
      return reply.status(400).send({ error: 'Invalid version' });
    }
    try {
      const config = await rollbackToVersion(profileId, v);
      return reply.send({ ok: true, config });
    } catch (e) {
      return reply
        .status(404)
        .send({ error: e instanceof Error ? e.message : 'Not found' });
    }
  });

  app.get<{
    Params: { profileId: string };
    Querystring: { status?: 'draft' | 'published' };
  }>('/profile/:profileId/config', async (request, reply) => {
    const { profileId } = request.params;
    const status = request.query.status ?? 'draft';

    if (status === 'published') {
      const pub = await getPublishedConfig(profileId);
      if (!pub) {
        return reply.status(404).send({ error: 'No published config yet' });
      }
      return reply.send({ config: pub });
    }

    const config = await loadDraft(profileId);
    return reply.send({ config });
  });

  app.get<{
    Params: { profileId: string };
  }>('/profile/:profileId/changes', async (request, reply) => {
    const { profileId } = request.params;
    const rows = await listAiChanges(profileId);
    return reply.send({
      changes: rows.map((r) => ({
        id: r.id,
        baseVersion: r.baseVersion,
        actor: r.actor,
        prompt: r.prompt,
        ops: JSON.parse(r.opsJson) as PatchOp[],
        decision: JSON.parse(r.decisionJson) as unknown,
        createdAt: r.createdAt,
      })),
    });
  });

  app.get<{
    Params: { profileId: string };
  }>('/profile/:profileId/snapshots', async (request, reply) => {
    const { profileId } = request.params;
    const rows = await listSnapshots(profileId);
    return reply.send({ snapshots: rows });
  });
}
