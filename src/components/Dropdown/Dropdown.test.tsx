import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dropdown from './index';

describe('Dropdown', () => {
    const mockOptions = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
    ];

    const mockOnChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render dropdown with options', () => {
        render(
            <Dropdown 
                options={mockOptions} 
                onChange={mockOnChange} 
            />
        );

        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();

        // Check if all options are rendered
        mockOptions.forEach(option => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
        });
    });

    it('should call onChange when option is selected', () => {
        render(
            <Dropdown 
                options={mockOptions} 
                onChange={mockOnChange} 
            />
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: '2' })
            })
        );
    });

    it('should render with default className when none provided', () => {
        const { container } = render(
            <Dropdown 
                options={mockOptions} 
                onChange={mockOnChange} 
            />
        );

        const dropdownDiv = container.querySelector('.dropdown');
        expect(dropdownDiv).toHaveClass('dropdown', 'primary');
    });

    it('should render with custom className when provided', () => {
        const { container } = render(
            <Dropdown 
                options={mockOptions} 
                onChange={mockOnChange} 
                className="custom-class"
            />
        );

        const dropdownDiv = container.querySelector('.dropdown');
        expect(dropdownDiv).toHaveClass('dropdown', 'custom-class');
    });

    it('should handle empty options array', () => {
        render(
            <Dropdown 
                options={[]} 
                onChange={mockOnChange} 
            />
        );

        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        
        // Should have no options
        const options = select.querySelectorAll('option');
        expect(options).toHaveLength(0);
    });

    it('should handle options with different value types', () => {
        const mixedOptions = [
            { label: 'String Option', value: 'string' },
            { label: 'Number Option', value: 42 },
            { label: 'Empty Option', value: '' }
        ];

        render(
            <Dropdown 
                options={mixedOptions} 
                onChange={mockOnChange} 
            />
        );

        // Check if all options are rendered
        mixedOptions.forEach(option => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '42' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should have correct HTML structure', () => {
        const { container } = render(
            <Dropdown 
                options={mockOptions} 
                onChange={mockOnChange} 
            />
        );

        const dropdownDiv = container.querySelector('.dropdown');
        const select = dropdownDiv?.querySelector('select');
        const options = select?.querySelectorAll('option');

        expect(dropdownDiv).toBeInTheDocument();
        expect(select).toBeInTheDocument();
        expect(options).toHaveLength(mockOptions.length);
    });
});
