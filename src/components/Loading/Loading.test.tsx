import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from './index';

describe('Loading', () => {
    it('should render loading spinner and text', () => {
        render(<Loading />);
        
        // Check if loading text is present
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
        
        // Check if loading container is present
        const loadingContainer = screen.getByText('Cargando...').closest('.loading-container');
        expect(loadingContainer).toBeInTheDocument();
        
        // Check if spinner elements are present
        const spinner = loadingContainer?.querySelector('.lds-ring');
        expect(spinner).toBeInTheDocument();
        
        // Check if all 4 spinner divs are present
        const spinnerDivs = spinner?.querySelectorAll('div');
        expect(spinnerDivs).toHaveLength(4);
    });

    it('should have correct CSS classes', () => {
        const { container } = render(<Loading />);
        
        const loadingContainer = container.querySelector('.loading-container');
        expect(loadingContainer).toBeInTheDocument();
        
        const spinner = container.querySelector('.lds-ring');
        expect(spinner).toBeInTheDocument();
    });
});
