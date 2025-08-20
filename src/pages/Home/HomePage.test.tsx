import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './index';

// Mock the Navbar component
vi.mock('../../components/Navbar', () => ({
    default: ({ routes }: { routes: Array<{name: string, path: string, isActive: boolean}> }) => (
        <nav data-testid="navbar">
            {routes.map((route, index) => (
                <div key={index} data-testid={`route-${index}`}>
                    {route.name} - {route.path} - {route.isActive ? 'active' : 'inactive'}
                </div>
            ))}
        </nav>
    )
}));

// Mock react-router-dom Outlet
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Outlet: () => <div data-testid="outlet">Outlet Content</div>
    };
});

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../providers/Auth', () => ({
    useAuth: () => mockUseAuth()
}));

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the main content structure', () => {
        mockUseAuth.mockReturnValue({
            user: { role: 'user' }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const content = document.querySelector('.content');
        expect(content).toBeInTheDocument();
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('should render admin routes when user is admin', () => {
        mockUseAuth.mockReturnValue({
            user: { role: 'admin' }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Solicitudes - / - active');
    });

    it('should render default routes when user is not admin', () => {
        mockUseAuth.mockReturnValue({
            user: { role: 'user' }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Mis Solicitudes - / - active');
    });

    it('should render default routes when user role is undefined', () => {
        mockUseAuth.mockReturnValue({
            user: { role: undefined }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Mis Solicitudes - / - active');
    });

    it('should render default routes when user role is null', () => {
        mockUseAuth.mockReturnValue({
            user: { role: null }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Mis Solicitudes - / - active');
    });

    it('should render default routes when user is empty object', () => {
        mockUseAuth.mockReturnValue({
            user: {}
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Mis Solicitudes - / - active');
    });

    it('should have correct route structure for admin', () => {
        mockUseAuth.mockReturnValue({
            user: { role: 'admin' }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        // Check that admin routes have correct properties
        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Solicitudes');
        expect(route).toHaveTextContent('/');
        expect(route).toHaveTextContent('active');
    });

    it('should have correct route structure for default user', () => {
        mockUseAuth.mockReturnValue({
            user: { role: 'user' }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        // Check that default routes have correct properties
        const route = screen.getByTestId('route-0');
        expect(route).toHaveTextContent('Mis Solicitudes');
        expect(route).toHaveTextContent('/');
        expect(route).toHaveTextContent('active');
    });

    it('should render Outlet component for nested routes', () => {
        mockUseAuth.mockReturnValue({
            user: { role: 'user' }
        });

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        const outlet = screen.getByTestId('outlet');
        expect(outlet).toBeInTheDocument();
        expect(outlet).toHaveTextContent('Outlet Content');
    });
});
