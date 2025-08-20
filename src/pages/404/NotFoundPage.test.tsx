import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFoundPage from './index';

describe('NotFoundPage', () => {
    it('should render 404 heading', () => {
        render(<NotFoundPage />);
        
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('404');
    });

    it('should render with correct structure', () => {
        const { container } = render(<NotFoundPage />);
        
        const wrapper = container.querySelector('div');
        expect(wrapper).toBeInTheDocument();
        
        const heading = wrapper?.querySelector('h1');
        expect(heading).toBeInTheDocument();
        expect(heading?.textContent).toBe('404');
    });

    it('should have accessible heading', () => {
        render(<NotFoundPage />);
        
        expect(screen.getByText('404')).toBeInTheDocument();
    });
});
