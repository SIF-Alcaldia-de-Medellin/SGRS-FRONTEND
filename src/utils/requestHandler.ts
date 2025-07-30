import { API_URL } from "../config/consts";

interface Data {
    salaId: number,
    horaInicio: Date | string,
    horaFin: Date | string,
}

export const approveRequest = async (requestId: number, data: Data) => {
    const response = await fetch(`${API_URL}/solicitudes/approve/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error al aprobar solicitud');
    }

    return await response.json();
};

export const disapproveRequest = async (requestId: number) => {
    const response = await fetch(`${API_URL}/solicitudes/disapprove/${requestId}`, {
        method: 'PUT',
    });

    if (!response.ok) {
        throw new Error('Error al rechazar solicitud');
    }

    return await response.json();
};