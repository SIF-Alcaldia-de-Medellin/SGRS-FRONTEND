import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoomCard from './index';
import { Room } from '../../../types';

describe('RoomCard', () => {
    const mockRoom: Room = {
        id_sala: 1,
        intervalos: [
            { id: 1, inicio: '09:00', fin: '10:00' },
            { id: 2, inicio: '10:00', fin: '11:00' }
        ],
        rangoHoras: 2,
        estado: 1
    };

    const mockOnSelect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render room card with basic information', () => {
        render(
            <RoomCard 
                room={mockRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        expect(screen.getByText('Salon 1')).toBeInTheDocument();
        expect(screen.getByText('Disponible')).toBeInTheDocument();
        expect(screen.getByText('Intervalos Disponibles:')).toBeInTheDocument();
        expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
        expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    });

    it('should render selected state correctly', () => {
        render(
            <RoomCard 
                room={mockRoom} 
                isSelected={true} 
                onSelect={mockOnSelect} 
            />
        );

        expect(screen.getByText('Seleccionado')).toBeInTheDocument();
        
        const card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveClass('seleccionado', 'selected');
    });

    it('should render reserved state correctly', () => {
        const reservedRoom: Room = {
            ...mockRoom,
            estado: 0
        };

        render(
            <RoomCard 
                room={reservedRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        expect(screen.getByText('Reservado')).toBeInTheDocument();
        
        const card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveClass('reservado');
    });

    it('should render available state correctly', () => {
        render(
            <RoomCard 
                room={mockRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        expect(screen.getByText('Disponible')).toBeInTheDocument();
        
        const card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveClass('disponible');
    });

    it('should call onSelect when clicked and room is available', () => {
        render(
            <RoomCard 
                room={mockRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        const card = screen.getByText('Salon 1').closest('.salon-card');
        fireEvent.click(card!);

        expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('should not call onSelect when clicked and room is reserved', () => {
        const reservedRoom: Room = {
            ...mockRoom,
            estado: 0
        };

        render(
            <RoomCard 
                room={reservedRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        const card = screen.getByText('Salon 1').closest('.salon-card');
        fireEvent.click(card!);

        expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('should render rango de horas when no intervals available', () => {
        const roomWithoutIntervals: Room = {
            ...mockRoom,
            intervalos: []
        };

        render(
            <RoomCard 
                room={roomWithoutIntervals} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        expect(screen.getByText('Rango de Horas Disponibles: 2')).toBeInTheDocument();
        expect(screen.queryByText('Intervalos Disponibles:')).not.toBeInTheDocument();
    });

    it('should render "No disponible" when rangoHoras is undefined', () => {
        const roomWithoutRango: Room = {
            ...mockRoom,
            intervalos: [],
            rangoHoras: undefined
        };

        render(
            <RoomCard 
                room={roomWithoutRango} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        expect(screen.getByText('Rango de Horas Disponibles: No disponible')).toBeInTheDocument();
    });

    it('should have correct CSS classes based on state', () => {
        const { rerender } = render(
            <RoomCard 
                room={mockRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        let card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveClass('salon-card', 'disponible');

        // Test selected state
        rerender(
            <RoomCard 
                room={mockRoom} 
                isSelected={true} 
                onSelect={mockOnSelect} 
            />
        );

        card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveClass('salon-card', 'seleccionado', 'selected');

        // Test reserved state
        const reservedRoom: Room = { ...mockRoom, estado: 0 };
        rerender(
            <RoomCard 
                room={reservedRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveClass('salon-card', 'reservado');
    });

    it('should disable pointer events for reserved rooms', () => {
        const reservedRoom: Room = {
            ...mockRoom,
            estado: 0
        };

        render(
            <RoomCard 
                room={reservedRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        const card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveStyle({ pointerEvents: 'none' });
    });

    it('should enable pointer events for available rooms', () => {
        render(
            <RoomCard 
                room={mockRoom} 
                isSelected={false} 
                onSelect={mockOnSelect} 
            />
        );

        const card = screen.getByText('Salon 1').closest('.salon-card');
        expect(card).toHaveStyle({ pointerEvents: 'auto' });
    });
});
