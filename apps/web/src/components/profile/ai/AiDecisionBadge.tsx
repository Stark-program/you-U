import type { PermissionLevel } from '@you-u/shared';

const LABEL: Record<PermissionLevel, string> = {
  L0: 'Blocked',
  L1: 'Needs approval',
  L2: 'Auto-safe',
  L3: 'Guarded',
};

export function AiDecisionBadge({ level }: { level: PermissionLevel }) {
  return (
    <span className={`profile__aiBadge profile__aiBadge--${level}`}>
      {LABEL[level]}
    </span>
  );
}
