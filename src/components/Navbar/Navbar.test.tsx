import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import { beforeEach, describe, expect, it } from 'vitest';
import Navbar from '.';
import { AuthProvider } from '../../providers/Auth';

describe('Navbar', () => {
    beforeEach(()=>{
        const routes = [{
            name: 'Solicitudes',
            path: '/',
            isActive: true
        },{
            name: 'Salones',
            path: '/salones',
            isActive: false
        }]
        render(
            <AuthProvider>
            <MemoryRouter>
                <Navbar routes={routes} />
            </MemoryRouter>
            </AuthProvider>
        );
    });

    it('Renderiza el logo de la alcaldía', () => {
        const logo = screen.getByAltText("Logo Alcaldía de Medellín");
        expect(logo).toBeInTheDocument();
    }); 

    it('Renderiza las rutas solicitudes y salones', ()=>{
        const logo = screen.getByAltText("Logo Alcaldía de Medellín");
        const navbar = logo.closest('.navbar');

        expect(navbar).not.toBeNull();

        const navLinks = navbar?.querySelectorAll('.menu-option');
        expect(navLinks?.length).toBe(2);
        expect(navLinks?.[0]).toHaveTextContent('Solicitudes');
        expect(navLinks?.[1]).toHaveTextContent('Salones');
    });
});
