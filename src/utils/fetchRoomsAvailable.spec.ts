import { fetchRoomsAvailable } from './fetchRoomsAvailable';  // Ajusta la ruta si es necesario
import { API_URL } from "../config/consts";
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

// Mock de fetch
Object.defineProperty(window, 'fetch', {
  value: vi.fn(),
  writable: true
});

describe('fetchRoomsAvailable', () => {

  beforeEach(() => {
    vi.clearAllMocks();  // Limpiar mocks antes de cada prueba
  });

  it('should throw an error if request is missing or id_solicitudes is undefined', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(fetchRoomsAvailable({} as any)).rejects.toThrow('No se encontró solicitud o id_solicitudes no está definido.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(fetchRoomsAvailable({ id_solicitudes: undefined } as any)).rejects.toThrow('No se encontró solicitud o id_solicitudes no está definido.');
  });

  it('should fetch individual rooms if Num_asistentes <= 15', async () => {
    const request = { id_solicitudes: 123, Num_asistentes: 10, Computador: false, HDMI: false };

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: ['room1', 'room2'] }),
    };

    (fetch as Mock).mockResolvedValue(mockResponse);

    const rooms = await fetchRoomsAvailable(request);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/salas/disponibilidad-individual/123`);
    expect(rooms).toEqual(['room1', 'room2']);
  });

  it('should fetch combined rooms if Num_asistentes > 15', async () => {
    const request = { id_solicitudes: 123, Num_asistentes: 20, Computador: false, HDMI: false };

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: ['room1', 'room2'] }),
    };

    (fetch as Mock).mockResolvedValue(mockResponse);

    const rooms = await fetchRoomsAvailable(request);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/salas/disponibilidad-combinada/123`);
    expect(rooms).toEqual(['room1', 'room2']);
  });

  it('should throw an error if the response is not ok (individual)', async () => {
    const request = { id_solicitudes: 123, Num_asistentes: 10, Computador: false, HDMI: false };

    const mockResponse = { ok: false, json: () => Promise.resolve({}) };

    (fetch as Mock).mockResolvedValue(mockResponse);

    await expect(fetchRoomsAvailable(request)).rejects.toThrow('Error al obtener las salas individuales');
  });

  it('should throw an error if the response is not ok (combined)', async () => {
    const request = { id_solicitudes: 123, Num_asistentes: 20, Computador: false, HDMI: false };

    const mockResponse = { ok: false, json: () => Promise.resolve({}) };

    (fetch as Mock).mockResolvedValue(mockResponse);

    await expect(fetchRoomsAvailable(request)).rejects.toThrow('Error al obtener las salas combinadas');
  });
});