export const API_URL: string = import.meta.env.VITE_API_URL;

export const STATE_OPTIONS = [
    {value : '', label: 'Filtrar por estado'},
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'rechazada', label: 'Rechazada' },
    { value: 'reservada', label: 'Reservada' },
];

export const MEETROOMS_OPTIONS = [
    { value: '', label: 'Agrupacion de salones' },
    { value: 'opcion2', label: 'Opción 2' },
    { value: 'opcion3', label: 'Opción 3' },
];

export const STATES: { [key: number]: string } = {
    0: 'rechazada',
    1:'reservada',
    2: 'en_proceso',
};