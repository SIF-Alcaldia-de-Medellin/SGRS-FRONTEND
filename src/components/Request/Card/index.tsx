import './RequestCard.css';
import { STATES } from '../../../config/consts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Request } from '../../../types';

interface RequestCardProps {
    request: Request;
    onClick: () => void;
}

function RequestCard({ request, onClick }: RequestCardProps) {
  // Mapea el estado numérico a texto
  const mapState = (state: number) => {
    return STATES[state] ? STATES[state] : 'desconocido'
  };

  // Función para formatear el texto (convertir en_proceso a En Proceso, etc.)
  const stateToText = (state: string) => {
    return state
      .replace(/_/g, ' ') 
      .replace(/\b\w/g, (letter) => letter.toUpperCase()); 
  };

  const stateClass = mapState(request?.Estado || 0); 
  const stateText = stateToText(stateClass); 

  return (
    <div className={`request-card ${stateClass}`} onClick={onClick}>
      <div className="card-header">
        <h3 className='card-title'><FontAwesomeIcon icon={faEnvelope} /> Solicitud #{request?.id_solicitudes}</h3>
        <span className={`estado ${stateClass}`}>{stateText}</span> {/* Mostramos el texto formateado */}
      </div>
      <p><strong>Nombre:</strong> {request?.Nombre}</p>
      <p><strong>Correo:</strong> {request?.Correo}</p>
      <p><strong>Personas a asistir:</strong> {request?.Num_asistentes}</p>
      <p><strong>Fecha de la reunión:</strong> {request?.Fecha_reserva}</p>
      <div className='line'></div>
      <div className="card-footer">
        <span><strong>Hora de Inicio:</strong> {request?.Hora_inicio}</span>
        <span><strong>Hora de Finalización:</strong> {request?.Hora_final}</span>
      </div>
    </div>
  );
}

export default RequestCard;