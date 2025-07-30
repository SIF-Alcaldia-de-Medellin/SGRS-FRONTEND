import './RoomCard.css';
import { Intervalo, Room } from '../../../types';

interface RoomCardProps {
    room: Room;
    isSelected: boolean;
    onSelect: () => void;
}

function RoomCard({ room, isSelected, onSelect }: RoomCardProps) {
    // Determinar el estado de la sala (ocupado o disponible)
    const stateClassName = isSelected
        ? 'seleccionado' // Cuando está seleccionado, la clase es 'seleccionado'
        : room?.estado === 0
        ? 'reservado'  // Si la sala está ocupada (estado 0)
        : 'disponible'; // Si la sala está disponible (estado 1)

    const cardClass = `salon-card ${stateClassName} ${isSelected ? 'selected' : ''}`;

    // Texto para el estado de la sala
    const stateText = isSelected 
        ? 'Seleccionado' 
        : room?.estado === 0 
        ? 'Reservado' 
        : 'Disponible'; 

    // Función que previene la selección si la sala está reservada
    const handleSelect = () => {
        if (room?.estado !== 0) {
            onSelect();
        }
    };

    return (
        <div 
            className={cardClass} 
            onClick={handleSelect}
            style={{ pointerEvents: room?.estado === 0 ? 'none' : 'auto' }}
        >
            <div className="card-header">
                <h3>Salon {room?.id_sala}</h3>
                <span className={`estado-texto ${stateClassName}`}>
                    {stateText}
                </span>
            </div>

            {room?.intervalos && room?.intervalos.length > 0 ? (
                <div className="intervalos">
                    <p><strong>Intervalos Disponibles:</strong></p>
                    {room?.intervalos.map((range: Intervalo) => (
                        <p key={range?.id}><strong>{range?.inicio} - {range?.fin}</strong></p>
                    ))}
                </div>
            ) : (
                <p><strong>Rango de Horas Disponibles: {room?.rangoHoras || 'No disponible'}</strong></p>
            )}
        </div>
    );
}

export default RoomCard;
