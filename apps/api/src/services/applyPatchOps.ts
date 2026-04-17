import type { ModuleConfig, PatchOp, ProfileConfig } from '@you-u/shared';

function setDeep(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const parts = path.split('.').filter(Boolean);
  if (parts.length === 0) {
    return;
  }
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    if (next === undefined || typeof next !== 'object' || next === null) {
      cur[key] = {};
    }
    cur = cur[key] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

/** Apply patch operations to a profile config clone. */
export function applyPatchOps(
  base: ProfileConfig,
  ops: PatchOp[],
): ProfileConfig {
  const config: ProfileConfig = structuredClone(base);

  for (const op of ops) {
    switch (op.op) {
      case 'setTheme':
        setDeep(config as unknown as Record<string, unknown>, op.path, op.value);
        break;
      case 'setLayout':
        setDeep(config as unknown as Record<string, unknown>, op.path, op.value);
        break;
      case 'addModule': {
        const mod = op.module as ModuleConfig;
        const idx =
          op.index === undefined ? config.modules.length : op.index;
        const next = [...config.modules];
        next.splice(idx, 0, mod);
        config.modules = next;
        const order = [...config.layout.moduleOrder];
        order.splice(idx, 0, mod.id);
        config.layout.moduleOrder = order;
        break;
      }
      case 'removeModule': {
        config.modules = config.modules.filter((m) => m.id !== op.moduleId);
        config.layout.moduleOrder = config.layout.moduleOrder.filter(
          (id) => id !== op.moduleId,
        );
        break;
      }
      case 'reorderModules': {
        const order = op.moduleOrder;
        const map = new Map(config.modules.map((m) => [m.id, m]));
        config.modules = order
          .map((id) => map.get(id))
          .filter(Boolean) as ModuleConfig[];
        config.layout.moduleOrder = [...order];
        break;
      }
      case 'updateModule': {
        const m = config.modules.find((x) => x.id === op.moduleId);
        if (!m) {
          break;
        }
        setDeep(m.data as Record<string, unknown>, op.path, op.value);
        break;
      }
      default:
        break;
    }
  }

  if (ops.length > 0) {
    config.version += 1;
  }
  return config;
}
