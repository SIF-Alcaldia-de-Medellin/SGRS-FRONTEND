import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRequest } from './useRequests';

// Mock the API_URL constant
vi.mock('../config/consts', () => ({
    API_URL: 'http://test-api.com'
}));

// Mock fetch globally
const mockFetch = vi.fn();
Object.defineProperty(window, 'fetch', {
    value: mockFetch,
    writable: true
});

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('useRequest', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockConsoleError.mockClear();
    });

    it('should initialize with correct default values', () => {
        const { result } = renderHook(() => useRequest());

        expect(result.current.loading).toBe(true);
        expect(result.current.requests).toEqual([]);
    });

    it('should clean up interval on unmount', () => {
        const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
        
        const { unmount } = renderHook(() => useRequest());
        
        unmount();
        
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should call fetch with correct URL on mount', () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ data: [] })
        });

        renderHook(() => useRequest());

        expect(mockFetch).toHaveBeenCalledWith('http://test-api.com/solicitudes/all');
    });
});