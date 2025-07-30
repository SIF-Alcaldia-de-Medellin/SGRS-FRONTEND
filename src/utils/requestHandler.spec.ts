import { describe, it, expect, vi, beforeEach } from 'vitest';
import { approveRequest, disapproveRequest } from './requestHandler'; // Cambia por la ruta correcta
import { API_URL } from '../config/consts';

describe('approveRequest', () => {
    let fetchMock: any;

    beforeEach(() => {
        fetchMock = vi.fn();
        global.fetch = fetchMock;
    });

    it('should throw an error if response is not ok', async () => {
        const mockRequestId = 123;
        const mockData = { salaId: 1, horaInicio: new Date(), horaFin: new Date() };

        fetchMock.mockResolvedValueOnce({ ok: false });

        await expect(approveRequest(mockRequestId, mockData)).rejects.toThrow(
            'Error al aprobar solicitud'
        );
    });

    it('should return the response JSON when approval is successful', async () => {
        const mockRequestId = 123;
        const mockData = { salaId: 1, horaInicio: new Date(), horaFin: new Date() };
        const mockResponse = { success: true };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const result = await approveRequest(mockRequestId, mockData);

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/solicitudes/approve/123`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockData),
        });
    });
});

describe('disapproveRequest', () => {
    let fetchMock: any;

    beforeEach(() => {
        fetchMock = vi.fn();
        global.fetch = fetchMock;
    });

    it('should throw an error if response is not ok', async () => {
        const mockRequestId = 123;

        fetchMock.mockResolvedValueOnce({ ok: false });

        await expect(disapproveRequest(mockRequestId)).rejects.toThrow(
            'Error al rechazar solicitud'
        );
    });

    it('should return the response JSON when disapproval is successful', async () => {
        const mockRequestId = 123;
        const mockResponse = { success: true };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const result = await disapproveRequest(mockRequestId);

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/solicitudes/disapprove/123`, {
            method: 'PUT',
        });
    });
});