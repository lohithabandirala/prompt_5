/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import PlanTabs from '@/components/PlanTabs';
import { PLAN_TABS } from '@/lib/plan/sections';

describe('PlanTabs', () => {
  it('renders every section and marks the active tab', () => {
    render(<PlanTabs activeTab="budget" regenerating={null} onSelect={jest.fn()} />);

    expect(screen.getByRole('tablist', { name: /Event plan sections/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Budget/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: /Overview/i })).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(screen.getAllByRole('tab')).toHaveLength(PLAN_TABS.length);
  });

  it('moves selection with the arrow, Home and End keys', () => {
    const onSelect = jest.fn();
    render(<PlanTabs activeTab="overview" regenerating={null} onSelect={onSelect} />);

    const overview = screen.getByRole('tab', { name: /Overview/i });
    overview.focus();

    fireEvent.keyDown(overview, { key: 'ArrowRight' });
    expect(onSelect).toHaveBeenCalledWith('budget');

    fireEvent.keyDown(overview, { key: 'End' });
    expect(onSelect).toHaveBeenCalledWith('schedule');

    fireEvent.keyDown(overview, { key: 'Home' });
    expect(onSelect).toHaveBeenCalledWith('overview');
  });

  it('shows the regeneration spinner on the matching tab only', () => {
    const { container } = render(
      <PlanTabs activeTab="budget" regenerating="budget" onSelect={jest.fn()} />
    );

    expect(container.querySelector('#tab-budget .spinner')).not.toBeNull();
    expect(container.querySelector('#tab-overview .spinner')).toBeNull();
  });
});
