'use client';

import { useCallback, type KeyboardEvent } from 'react';
import type { RegenerateSection } from '@/lib/schemas/event-plan';
import { PLAN_TABS, type PlanTab } from '@/lib/plan/sections';

interface PlanTabsProps {
  activeTab: PlanTab;
  regenerating: RegenerateSection | null;
  onSelect: (tab: PlanTab) => void;
}

/**
 * Accessible tab list for the plan workspace. Arrow keys, Home and End move
 * focus between tabs; the selected panel is controlled by the parent.
 */
export default function PlanTabs({ activeTab, regenerating, onSelect }: PlanTabsProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % PLAN_TABS.length;
      else if (event.key === 'ArrowLeft')
        nextIndex = (index - 1 + PLAN_TABS.length) % PLAN_TABS.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = PLAN_TABS.length - 1;

      if (nextIndex === null) return;
      event.preventDefault();
      const nextTab = PLAN_TABS[nextIndex];
      onSelect(nextTab.id);
      document.getElementById(`tab-${nextTab.id}`)?.focus();
    },
    [onSelect]
  );

  return (
    <div
      className="no-print flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1"
      role="tablist"
      aria-label="Event plan sections"
    >
      {PLAN_TABS.map((tab, index) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          type="button"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onSelect(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span aria-hidden="true">{tab.emoji}</span>
          {tab.label}
          {regenerating === tab.id && <span className="spinner h-3 w-3" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}
