import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RequestCard from './index';
import { Request } from '../../../types';

// Mock FontAwesome components
vi.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }: { icon: { iconName?: string } }) => (
        <span data-testid="fontawesome-icon">
            {icon.iconName || 'icon'}
        </span>
    )
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
    faEnvelope: { iconName: 'envelope' }
}));

describe('RequestCard', () => {
    const mockRequest: Request = {
        id_solicitudes: 123,
        Nombre: 'Juan Pérez',
        Apellido: 'Pérez',
        Correo: 'juan@example.com',
        Telefono: '123456789',
        Secretaria: 'Secretaría General',
        Num_asistentes: 15,
        Fecha_reserva: '2024-01-15',
        Hora_inicio: '09:00',
        Hora_final: '10:00',
        Estado: 1,
        Proposito: 'Reunión de trabajo',
        Computador: true,
        HDMI: false
    };

    const mockOnClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render request card with all information', () => {
        render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        expect(screen.getByText('Solicitud #123')).toBeInTheDocument();
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        expect(screen.getByText('juan@example.com')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
        expect(screen.getByText('09:00')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    it('should render envelope icon', () => {
        render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        const icon = screen.getByTestId('fontawesome-icon');
        expect(icon).toBeInTheDocument();
    });

    it('should call onClick when card is clicked', () => {
        render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        const card = screen.getByText('Solicitud #123').closest('.request-card');
        fireEvent.click(card!);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should map state correctly for different states', () => {
        const { rerender } = render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        // Estado 1 = 'reservada'
        expect(screen.getByText('Reservada')).toBeInTheDocument();

        // Estado 0 = 'rechazada'
        const rejectedRequest = { ...mockRequest, Estado: 0 };
        rerender(
            <RequestCard 
                request={rejectedRequest} 
                onClick={mockOnClick} 
            />
        );
        expect(screen.getByText('Rechazada')).toBeInTheDocument();

        // Estado 2 = 'en_proceso'
        const inProcessRequest = { ...mockRequest, Estado: 2 };
        rerender(
            <RequestCard 
                request={inProcessRequest} 
                onClick={mockOnClick} 
            />
        );
        expect(screen.getByText('En Proceso')).toBeInTheDocument();
    });

    it('should handle unknown state gracefully', () => {
        const unknownStateRequest = { ...mockRequest, Estado: 999 };
        
        render(
            <RequestCard 
                request={unknownStateRequest} 
                onClick={mockOnClick} 
            />
        );

        expect(screen.getByText('Desconocido')).toBeInTheDocument();
    });

    it('should handle undefined state gracefully', () => {
        const undefinedStateRequest = { ...mockRequest, Estado: undefined };
        
        render(
            <RequestCard 
                request={undefinedStateRequest} 
                onClick={mockOnClick} 
            />
        );

        expect(screen.getByText('Rechazada')).toBeInTheDocument(); // Defaults to 0
    });

    it('should format state text correctly', () => {
        const inProcessRequest = { ...mockRequest, Estado: 2 };
        
        render(
            <RequestCard 
                request={inProcessRequest} 
                onClick={mockOnClick} 
            />
        );

        // 'en_proceso' should become 'En Proceso'
        expect(screen.getByText('En Proceso')).toBeInTheDocument();
    });

    it('should have correct CSS classes based on state', () => {
        const { rerender } = render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        let card = screen.getByText('Solicitud #123').closest('.request-card');
        expect(card).toHaveClass('request-card', 'reservada');

        // Test different states
        const rejectedRequest = { ...mockRequest, Estado: 0 };
        rerender(
            <RequestCard 
                request={rejectedRequest} 
                onClick={mockOnClick} 
            />
        );

        card = screen.getByText('Solicitud #123').closest('.request-card');
        expect(card).toHaveClass('request-card', 'rechazada');

        const inProcessRequest = { ...mockRequest, Estado: 2 };
        rerender(
            <RequestCard 
                request={inProcessRequest} 
                onClick={mockOnClick} 
            />
        );

        card = screen.getByText('Solicitud #123').closest('.request-card');
        expect(card).toHaveClass('request-card', 'en_proceso');
    });

    it('should render state span with correct classes', () => {
        render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        const stateSpan = screen.getByText('Reservada');
        expect(stateSpan).toHaveClass('estado', 'reservada');
    });

    it('should handle missing optional fields gracefully', () => {
        const minimalRequest: Request = {
            id_solicitudes: 456,
            Computador: false,
            HDMI: false
        };

        render(
            <RequestCard 
                request={minimalRequest} 
                onClick={mockOnClick} 
            />
        );

        expect(screen.getByText('Solicitud #456')).toBeInTheDocument();
        expect(screen.getByText('Rechazada')).toBeInTheDocument(); // Default state
        
        // Check that the labels are present but values are empty
        expect(screen.getByText('Nombre:')).toBeInTheDocument();
        expect(screen.getByText('Correo:')).toBeInTheDocument();
        expect(screen.getByText('Personas a asistir:')).toBeInTheDocument();
        expect(screen.getByText('Fecha de la reunión:')).toBeInTheDocument();
    });

    it('should have correct HTML structure', () => {
        const { container } = render(
            <RequestCard 
                request={mockRequest} 
                onClick={mockOnClick} 
            />
        );

        const card = container.querySelector('.request-card');
        const header = card?.querySelector('.card-header');
        const title = header?.querySelector('.card-title');
        const estado = header?.querySelector('.estado');
        const line = card?.querySelector('.line');
        const footer = card?.querySelector('.card-footer');

        expect(card).toBeInTheDocument();
        expect(header).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(estado).toBeInTheDocument();
        expect(line).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });
});
