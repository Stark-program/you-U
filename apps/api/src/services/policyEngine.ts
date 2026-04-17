import type { PatchActionKind, PatchOp, PermissionLevel, PolicyDecision } from '@you-u/shared';
import { ACTION_LEVEL } from '@you-u/shared';

import { moderateContent } from './moderationService.js';

function classifyOp(op: PatchOp): PatchActionKind {
  switch (op.op) {
    case 'setTheme':
      return 'theme.set';
    case 'setLayout':
      return 'layout.set';
    case 'addModule':
      return 'module.add';
    case 'removeModule':
      return 'module.remove';
    case 'reorderModules':
      return 'module.reorder';
    case 'updateModule': {
      const val =
        typeof op.value === 'string' ? op.value : JSON.stringify(op.value);
      if (/<script|javascript:/i.test(val)) {
        return 'raw.code';
      }
      const p = op.path.toLowerCase();
      if (p.includes('bind') || p.includes('datasource')) {
        return 'data.bind';
      }
      if (
        p.includes('body') ||
        p.includes('bio') ||
        p.includes('headline')
      ) {
        return 'text.rewrite';
      }
      if (p.includes('embed') || p.includes('iframe')) {
        return 'embed.add';
      }
      return 'module.update';
    }
    default:
      return 'unknown';
  }
}

function levelRank(level: PermissionLevel): number {
  return { L0: 0, L1: 1, L2: 2, L3: 3 }[level];
}

function maxLevel(a: PermissionLevel, b: PermissionLevel): PermissionLevel {
  return levelRank(a) >= levelRank(b) ? a : b;
}

/**
 * Decide how ops are routed: blocked, need approval, or auto-apply to draft.
 */
/**
 * Stricter policy for automatic suggestions (L1/L3 require approval).
 */
export async function evaluatePolicy(ops: PatchOp[]): Promise<PolicyDecision> {
  const blockedOps: PatchOp[] = [];
  const pendingApprovalOps: PatchOp[] = [];
  const autoOps: PatchOp[] = [];
  const reasons: string[] = [];
  let peak: PermissionLevel = 'L2';
  const categorySet = new Set<string>();

  for (const op of ops) {
    const kind = classifyOp(op);
    const required = ACTION_LEVEL[kind];

    if (required === 'L0') {
      blockedOps.push(op);
      reasons.push(`Blocked (${kind}): not allowed.`);
      peak = maxLevel(peak, 'L0');
      continue;
    }

    const textForModeration =
      op.op === 'updateModule'
        ? typeof op.value === 'string'
          ? op.value
          : JSON.stringify(op.value)
        : JSON.stringify(op);

    const mod = await moderateContent(textForModeration);
    if (!mod.passed) {
      mod.categories.forEach((c) => categorySet.add(c));
      pendingApprovalOps.push(op);
      reasons.push(`Moderation flagged content for ${kind}.`);
      peak = maxLevel(peak, 'L1');
      continue;
    }

    if (required === 'L1') {
      pendingApprovalOps.push(op);
      reasons.push(`${kind} requires user approval (L1).`);
      peak = maxLevel(peak, 'L1');
      continue;
    }

    if (required === 'L3') {
      pendingApprovalOps.push(op);
      reasons.push(`${kind} requires guarded approval (L3).`);
      peak = maxLevel(peak, 'L3');
      continue;
    }

    // L2
    autoOps.push(op);
    peak = maxLevel(peak, 'L2');
  }

  const allowed = blockedOps.length === 0;
  const categories = [...categorySet];

  return {
    allowed,
    level: peak,
    reasons,
    blockedOps,
    pendingApprovalOps,
    autoOps,
    moderated: {
      passed: categories.length === 0,
      categories,
    },
  };
}

/**
 * After explicit user confirmation: only block L0 and failed moderation.
 */
export async function evaluatePolicyConfirmed(
  ops: PatchOp[],
): Promise<PolicyDecision> {
  const blockedOps: PatchOp[] = [];
  const pendingApprovalOps: PatchOp[] = [];
  const autoOps: PatchOp[] = [];
  const reasons: string[] = [];
  let peak: PermissionLevel = 'L2';
  const categorySet = new Set<string>();

  for (const op of ops) {
    const kind = classifyOp(op);
    const required = ACTION_LEVEL[kind];

    if (required === 'L0') {
      blockedOps.push(op);
      reasons.push(`Blocked (${kind}): not allowed.`);
      peak = maxLevel(peak, 'L0');
      continue;
    }

    const textForModeration =
      op.op === 'updateModule'
        ? typeof op.value === 'string'
          ? op.value
          : JSON.stringify(op.value)
        : JSON.stringify(op);

    const mod = await moderateContent(textForModeration);
    if (!mod.passed) {
      mod.categories.forEach((c) => categorySet.add(c));
      blockedOps.push(op);
      reasons.push(`Moderation blocked ${kind}.`);
      peak = maxLevel(peak, 'L1');
      continue;
    }

    autoOps.push(op);
    peak = maxLevel(peak, required === 'L3' ? 'L3' : required === 'L1' ? 'L1' : 'L2');
  }

  const allowed = blockedOps.length === 0;
  const categories = [...categorySet];

  return {
    allowed,
    level: peak,
    reasons,
    blockedOps,
    pendingApprovalOps,
    autoOps,
    moderated: {
      passed: categories.length === 0,
      categories,
    },
  };
}
