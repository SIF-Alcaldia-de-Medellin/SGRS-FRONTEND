import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './index';

// Mock FontAwesome components
vi.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon, className }: { icon: { iconName?: string }; className: string }) => (
        <span data-testid="fontawesome-icon" className={className}>
            {icon.iconName || 'icon'}
        </span>
    )
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
    faX: { iconName: 'x' }
}));

describe('Modal', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render modal with children', () => {
        render(
            <Modal onClose={mockOnClose}>
                <div data-testid="modal-content">Modal Content</div>
            </Modal>
        );

        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should render close button by default', () => {
        render(
            <Modal onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );

        const closeButton = screen.getByTestId('fontawesome-icon');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('icon-close-button');
    });

    it('should not render close button when isCloseButton is false', () => {
        render(
            <Modal onClose={mockOnClose} isCloseButton={false}>
                <div>Content</div>
            </Modal>
        );

        const closeButton = screen.queryByTestId('fontawesome-icon');
        expect(closeButton).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(
            <Modal onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );

        const closeButton = screen.getByTestId('fontawesome-icon').closest('.close-button');
        expect(closeButton).toBeInTheDocument();

        fireEvent.click(closeButton!);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when modal background is clicked', () => {
        render(
            <Modal onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );

        const modalBackground = screen.getByText('Content').closest('.modal');
        expect(modalBackground).toBeInTheDocument();

        fireEvent.click(modalBackground!);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
        render(
            <Modal onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );

        const modalContent = screen.getByText('Content').closest('.modal-content');
        expect(modalContent).toBeInTheDocument();

        fireEvent.click(modalContent!);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should use default onClose function when none provided', () => {
        render(
            <Modal>
                <div>Content</div>
            </Modal>
        );

        // Should not throw error when no onClose is provided
        const modalBackground = screen.getByText('Content').closest('.modal');
        expect(() => fireEvent.click(modalBackground!)).not.toThrow();
    });

    it('should have correct CSS classes', () => {
        const { container } = render(
            <Modal onClose={mockOnClose}>
                <div>Content</div>
            </Modal>
        );

        const modal = container.querySelector('.modal');
        const modalContent = container.querySelector('.modal-content');
        const closeButton = container.querySelector('.close-button');

        expect(modal).toBeInTheDocument();
        expect(modalContent).toBeInTheDocument();
        expect(closeButton).toBeInTheDocument();
    });
});
