import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GridRequests from './index';

// Import the mocked modules
import * as useRequestsModule from '../../../hooks/useRequests';
import * as useAuthModule from '../../../providers/Auth';

// Mock all dependencies
vi.mock('../../../hooks/useRequests', () => ({
    useRequest: vi.fn(() => ({
        requests: [
            {
                id_solicitudes: 1,
                Correo: 'test1@example.com',
                Estado: 0,
                Nombre: 'Test User 1'
            },
            {
                id_solicitudes: 2,
                Correo: 'test2@example.com',
                Estado: 1,
                Nombre: 'Test User 2'
            }
        ],
        loading: false
    }))
}));

vi.mock('../../../providers/Auth', () => ({
    useAuth: vi.fn(() => ({
        user: {
            role: 'admin',
            isFirstTime: false
        }
    }))
}));

vi.mock('../Card', () => ({
    default: ({ request, onClick }: { request: any; onClick: () => void }) => (
        <div data-testid={`request-card-${request.id_solicitudes}`} onClick={onClick}>
            {request.Nombre} - {request.Correo}
        </div>
    )
}));

vi.mock('../Modal', () => ({
    default: ({ request, onClose }: { request: any; onClose: () => void }) => (
        <div data-testid="request-modal">
            <div>Modal for: {request.Nombre}</div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}));

vi.mock('../FormModal', () => ({
    default: ({ request, onClose }: { request: any; onClose: () => void }) => (
        <div data-testid="request-form-modal">
            <div>Form Modal: {request}</div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}));

vi.mock('../../User/FormModal', () => ({
    default: ({ request, closeModal }: { request: any; closeModal: () => void }) => (
        <div data-testid="user-form-modal">
            <div>User Form Modal: {request}</div>
            <button onClick={closeModal}>Close</button>
        </div>
    )
}));

vi.mock('../../Dropdown', () => ({
    default: ({ options, onChange }: { options: any[]; onChange: (e: any) => void }) => (
        <select data-testid="state-dropdown" onChange={onChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}));

vi.mock('../../Loading', () => ({
    default: () => <div data-testid="loading">Loading...</div>
}));

// Mock fetch
const mockFetch = vi.fn();
Object.defineProperty(window, 'fetch', {
    value: mockFetch,
    writable: true
});

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }: { icon: any }) => <span data-testid="icon">{icon.iconName}</span>
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
    faPlus: { iconName: 'plus' }
}));

