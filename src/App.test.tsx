import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the dependencies
vi.mock('./providers/Auth', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="auth-provider">{children}</div>
    )
}));

vi.mock('./router/AppRouter', () => ({
    default: () => <div data-testid="app-router">App Router Content</div>
}));

describe('App', () => {
    it('should render without crashing', () => {
        render(<App />);
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    it('should render AuthProvider wrapper', () => {
        render(<App />);
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    it('should render AppRouter inside AuthProvider', () => {
        render(<App />);
        const authProvider = screen.getByTestId('auth-provider');
        expect(authProvider).toContainElement(screen.getByTestId('app-router'));
    });

    it('should render AppRouter content', () => {
        render(<App />);
        expect(screen.getByText('App Router Content')).toBeInTheDocument();
    });

    it('should have correct component structure', () => {
        const { container } = render(<App />);
        
        // Check that the component renders without throwing
        expect(() => render(<App />)).not.toThrow();
        
        // Check that the component has the expected structure
        expect(container.firstChild).toBeInTheDocument();
    });
});
