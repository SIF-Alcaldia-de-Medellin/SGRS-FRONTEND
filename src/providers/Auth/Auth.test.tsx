import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from './index';
import { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

// Wrapper component for testing hooks
const AuthWrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        localStorageMock.removeItem.mockClear();
    });

    describe('Initial state', () => {
        it('should initialize with unauthenticated user when no token in localStorage', () => {
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return null;
                if (key === 'role') return null;
                if (key === 'isFirstTime') return null;
                return null;
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            expect(result.current.user).toEqual({
                isAuthenticated: false,
                token: null,
                role: null,
                isFirstTime: false, // 'true' !== 'true' when localStorage returns null
            });
        });

        it('should initialize with authenticated user when token exists in localStorage', () => {
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return 'mock-token';
                if (key === 'role') return 'admin';
                if (key === 'isFirstTime') return 'true';
                return null;
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            expect(result.current.user).toEqual({
                isAuthenticated: true,
                token: 'mock-token',
                role: 'admin',
                isFirstTime: true,
            });
        });

        it('should handle isFirstTime as false when localStorage value is not "true"', () => {
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return 'mock-token';
                if (key === 'role') return 'user';
                if (key === 'isFirstTime') return 'false';
                return null;
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            expect(result.current.user.isFirstTime).toBe(false);
        });
    });

    describe('login function', () => {
        it('should authenticate user and store credentials in localStorage', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            act(() => {
                result.current.login('new-token', 'user', true);
            });

            expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-token');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('role', 'user');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('isFirstTime', 'true');

            expect(result.current.user).toEqual({
                isAuthenticated: true,
                token: 'new-token',
                role: 'user',
                isFirstTime: true,
            });
        });

        it('should handle login with isFirstTime as false', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            act(() => {
                result.current.login('token123', 'admin', false);
            });

            expect(localStorageMock.setItem).toHaveBeenCalledWith('isFirstTime', 'false');

            expect(result.current.user).toEqual({
                isAuthenticated: true,
                token: 'token123',
                role: 'admin',
                isFirstTime: false,
            });
        });
    });

    describe('logout function', () => {
        it('should clear user state and remove credentials from localStorage', () => {
            // Start with authenticated user
            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return 'existing-token';
                if (key === 'role') return 'admin';
                if (key === 'isFirstTime') return 'true';
                return null;
            });

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            // Verify initial authenticated state
            expect(result.current.user.isAuthenticated).toBe(true);

            act(() => {
                result.current.logout();
            });

            expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('role');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('isFirstTime');

            expect(result.current.user).toEqual({
                isAuthenticated: false,
                token: null,
                role: null,
                isFirstTime: null,
            });
        });
    });

    describe('AuthProvider component', () => {
        it('should render children properly', () => {
            localStorageMock.getItem.mockReturnValue(null);

            render(
                <AuthProvider>
                    <div data-testid="test-child">Test Child</div>
                </AuthProvider>
            );

            expect(screen.getByTestId('test-child')).toBeInTheDocument();
            expect(screen.getByText('Test Child')).toBeInTheDocument();
        });

        it('should provide auth context to children', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const TestComponent = () => {
                const { user } = useAuth();
                return (
                    <div data-testid="auth-status">
                        {user.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </div>
                );
            };

            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );

            expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
        });
    });

    describe('useAuth hook', () => {
        it('should throw error when used outside AuthProvider', () => {
            // Suppress console.error for this test since we expect an error
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                renderHook(() => useAuth());
            }).toThrow('useAuth must be used within an AuthProvider');

            consoleSpy.mockRestore();
        });

        it('should return auth context when used within AuthProvider', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            expect(result.current).toHaveProperty('user');
            expect(result.current).toHaveProperty('login');
            expect(result.current).toHaveProperty('logout');
            expect(typeof result.current.login).toBe('function');
            expect(typeof result.current.logout).toBe('function');
        });
    });

    describe('Complex scenarios', () => {
        it('should handle multiple login/logout cycles', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), { wrapper: AuthWrapper });

            // First login
            act(() => {
                result.current.login('token1', 'user', true);
            });

            expect(result.current.user.isAuthenticated).toBe(true);
            expect(result.current.user.token).toBe('token1');

            // Logout
            act(() => {
                result.current.logout();
            });

            expect(result.current.user.isAuthenticated).toBe(false);
            expect(result.current.user.token).toBe(null);

            // Second login with different credentials
            act(() => {
                result.current.login('token2', 'admin', false);
            });

            expect(result.current.user.isAuthenticated).toBe(true);
            expect(result.current.user.token).toBe('token2');
            expect(result.current.user.role).toBe('admin');
            expect(result.current.user.isFirstTime).toBe(false);
        });
    });
});
