import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRooms } from './useRooms';
import { Request, Room } from '../types';

// Mock the utility functions
vi.mock('../utils/fetchRoomsAvailable');
vi.mock('../utils/fetchSchedulesAvailable');

const mockFetchRoomsAvailable = vi.mocked(await import('../utils/fetchRoomsAvailable')).fetchRoomsAvailable;
const mockFetchSchedulesAvailable = vi.mocked(await import('../utils/fetchSchedulesAvailable')).fetchSchedulesAvailable;

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('useRooms', () => {
    const mockRequest: Request = {
        id_solicitudes: 123,
        Num_asistentes: 10,
        Computador: false,
        HDMI: false
    };

    const mockRooms: Room[] = [
        {
            id_sala: 1,
            intervalos: [
                { id: 1, inicio: '09:00', fin: '10:00' },
                { id: 2, inicio: '10:00', fin: '11:00' }
            ],
            rangoHoras: 1,
            estado: 1
        },
        {
            id_sala: 2,
            intervalos: [],
            rangoHoras: 1,
            estado: 1
        }
    ];

    const mockSchedules = [
        {
            id_sala: 1,
            intervalos: [
                { id: 1, inicio: '09:00', fin: '10:00' }
            ],
            rangoHoras: 1,
            estado: 1
        },
        {
            id_sala: 2,
            intervalos: [],
            rangoHoras: 1,
            estado: 1
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockConsoleError.mockClear();
    });

    afterEach(() => {
        mockConsoleError.mockRestore();
    });

    it('should load rooms and schedules on mount', async () => {
        mockFetchRoomsAvailable.mockResolvedValueOnce(mockRooms);
        mockFetchSchedulesAvailable.mockResolvedValueOnce(mockSchedules);

        const { result } = renderHook(() => useRooms(mockRequest));

        // Initially loading should be true
        expect(result.current[2]).toBe(true); // loading
        expect(result.current[0]).toEqual([]); // roomsAvailable
        expect(result.current[1]).toEqual([]); // rangesAvailable

        // Wait for the async operations to complete
        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual(mockRooms);
        expect(result.current[1]).toEqual(mockSchedules);
        expect(mockFetchRoomsAvailable).toHaveBeenCalledWith(mockRequest);
        expect(mockFetchSchedulesAvailable).toHaveBeenCalledWith(mockRequest);
    });

    it('should set room estado to 0 when no intervals available', async () => {
        const roomsWithNoIntervals = [
            {
                id_sala: 1,
                intervalos: [],
                rangoHoras: 1,
                estado: 1
            }
        ];

        mockFetchRoomsAvailable.mockResolvedValueOnce(mockRooms);
        mockFetchSchedulesAvailable.mockResolvedValueOnce(roomsWithNoIntervals);

        const { result } = renderHook(() => useRooms(mockRequest));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        // The room with no intervals should have estado = 0
        expect(result.current[1][0].estado).toBe(0);
    });

    it('should handle fetchRoomsAvailable error gracefully', async () => {
        const error = new Error('Failed to fetch rooms');
        mockFetchRoomsAvailable.mockRejectedValueOnce(error);
        // When fetchRoomsAvailable fails, the entire operation fails
        // so fetchSchedulesAvailable is never called

        const { result } = renderHook(() => useRooms(mockRequest));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual([]);
        expect(result.current[1]).toEqual([]);
        // Note: console.error is called but may not be captured in tests
    });

    it('should handle fetchSchedulesAvailable error gracefully', async () => {
        const error = new Error('Failed to fetch schedules');
        mockFetchRoomsAvailable.mockResolvedValueOnce(mockRooms);
        mockFetchSchedulesAvailable.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useRooms(mockRequest));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual(mockRooms);
        expect(result.current[1]).toEqual([]);
        // Note: console.error is called but may not be captured in tests
    });

    it('should handle both errors gracefully', async () => {
        const roomsError = new Error('Failed to fetch rooms');
        const schedulesError = new Error('Failed to fetch schedules');
        
        mockFetchRoomsAvailable.mockRejectedValueOnce(roomsError);
        mockFetchSchedulesAvailable.mockRejectedValueOnce(schedulesError);

        const { result } = renderHook(() => useRooms(mockRequest));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual([]);
        expect(result.current[1]).toEqual([]);
        // Note: console.error is called but may not be captured in tests
    });

    it('should re-run effect when request changes', async () => {
        const newRequest: Request = {
            ...mockRequest,
            id_solicitudes: 456
        };

        mockFetchRoomsAvailable
            .mockResolvedValueOnce(mockRooms)
            .mockResolvedValueOnce([...mockRooms, { id_sala: 3, intervalos: [], rangoHoras: 1, estado: 1 }]);
        
        mockFetchSchedulesAvailable
            .mockResolvedValueOnce(mockSchedules)
            .mockResolvedValueOnce([...mockSchedules, { id_sala: 3, intervalos: [], rangoHoras: 1, estado: 1 }]);

        const { result, rerender } = renderHook((request) => useRooms(request), {
            initialProps: mockRequest
        });

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual(mockRooms);

        // Change the request
        rerender(newRequest);

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toHaveLength(3); // Should have 3 rooms now
        expect(mockFetchRoomsAvailable).toHaveBeenCalledTimes(2);
        expect(mockFetchSchedulesAvailable).toHaveBeenCalledTimes(2);
    });
});
