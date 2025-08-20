import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '.';
import { AuthProvider } from '../../providers/Auth';

// Mock del hook useAuth
vi.mock('../../providers/Auth', async () => {
    const actual = await vi.importActual('../../providers/Auth');
    return {
        ...actual,
        useAuth: () => ({
            user: { role: 'admin' },
            logout: vi.fn(),
            login: vi.fn(),
            isAuthenticated: true
        })
    };
});

describe('Navbar', () => {
    const routes = [{
        name: 'Solicitudes',
        path: '/',
        isActive: true
    },{
        name: 'Salones',
        path: '/salones',
        isActive: false
    }];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Renderiza el logo de la alcaldía', () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Navbar routes={routes} />
                </AuthProvider>
            </MemoryRouter>
        );

        const logo = screen.getByAltText("Logo Alcaldía de Medellín");
        expect(logo).toBeInTheDocument();
    }); 

    it('Renderiza las rutas solicitudes y salones', () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Navbar routes={routes} />
                </AuthProvider>
            </MemoryRouter>
        );

        const logo = screen.getByAltText("Logo Alcaldía de Medellín");
        const navbar = logo.closest('.navbar');

        expect(navbar).not.toBeNull();

        const navLinks = navbar?.querySelectorAll('.menu-option');
        expect(navLinks?.length).toBe(2);
        expect(navLinks?.[0]).toHaveTextContent('Solicitudes');
        expect(navLinks?.[1]).toHaveTextContent('Salones');
    });
});
