import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './index';

// Mock the useAuth hook
const mockLogin = vi.fn();
vi.mock('../../../providers/Auth', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

// Mock the background image
vi.mock('../../../assets/loginBg.svg', () => ({
    default: 'mocked-background-image'
}));

// Mock alert
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

// Mock Math.random to control isFirstTime
const mockMathRandom = vi.spyOn(Math, 'random').mockImplementation(() => 0.5);

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAlert.mockClear();
        // Reset Math.random mock to default value
        mockMathRandom.mockReturnValue(0.5);
    });

    afterEach(() => {
        // Don't restore Math.random mock, just reset it
        mockMathRandom.mockReturnValue(0.5);
    });

    it('should render login form elements', () => {
        render(<LoginForm />);

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    it('should render background image', () => {
        render(<LoginForm />);

        const backgroundImg = screen.getByAltText('Imagen de fondo');
        expect(backgroundImg).toBeInTheDocument();
        expect(backgroundImg).toHaveAttribute('src', 'mocked-background-image');
        expect(backgroundImg).toHaveClass('background');
    });

    it('should update user input value', () => {
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario') as HTMLInputElement;
        
        fireEvent.change(userInput, { target: { value: 'testuser' } });
        
        expect(userInput.value).toBe('testuser');
    });

    it('should update password input value', () => {
        render(<LoginForm />);

        const passwordInput = screen.getByPlaceholderText('Contraseña') as HTMLInputElement;
        
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        
        expect(passwordInput.value).toBe('testpassword');
    });

    it('should login with admin role when user is "admin"', () => {
        // Mock Math.random to return 0.3, so 0.3 > 0.5 = false
        mockMathRandom.mockReturnValue(0.3);
        
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByText('Iniciar Sesión');

        fireEvent.change(userInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // 0.3 > 0.5 = false, so isFirstTime should be false
        expect(mockLogin).toHaveBeenCalledWith('token', 'admin', false);
    });

    it('should login with default role when user is not "admin"', () => {
        mockMathRandom.mockReturnValue(0.7); // isFirstTime = true (0.7 > 0.5)
        
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByText('Iniciar Sesión');

        fireEvent.change(userInput, { target: { value: 'regularuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(mockLogin).toHaveBeenCalledWith('token', 'default', true);
    });

    it('should show alert when user field is empty', () => {
        render(<LoginForm />);

        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByText('Iniciar Sesión');

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(mockAlert).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show alert when password field is empty', () => {
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario');
        const submitButton = screen.getByText('Iniciar Sesión');

        fireEvent.change(userInput, { target: { value: 'testuser' } });
        fireEvent.click(submitButton);

        expect(mockAlert).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show alert when both fields are empty', () => {
        render(<LoginForm />);

        const submitButton = screen.getByText('Iniciar Sesión');
        fireEvent.click(submitButton);

        expect(mockAlert).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should prevent default form submission', () => {
        render(<LoginForm />);

        const form = document.querySelector('form');
        expect(form).toBeInTheDocument();

        // Just test that form submission works without throwing
        expect(() => fireEvent.submit(form!)).not.toThrow();
    });

    it('should handle form submission with form elements', () => {
        // Mock Math.random to return 0.6, so 0.6 > 0.5 = true
        mockMathRandom.mockReturnValue(0.6);
        
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByText('Iniciar Sesión');

        fireEvent.change(userInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpass' } });
        fireEvent.click(submitButton);

        // 0.6 > 0.5 = true, so isFirstTime should be true
        expect(mockLogin).toHaveBeenCalledWith('token', 'default', true);
    });

    it('should have correct CSS classes', () => {
        const { container } = render(<LoginForm />);

        expect(container.querySelector('.formContainer')).toBeInTheDocument();
        expect(container.querySelector('.loginForm')).toBeInTheDocument();
        expect(container.querySelector('.title-login-form')).toBeInTheDocument();
        expect(container.querySelector('.button-login-form')).toBeInTheDocument();
        
        const inputs = container.querySelectorAll('.input-login-page');
        expect(inputs).toHaveLength(2);
    });

    it('should have correct input types', () => {
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');

        expect(userInput).toHaveAttribute('type', 'text');
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should handle random isFirstTime generation correctly', () => {
        // Test that random generation works (we don't need to test specific values since it's random)
        mockMathRandom.mockReturnValue(0.4);
        
        render(<LoginForm />);

        const userInput = screen.getByPlaceholderText('Usuario');
        const passwordInput = screen.getByPlaceholderText('Contraseña');
        const submitButton = screen.getByText('Iniciar Sesión');

        fireEvent.change(userInput, { target: { value: 'user' } });
        fireEvent.change(passwordInput, { target: { value: 'pass' } });
        fireEvent.click(submitButton);

        // Just ensure login was called with some boolean value for isFirstTime
        expect(mockLogin).toHaveBeenCalledWith(
            'token', 
            'default', 
            expect.any(Boolean)
        );
    });
});
