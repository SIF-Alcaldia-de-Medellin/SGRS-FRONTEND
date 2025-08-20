import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoutes';

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../providers/Auth', () => ({
    useAuth: () => mockUseAuth()
}));

// Mock Navigate component
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>
    };
});

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render children when user is authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: { isAuthenticated: true }
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('should redirect to /login when user is not authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: { isAuthenticated: false }
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
        expect(screen.getByText('Redirecting to /login')).toBeInTheDocument();
    });

    it('should handle complex children components when authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: { isAuthenticated: true }
        });

        const ComplexChild = () => (
            <div>
                <h1>Complex Component</h1>
                <p>With multiple elements</p>
                <button>Action Button</button>
            </div>
        );

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <ComplexChild />
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Complex Component')).toBeInTheDocument();
        expect(screen.getByText('With multiple elements')).toBeInTheDocument();
        expect(screen.getByText('Action Button')).toBeInTheDocument();
        expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('should redirect even with complex children when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: { isAuthenticated: false }
        });

        const ComplexChild = () => (
            <div>
                <h1>Complex Component</h1>
                <p>With multiple elements</p>
                <button>Action Button</button>
            </div>
        );

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <ComplexChild />
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.queryByText('Complex Component')).not.toBeInTheDocument();
        expect(screen.queryByText('With multiple elements')).not.toBeInTheDocument();
        expect(screen.queryByText('Action Button')).not.toBeInTheDocument();
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('should handle undefined authentication status as false', () => {
        mockUseAuth.mockReturnValue({
            user: { isAuthenticated: undefined }
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('should handle null authentication status as false', () => {
        mockUseAuth.mockReturnValue({
            user: { isAuthenticated: null }
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });
});
