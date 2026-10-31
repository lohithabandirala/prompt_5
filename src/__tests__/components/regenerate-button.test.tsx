/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import RegenerateButton from '@/components/RegenerateButton';

describe('RegenerateButton', () => {
  it('renders a named, enabled button by default', () => {
    render(<RegenerateButton onClick={jest.fn()} ariaLabel="Regenerate budget allocations" />);

    const button = screen.getByRole('button', { name: /Regenerate budget allocations/i });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Regenerate');
  });

  it('disables interaction and shows a spinner while regenerating', () => {
    render(
      <RegenerateButton onClick={jest.fn()} ariaLabel="Regenerate timeline" isRegenerating />
    );

    const button = screen.getByRole('button', { name: /Regenerate timeline/i });
    expect(button).toBeDisabled();
    expect(button.querySelector('.spinner')).not.toBeNull();
  });

  it('forwards clicks and supports section-specific labels and classes', () => {
    const onClick = jest.fn();
    render(
      <RegenerateButton
        onClick={onClick}
        ariaLabel="Regenerate celebration ideas"
        label="Fresh ideas"
        className="flex-shrink-0"
      />
    );

    const button = screen.getByRole('button', { name: /Regenerate celebration ideas/i });
    expect(button).toHaveTextContent('Fresh ideas');
    expect(button).toHaveClass('flex-shrink-0');

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
