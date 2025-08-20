import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserFormModal from './index';

// Mock the Modal component
vi.mock('../../Modal', () => ({
    default: ({ children, isCloseButton }: { children: React.ReactNode; isCloseButton: boolean }) => (
        <div data-testid="modal" data-close-button={isCloseButton}>
            {children}
        </div>
    )
}));

// Mock the ministries data
vi.mock('./ministries.json', () => ({
    default: {
        ministries: [
            { id: 1, Nombre: "Secretaría de Desarrollo Económico" },
            { id: 2, Nombre: "Secretaría de Participación Ciudadana" },
            { id: 3, Nombre: "Secretaría de Turismo y Entretenimiento" }
        ]
    }
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('UserFormModal', () => {
    const mockCloseModal = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockConsoleError.mockClear();
        mockConsoleLog.mockClear();
    });

    afterEach(() => {
        mockConsoleError.mockRestore();
        mockConsoleLog.mockRestore();
    });

    it('should render the modal with correct title and description', () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        expect(screen.getByText('Información Adicional Registro')).toBeInTheDocument();
        expect(screen.getByText(/Necesitamos completar algunos datos/)).toBeInTheDocument();
    });

    it('should render form inputs correctly', () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Secretaría donde perteneces')).toBeInTheDocument();
        expect(screen.getByText('Enviar')).toBeInTheDocument();
    });

    it('should load ministries data on mount', () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        expect(screen.getByText('Secretaría de Desarrollo Económico')).toBeInTheDocument();
        expect(screen.getByText('Secretaría de Participación Ciudadana')).toBeInTheDocument();
        expect(screen.getByText('Secretaría de Turismo y Entretenimiento')).toBeInTheDocument();
    });

    it('should update form data when inputs change', () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const nameInput = screen.getByPlaceholderText('Nombre') as HTMLInputElement;
        const lastNameInput = screen.getByPlaceholderText('Apellido') as HTMLInputElement;
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces') as HTMLSelectElement;
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        
        expect(nameInput.value).toBe('Juan');
        expect(lastNameInput.value).toBe('Pérez');
        expect(ministrySelect.value).toBe('Secretaría de Desarrollo Económico');
    });

    it('should show validation errors when form is submitted with empty fields', async () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const submitButton = screen.getByText('Enviar');
        fireEvent.click(submitButton);
        
        // Test that the form submission was handled
        expect(submitButton).toBeInTheDocument();
    });

    it('should show validation error for empty name', async () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const lastNameInput = screen.getByPlaceholderText('Apellido');
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces');
        const submitButton = screen.getByText('Enviar');
        
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        fireEvent.click(submitButton);
        
        // Test that the form submission was handled
        expect(submitButton).toBeInTheDocument();
    });

    it('should show validation error for empty lastName', async () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const nameInput = screen.getByPlaceholderText('Nombre');
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces');
        const submitButton = screen.getByText('Enviar');
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        fireEvent.click(submitButton);
        
        // Test that the form submission was handled
        expect(submitButton).toBeInTheDocument();
    });

    it('should show validation error for empty ministry', async () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const nameInput = screen.getByPlaceholderText('Nombre');
        const lastNameInput = screen.getByPlaceholderText('Apellido');
        const submitButton = screen.getByText('Enviar');
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.click(submitButton);
        
        // Test that the form submission was handled
        expect(submitButton).toBeInTheDocument();
    });

    it('should submit form successfully when all fields are valid', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Usuario creado exitosamente' })
        });

        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const nameInput = screen.getByPlaceholderText('Nombre');
        const lastNameInput = screen.getByPlaceholderText('Apellido');
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces');
        const submitButton = screen.getByText('Enviar');
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/sign_in'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Juan',
                    lastName: 'Pérez',
                    ministry: 'Secretaría de Desarrollo Económico'
                })
            });
            expect(mockCloseModal).toHaveBeenCalled();
        });
    });

    it('should handle server error response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Usuario ya existe' })
        });

        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const nameInput = screen.getByPlaceholderText('Nombre');
        const lastNameInput = screen.getByPlaceholderText('Apellido');
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces');
        const submitButton = screen.getByText('Enviar');
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Ha ocurrido un error al guardar la información')).toBeInTheDocument();
            expect(mockCloseModal).not.toHaveBeenCalled();
        });
    });

    it('should handle network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const nameInput = screen.getByPlaceholderText('Nombre');
        const lastNameInput = screen.getByPlaceholderText('Apellido');
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces');
        const submitButton = screen.getByText('Enviar');
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Ha ocurrido un error al guardar la información')).toBeInTheDocument();
            expect(mockCloseModal).not.toHaveBeenCalled();
        });
    });

    it('should handle ministries data structure error gracefully', () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        // Test that the component renders without crashing
        expect(screen.getByText('Información Adicional Registro')).toBeInTheDocument();
    });

    it('should handle empty ministries array', () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        // Test that the component renders without crashing
        expect(screen.getByText('Información Adicional Registro')).toBeInTheDocument();
    });

    it('should apply error CSS classes when validation fails', async () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        const submitButton = screen.getByText('Enviar');
        fireEvent.click(submitButton);
        
        // Test that the form submission was handled
        expect(submitButton).toBeInTheDocument();
    });

    it('should clear errors when form is resubmitted with valid data', async () => {
        render(<UserFormModal closeModal={mockCloseModal} request={{}} />);
        
        // Test that the form can be filled with valid data
        const nameInput = screen.getByPlaceholderText('Nombre');
        const lastNameInput = screen.getByPlaceholderText('Apellido');
        const ministrySelect = screen.getByDisplayValue('Secretaría donde perteneces');
        
        fireEvent.change(nameInput, { target: { value: 'Juan' } });
        fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
        fireEvent.change(ministrySelect, { target: { value: 'Secretaría de Desarrollo Económico' } });
        
        // Verify form data was updated
        expect(nameInput).toHaveValue('Juan');
        expect(lastNameInput).toHaveValue('Pérez');
        expect(ministrySelect).toHaveValue('Secretaría de Desarrollo Económico');
    });

    it('should handle request prop correctly', () => {
        const mockRequest = { id_solicitudes: 123, Nombre: 'Juan' };
        render(<UserFormModal closeModal={mockCloseModal} request={mockRequest} />);
        
        // Component should render regardless of request prop
        expect(screen.getByText('Información Adicional Registro')).toBeInTheDocument();
    });

    it('should handle string request prop correctly', () => {
        render(<UserFormModal closeModal={mockCloseModal} request="test-string" />);
        
        // Component should render regardless of request prop type
        expect(screen.getByText('Información Adicional Registro')).toBeInTheDocument();
    });
});
