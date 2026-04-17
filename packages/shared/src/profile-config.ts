import { APP_NAME } from './brand.js';

export type UUID = string;

export type ModuleType =
  | 'hero'
  | 'about'
  | 'links'
  | 'gallery'
  | 'timeline'
  | 'highlights'
  | 'faq'
  | 'activity'
  | 'stats';

/** Optional per-widget colors (stats pills, buttons, cards, header text). */
export interface ThemeComponentColors {
  bg?: string;
  /** Full CSS border value, e.g. `1px solid #6366f144`. */
  border?: string;
  text?: string;
  /** Small caps / secondary line (e.g. stat labels). */
  label?: string;
}

export interface ThemeComponents {
  /** All three stat pills when not overridden per-column. */
  stats?: ThemeComponentColors;
  statPosts?: ThemeComponentColors;
  statFollowers?: ThemeComponentColors;
  statFollowing?: ThemeComponentColors;
  buttonPrimary?: ThemeComponentColors;
  buttonGhost?: ThemeComponentColors;
  card?: ThemeComponentColors;
  title?: ThemeComponentColors;
  handle?: ThemeComponentColors;
  lede?: ThemeComponentColors;
}

export interface ThemeTokens {
  color: {
    bg: string;
    surface: string;
    textPrimary: string;
    textMuted: string;
    brand: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: 'compact' | 'default' | 'expressive';
  };
  spacing: {
    density: 'compact' | 'default' | 'airy';
    sectionGap: number;
    cardRadius: number;
  };
  /** Scoped styling; page-level colors stay in `theme.color`. */
  components?: ThemeComponents;
}

export interface LayoutConfig {
  template: 'singleColumn' | 'splitHero' | 'magazine';
  moduleOrder: string[];
}

export interface ModuleConfig {
  id: string;
  type: ModuleType;
  enabled: boolean;
  data: Record<string, unknown>;
}

/** Module `data` shapes (validated loosely at runtime). */
export interface HeroModuleData {
  eyebrow: string;
  displayName: string;
  /** e.g. `@admin` */
  handle: string;
  lede: string;
  primaryCta: string;
  secondaryCta: string;
  /** Single character shown in avatar */
  avatarInitial: string;
}

export interface AboutModuleData {
  title: string;
  /** Main paragraph; legacy drafts may use `body` instead. */
  content: string;
}

export interface StatsItem {
  label: string;
  value: string;
}

export interface StatsModuleData {
  items: StatsItem[];
}

export interface HighlightsModuleData {
  title: string;
  items: string[];
}

export interface ActivityEntry {
  label: string;
  text: string;
  time: string;
}

export interface ActivityModuleData {
  title: string;
  items: ActivityEntry[];
}

export interface ProfileConfig {
  profileId: UUID;
  userId: UUID;
  version: number;
  theme: ThemeTokens;
  layout: LayoutConfig;
  modules: ModuleConfig[];
}

export function defaultProfileConfig(profileId: string, userId: string): ProfileConfig {
  return {
    profileId,
    userId,
    version: 1,
    theme: {
      color: {
        bg: '#0b1220',
        surface: '#111827',
        textPrimary: '#f8fafc',
        textMuted: '#94a3b8',
        brand: '#a5b4fc',
        accent: '#f472b6',
      },
      typography: {
        headingFont: 'System',
        bodyFont: 'System',
        scale: 'default',
      },
      spacing: {
        density: 'default',
        sectionGap: 24,
        cardRadius: 12,
      },
    },
    layout: {
      template: 'singleColumn',
      moduleOrder: [
        'mod-hero',
        'mod-about',
        'mod-stats',
        'mod-highlights',
        'mod-activity',
      ],
    },
    modules: [
      {
        id: 'mod-hero',
        type: 'hero',
        enabled: true,
        data: {
          eyebrow: APP_NAME,
          displayName: 'admin',
          handle: '@admin',
          lede:
            'Building a calmer corner of the internet. Sharing progress, creative sparks, and a little bit of chaos.',
          primaryCta: 'Edit profile',
          secondaryCta: 'Share profile',
          avatarInitial: 'A',
        } satisfies HeroModuleData,
      },
      {
        id: 'mod-about',
        type: 'about',
        enabled: true,
        data: {
          title: 'About',
          content:
            'Product-minded builder focused on intentional UX and community-centered experiences.',
        } satisfies AboutModuleData,
      },
      {
        id: 'mod-stats',
        type: 'stats',
        enabled: true,
        data: {
          items: [
            { label: 'Posts', value: '12' },
            { label: 'Followers', value: '428' },
            { label: 'Following', value: '189' },
          ],
        } satisfies StatsModuleData,
      },
      {
        id: 'mod-highlights',
        type: 'highlights',
        enabled: true,
        data: {
          title: 'Highlights',
          items: [
            'Launching profile customization v2',
            'Shipping smoother onboarding flow',
            'Exploring creator-first feature ideas',
          ],
        } satisfies HighlightsModuleData,
      },
      {
        id: 'mod-activity',
        type: 'activity',
        enabled: true,
        data: {
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
        } satisfies ActivityModuleData,
      },
    ],
  };
}
