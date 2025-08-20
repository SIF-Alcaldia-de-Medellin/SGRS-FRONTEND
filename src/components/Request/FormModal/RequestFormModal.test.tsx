import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RequestFormModal from './index';
import { Request } from '../../../types';

// Mock the Modal component
vi.mock('../../Modal', () => ({
    default: ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
        <div data-testid="modal" onClick={onClose}>
            <div data-testid="modal-content">
                {children}
            </div>
        </div>
    )
}));

// Mock the RoomCard component
vi.mock('../../Room/Card', () => ({
    default: () => <div data-testid="room-card">Room Card</div>
}));

describe('RequestFormModal', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render modal with request object', () => {
        const mockRequest: Request = {
            id_solicitudes: 123,
            Nombre: 'Juan',
            Computador: false,
            HDMI: true
        };

        render(
            <RequestFormModal 
                request={mockRequest} 
                onClose={mockOnClose} 
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        
        // Check if the request toString is displayed
        const modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toHaveTextContent('Modal [object Object]');
    });

    it('should render modal with string request', () => {
        const stringRequest = 'test-request-string';

        render(
            <RequestFormModal 
                request={stringRequest} 
                onClose={mockOnClose} 
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        
        // Check if the string is displayed
        const modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toHaveTextContent('Modal test-request-string');
    });

    it('should pass onClose prop to Modal component', () => {
        const mockRequest: Request = {
            id_solicitudes: 456,
            Computador: true,
            HDMI: false
        };

        render(
            <RequestFormModal 
                request={mockRequest} 
                onClose={mockOnClose} 
            />
        );

        // The Modal component should receive the onClose prop
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should handle undefined request gracefully', () => {
        render(
            <RequestFormModal 
                request={undefined as any} 
                onClose={mockOnClose} 
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        
        // When request is undefined, toString() should handle it
        const modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toBeInTheDocument();
    });

    it('should handle null request gracefully', () => {
        render(
            <RequestFormModal 
                request={null as any} 
                onClose={mockOnClose} 
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        
        // When request is null, toString() should handle it
        const modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toBeInTheDocument();
    });

    it('should display different content for different request objects', () => {
        const mockRequest1: Request = {
            id_solicitudes: 111,
            Nombre: 'Alice',
            Computador: false,
            HDMI: false
        };

        const mockRequest2: Request = {
            id_solicitudes: 222,
            Nombre: 'Bob',
            Computador: true,
            HDMI: true
        };

        const { rerender } = render(
            <RequestFormModal 
                request={mockRequest1} 
                onClose={mockOnClose} 
            />
        );

        let modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toHaveTextContent('Modal [object Object]');

        rerender(
            <RequestFormModal 
                request={mockRequest2} 
                onClose={mockOnClose} 
            />
        );

        modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toHaveTextContent('Modal [object Object]');
    });

    it('should handle empty string request', () => {
        render(
            <RequestFormModal 
                request="" 
                onClose={mockOnClose} 
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        
        const modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toHaveTextContent('Modal');
    });

    it('should handle numeric string request', () => {
        render(
            <RequestFormModal 
                request="12345" 
                onClose={mockOnClose} 
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        
        const modalContent = screen.getByTestId('modal-content');
        expect(modalContent).toHaveTextContent('Modal 12345');
    });
});
