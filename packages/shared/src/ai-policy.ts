import type { ModuleConfig } from './profile-config.js';

/** L0 blocked, L1 user approval, L2 auto-safe draft, L3 guarded auto. */
export type PermissionLevel = 'L0' | 'L1' | 'L2' | 'L3';

export type PatchActionKind =
  | 'theme.set'
  | 'layout.set'
  | 'module.add'
  | 'module.remove'
  | 'module.update'
  | 'module.reorder'
  | 'text.rewrite'
  | 'embed.add'
  | 'data.bind'
  | 'publish.request'
  | 'raw.code'
  | 'unknown';

export type PatchOp =
  | { op: 'setTheme'; path: string; value: unknown }
  | { op: 'setLayout'; path: string; value: unknown }
  | { op: 'addModule'; module: ModuleConfig; index?: number }
  | { op: 'removeModule'; moduleId: string }
  | { op: 'updateModule'; moduleId: string; path: string; value: unknown }
  | { op: 'reorderModules'; moduleOrder: string[] };

export interface PolicyDecision {
  allowed: boolean;
  /** Highest severity level encountered for applied ops. */
  level: PermissionLevel;
  reasons: string[];
  blockedOps: PatchOp[];
  /** Ops that need explicit user approval before apply. */
  pendingApprovalOps: PatchOp[];
  /** Ops that can be auto-applied to draft (L2/L3 after checks). */
  autoOps: PatchOp[];
  moderated: {
    passed: boolean;
    categories: string[];
  };
}

/** Required minimum level to auto-apply without user approval (L1 always needs UI approval). */
export const ACTION_LEVEL: Record<PatchActionKind, PermissionLevel> = {
  'theme.set': 'L2',
  'layout.set': 'L2',
  'module.add': 'L2',
  'module.remove': 'L2',
  'module.update': 'L2',
  'module.reorder': 'L2',
  'text.rewrite': 'L1',
  'embed.add': 'L1',
  'data.bind': 'L3',
  'publish.request': 'L1',
  'raw.code': 'L0',
  unknown: 'L1',
};
