import type { RegenerateSection } from '../schemas/event-plan';

export type PlanTab = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'schedule';

/** Ordered plan tabs shown in the workspace. */
export const PLAN_TABS: ReadonlyArray<{ id: PlanTab; label: string; emoji: string }> = [
  { id: 'overview', label: 'Overview', emoji: '📋' },
  { id: 'budget', label: 'Budget', emoji: '💰' },
  { id: 'timeline', label: 'Timeline', emoji: '📅' },
  { id: 'vendors', label: 'Vendors', emoji: '🤝' },
  { id: 'ideas', label: 'Ideas', emoji: '💡' },
  { id: 'schedule', label: 'Run sheet', emoji: '🗓️' },
];

/** Human-readable names used in notices and the regeneration overlay. */
export const SECTION_LABEL: Record<RegenerateSection, string> = {
  theme: 'Theme',
  budget: 'Budget',
  timeline: 'Timeline',
  vendors: 'Vendor checklist',
  ideas: 'Ideas',
  schedule: 'Run sheet',
};
