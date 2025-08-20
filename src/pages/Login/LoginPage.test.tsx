import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './index';

// Mock the LoginForm component since we're only testing the LoginPage structure
vi.mock('../../components/Login/Form', () => ({
    default: () => <div data-testid="login-form">Mocked LoginForm</div>
}));

// Mock image imports
vi.mock('../../assets/alcaldia.svg', () => ({
    default: 'mocked-alcaldia-image'
}));

vi.mock('../../assets/loginImg.svg', () => ({
    default: 'mocked-login-image'
}));

describe('LoginPage', () => {
    it('should render the main login page structure', () => {
        render(<LoginPage />);
        
        const loginPage = document.querySelector('.login-page');
        expect(loginPage).toBeInTheDocument();
    });

    it('should render the navbar section with alcaldia logo and text', () => {
        render(<LoginPage />);
        
        const navbar = document.querySelector('.navbar-login-page');
        expect(navbar).toBeInTheDocument();
        
        const alcaldiaImg = screen.getByAltText('Logo Alcaldía');
        expect(alcaldiaImg).toBeInTheDocument();
        expect(alcaldiaImg).toHaveClass('alcaldiaImg');
        expect(alcaldiaImg).toHaveAttribute('src', 'mocked-alcaldia-image');
        
        expect(screen.getByText('Alcaldia de Medellin')).toBeInTheDocument();
    });

    it('should render the login container with image and form', () => {
        render(<LoginPage />);
        
        const loginContainer = document.querySelector('.login-container');
        expect(loginContainer).toBeInTheDocument();
        
        const imgContainer = document.querySelector('.img-container');
        expect(imgContainer).toBeInTheDocument();
        
        const loginImg = document.querySelector('.loginImg');
        expect(loginImg).toBeInTheDocument();
        expect(loginImg).toHaveAttribute('src', 'mocked-login-image');
        expect(loginImg).toHaveAttribute('alt', '');
    });

    it('should render the LoginForm component', () => {
        render(<LoginPage />);
        
        const loginForm = screen.getByTestId('login-form');
        expect(loginForm).toBeInTheDocument();
        expect(loginForm).toHaveTextContent('Mocked LoginForm');
    });

    it('should have correct CSS classes structure', () => {
        const { container } = render(<LoginPage />);
        
        expect(container.querySelector('.login-page')).toBeInTheDocument();
        expect(container.querySelector('.navbar-login-page')).toBeInTheDocument();
        expect(container.querySelector('.circle-img')).toBeInTheDocument();
        expect(container.querySelector('.login-container')).toBeInTheDocument();
        expect(container.querySelector('.img-container')).toBeInTheDocument();
    });

    it('should render images with correct classes', () => {
        render(<LoginPage />);
        
        const alcaldiaImg = screen.getByAltText('Logo Alcaldía');
        const loginImg = document.querySelector('.loginImg');
        
        expect(alcaldiaImg).toHaveClass('alcaldiaImg');
        expect(loginImg).toHaveClass('loginImg');
    });
});
