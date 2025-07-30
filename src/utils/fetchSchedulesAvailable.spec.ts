import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { fetchSchedulesAvailable } from './fetchSchedulesAvailable';
import { API_URL } from '../config/consts';
import { Request } from '../types';

const mockRequest = {
    id_solicitudes: 12345,
    Num_asistentes: 10
};

describe('fetchSchedulesAvailable', () => {
    let fetchMock: any;

    beforeEach(() => {
        // Reseteamos los mocks antes de cada prueba
        fetchMock = vi.fn();
        global.fetch = fetchMock;
    });

    it('should throw an error if request is null or undefined', async () => {
        await expect(fetchSchedulesAvailable(null as any)).rejects.toThrow(
            'No se encontró solicitud o id_solicitudes no está definido.'
        );
    });

    it('should throw an error if id_solicitudes is undefined', async () => {
        const invalidRequest = { ...mockRequest, id_solicitudes: undefined};
        await expect(fetchSchedulesAvailable(invalidRequest)).rejects.toThrow(
            'No se encontró solicitud o id_solicitudes no está definido.'
        );
    });

    it('should call the correct API URL based on Num_asistentes <= 15', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => ({ data: { data: ['schedule1', 'schedule2'] } })
        });

        const result = await fetchSchedulesAvailable(mockRequest);

        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/salas/intervalos-individual/12345`);
        expect(result).toEqual(['schedule1', 'schedule2']);
    });

    it('should call the correct API URL based on Num_asistentes > 15', async () => {
        const requestWithMoreThan15 = { ...mockRequest, Num_asistentes: 20 };
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => ({ data: { data: ['schedule1', 'schedule2'] } })
        });

        const result = await fetchSchedulesAvailable(requestWithMoreThan15);

        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/salas/intervalos-combinados/12345`);
        expect(result).toEqual(['schedule1', 'schedule2']);
    });

    it('should throw an error if response is not ok', async () => {
        fetchMock.mockResolvedValueOnce({ ok: false });

        await expect(fetchSchedulesAvailable(mockRequest)).rejects.toThrow(
            'Error al obtener los intervalos'
        );
    });

    it('should return schedules if response is ok', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => ({ data: { data: ['schedule1', 'schedule2'] } })
        });

        const result = await fetchSchedulesAvailable(mockRequest);

        expect(result).toEqual(['schedule1', 'schedule2']);
    });
});