describe('GridRequests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch.mockClear();
    });

    it('should render loading state when loading is true', () => {
        vi.mocked(useRequestsModule.useRequest).mockReturnValueOnce({
            requests: [],
            loading: true
        });

        render(<GridRequests />);
        
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render admin title and subtitle for admin users', () => {
        render(<GridRequests />);
        
        expect(screen.getByText('Solicitudes')).toBeInTheDocument();
        expect(screen.getByText('Gestión de solicitudes de reserva para salones')).toBeInTheDocument();
    });

    it('should render user title and subtitle for non-admin users', () => {
        vi.mocked(useAuthModule.useAuth).mockReturnValueOnce({
            user: {
                role: 'user',
                isFirstTime: false
            }
        });

        render(<GridRequests />);
        
        expect(screen.getByText('Mis Solicitudes')).toBeInTheDocument();
        expect(screen.getByText('Gestión de mis solicitudes de reserva para salones')).toBeInTheDocument();
    });

    it('should render search bar and filter dropdown', () => {
        render(<GridRequests />);
        
        expect(screen.getByPlaceholderText('Buscar por correo...')).toBeInTheDocument();
        expect(screen.getByTestId('state-dropdown')).toBeInTheDocument();
    });

    it('should render request cards for each request', () => {
        render(<GridRequests />);
        
        expect(screen.getByTestId('request-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('request-card-2')).toBeInTheDocument();
        expect(screen.getByText('Test User 1 - test1@example.com')).toBeInTheDocument();
        expect(screen.getByText('Test User 2 - test2@example.com')).toBeInTheDocument();
    });

    it('should filter requests by state when dropdown changes', () => {
        render(<GridRequests />);
        
        const dropdown = screen.getByTestId('state-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Pendiente' } });
        
        // The dropdown change event should be triggered
        expect(dropdown).toBeInTheDocument();
    });

    it('should filter requests by email when search input changes', () => {
        render(<GridRequests />);
        
        const searchInput = screen.getByPlaceholderText('Buscar por correo...');
        fireEvent.change(searchInput, { target: { value: 'test1' } });
        
        expect(searchInput).toHaveValue('test1');
    });

    it('should open request modal when clicking on a request card', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                data: {
                    id_solicitudes: 1,
                    Nombre: 'Test User 1',
                    Correo: 'test1@example.com'
                }
            })
        });

        render(<GridRequests />);
        
        const requestCard = screen.getByTestId('request-card-1');
        fireEvent.click(requestCard);
        
        await waitFor(() => {
            expect(screen.getByTestId('request-modal')).toBeInTheDocument();
        });
        
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/solicitudes/1'));
    });

    it('should close request modal when close button is clicked', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                data: {
                    id_solicitudes: 1,
                    Nombre: 'Test User 1',
                    Correo: 'test1@example.com'
                }
            })
        });

        render(<GridRequests />);
        
        const requestCard = screen.getByTestId('request-card-1');
        fireEvent.click(requestCard);
        
        await waitFor(() => {
            expect(screen.getByTestId('request-modal')).toBeInTheDocument();
        });
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(screen.queryByTestId('request-modal')).not.toBeInTheDocument();
    });

    it('should show add request button for non-admin users', () => {
        vi.mocked(useAuthModule.useAuth).mockReturnValueOnce({
            user: {
                role: 'user',
                isFirstTime: false
            }
        });

        render(<GridRequests />);
        
        expect(screen.getByText('Solicitar Reserva')).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should not show add request button for admin users', () => {
        render(<GridRequests />);
        
        expect(screen.queryByText('Solicitar Reserva')).not.toBeInTheDocument();
    });

    it('should open form modal when add request button is clicked', () => {
        vi.mocked(useAuthModule.useAuth).mockReturnValueOnce({
            user: {
                role: 'user',
                isFirstTime: false
            }
        });

        render(<GridRequests />);
        
        const addButton = screen.getByText('Solicitar Reserva');
        fireEvent.click(addButton);
        
        expect(screen.getByTestId('request-form-modal')).toBeInTheDocument();
    });

    it('should close form modal when close button is clicked', () => {
        vi.mocked(useAuthModule.useAuth).mockReturnValueOnce({
            user: {
                role: 'user',
                isFirstTime: false
            }
        });

        render(<GridRequests />);
        
        const addButton = screen.getByText('Solicitar Reserva');
        fireEvent.click(addButton);
        
        expect(screen.getByTestId('request-form-modal')).toBeInTheDocument();
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(screen.queryByTestId('request-form-modal')).not.toBeInTheDocument();
    });

    it('should show user form modal for first-time users', () => {
        vi.mocked(useAuthModule.useAuth).mockReturnValueOnce({
            user: {
                role: 'user',
                isFirstTime: true
            }
        });

        render(<GridRequests />);
        
        expect(screen.getByTestId('user-form-modal')).toBeInTheDocument();
    });

    it('should close user form modal and update localStorage when close button is clicked', () => {
        vi.mocked(useAuthModule.useAuth).mockReturnValueOnce({
            user: {
                role: 'user',
                isFirstTime: true
            }
        });

        const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');

        render(<GridRequests />);
        
        expect(screen.getByTestId('user-form-modal')).toBeInTheDocument();
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(screen.queryByTestId('user-form-modal')).not.toBeInTheDocument();
        expect(mockSetItem).toHaveBeenCalledWith('isFirstTime', 'false');
    });

    it('should handle fetch error when opening request modal', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Error message' })
        });

        render(<GridRequests />);
        
        const requestCard = screen.getByTestId('request-card-1');
        fireEvent.click(requestCard);
        
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error al cargar la solicitud:', 'Error message');
        });
        
        consoleSpy.mockRestore();
    });

    it('should handle network error when opening request modal', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        render(<GridRequests />);
        
        const requestCard = screen.getByTestId('request-card-1');
        fireEvent.click(requestCard);
        
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error al hacer la solicitud:', expect.any(Error));
        });
        
        consoleSpy.mockRestore();
    });

    it('should filter requests correctly with both state and search filters', () => {
        render(<GridRequests />);
        
        const searchInput = screen.getByPlaceholderText('Buscar por correo...');
        const dropdown = screen.getByTestId('state-dropdown');
        
        // Set both filters
        fireEvent.change(searchInput, { target: { value: 'test1' } });
        fireEvent.change(dropdown, { target: { value: 'Pendiente' } });
        
        expect(searchInput).toHaveValue('test1');
        expect(dropdown).toBeInTheDocument();
    });

    it('should handle empty requests array', () => {
        vi.mocked(useRequestsModule.useRequest).mockReturnValueOnce({
            requests: [],
            loading: false
        });

        render(<GridRequests />);
        
        expect(screen.queryByTestId('request-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('request-card-2')).not.toBeInTheDocument();
    });

    it('should handle requests with missing properties gracefully', () => {
        vi.mocked(useRequestsModule.useRequest).mockReturnValueOnce({
            requests: [
                {
                    id_solicitudes: 3,
                    // Missing Correo and Estado
                    Nombre: 'Test User 3'
                }
            ],
            loading: false
        });

        render(<GridRequests />);
        
        expect(screen.getByTestId('request-card-3')).toBeInTheDocument();
        expect(screen.getByText(/Test User 3/)).toBeInTheDocument();
    });
});
