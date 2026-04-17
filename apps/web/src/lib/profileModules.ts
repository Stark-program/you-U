import {
  APP_NAME,
  type AboutModuleData,
  type ActivityModuleData,
  type HeroModuleData,
  type HighlightsModuleData,
  type ModuleConfig,
  type ProfileConfig,
  type StatsModuleData,
} from '@you-u/shared';

const FALLBACK_HERO: HeroModuleData = {
  eyebrow: APP_NAME,
  displayName: 'admin',
  handle: '@admin',
  lede:
    'Building a calmer corner of the internet. Sharing progress, creative sparks, and a little bit of chaos.',
  primaryCta: 'Edit profile',
  secondaryCta: 'Share profile',
  avatarInitial: 'A',
};

const FALLBACK_ABOUT: AboutModuleData = {
  title: 'About',
  content:
    'Product-minded builder focused on intentional UX and community-centered experiences.',
};

const FALLBACK_STATS: StatsModuleData = {
  items: [
    { label: 'Posts', value: '12' },
    { label: 'Followers', value: '428' },
    { label: 'Following', value: '189' },
  ],
};

const FALLBACK_HIGHLIGHTS: HighlightsModuleData = {
  title: 'Highlights',
  items: [
    'Launching profile customization v2',
    'Shipping smoother onboarding flow',
    'Exploring creator-first feature ideas',
  ],
};

const FALLBACK_ACTIVITY: ActivityModuleData = {
  title: 'Recent activity',
  items: [
    {
      label: 'Posted',
      text: 'Shared a design update for the new landing page.',
      time: '2h ago',
    },
    {
      label: 'Updated',
      text: 'Tuned profile theme and typography presets.',
      time: 'Yesterday',
    },
  ],
};

function getModule(modules: ModuleConfig[], type: string): ModuleConfig | undefined {
  return modules.find((m) => m.enabled && m.type === type);
}

export function getHeroData(config: ProfileConfig | null): HeroModuleData {
  if (!config) {
    return FALLBACK_HERO;
  }
  const m = getModule(config.modules, 'hero');
  if (!m?.data || typeof m.data !== 'object') {
    return FALLBACK_HERO;
  }
  return { ...FALLBACK_HERO, ...(m.data as Partial<HeroModuleData>) };
}

export function getAboutData(config: ProfileConfig | null): AboutModuleData {
  if (!config) {
    return FALLBACK_ABOUT;
  }
  const m = getModule(config.modules, 'about');
  if (!m?.data || typeof m.data !== 'object') {
    return FALLBACK_ABOUT;
  }
  const d = m.data as Partial<AboutModuleData> & { body?: unknown };
  const legacy =
    typeof d.body === 'string' ? d.body : undefined;
  const content =
    typeof d.content === 'string'
      ? d.content
      : legacy ?? FALLBACK_ABOUT.content;
  return {
    title: typeof d.title === 'string' ? d.title : FALLBACK_ABOUT.title,
    content,
  };
}

export function getStatsData(config: ProfileConfig | null): StatsModuleData {
  if (!config) {
    return FALLBACK_STATS;
  }
  const m = getModule(config.modules, 'stats');
  if (!m?.data || typeof m.data !== 'object') {
    return FALLBACK_STATS;
  }
  const raw = (m.data as { items?: unknown }).items;
  if (!Array.isArray(raw) || raw.length === 0) {
    return FALLBACK_STATS;
  }
  const items = raw.map((row, i) => {
    const f = FALLBACK_STATS.items[i] ?? FALLBACK_STATS.items[0];
    if (row && typeof row === 'object') {
      const o = row as { label?: unknown; value?: unknown };
      return {
        label: typeof o.label === 'string' ? o.label : f.label,
        value: typeof o.value === 'string' ? o.value : f.value,
      };
    }
    return f;
  });
  return { items };
}

export function getHighlightsData(config: ProfileConfig | null): HighlightsModuleData {
  if (!config) {
    return FALLBACK_HIGHLIGHTS;
  }
  const m = getModule(config.modules, 'highlights');
  if (!m?.data || typeof m.data !== 'object') {
    return FALLBACK_HIGHLIGHTS;
  }
  const d = m.data as Partial<HighlightsModuleData>;
  const items = Array.isArray(d.items)
    ? d.items.filter((x): x is string => typeof x === 'string')
    : FALLBACK_HIGHLIGHTS.items;
  return {
    title: typeof d.title === 'string' ? d.title : FALLBACK_HIGHLIGHTS.title,
    items: items.length > 0 ? items : FALLBACK_HIGHLIGHTS.items,
  };
}

export function getActivityData(config: ProfileConfig | null): ActivityModuleData {
  if (!config) {
    return FALLBACK_ACTIVITY;
  }
  const m = getModule(config.modules, 'activity');
  if (!m?.data || typeof m.data !== 'object') {
    return FALLBACK_ACTIVITY;
  }
  const d = m.data as Partial<ActivityModuleData>;
  const raw = d.items;
  if (!Array.isArray(raw) || raw.length === 0) {
    return FALLBACK_ACTIVITY;
  }
  const items = raw.map((row, i) => {
    const f = FALLBACK_ACTIVITY.items[i] ?? FALLBACK_ACTIVITY.items[0];
    if (row && typeof row === 'object') {
      const o = row as { label?: unknown; text?: unknown; time?: unknown };
      return {
        label: typeof o.label === 'string' ? o.label : f.label,
        text: typeof o.text === 'string' ? o.text : f.text,
        time: typeof o.time === 'string' ? o.time : f.time,
      };
    }
    return f;
  });
  return {
    title: typeof d.title === 'string' ? d.title : FALLBACK_ACTIVITY.title,
    items,
  };
}

/** Map stats row order to `data-stat` attribute values. */
export const STAT_KEYS = ['posts', 'followers', 'following'] as const;
