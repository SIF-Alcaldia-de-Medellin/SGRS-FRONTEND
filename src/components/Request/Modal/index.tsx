import { useState } from "react";
import { Request } from "../../../types";
import RoomCard from "../../Room/Card";
import { Room } from "../../../types";
import { approveRequest, disapproveRequest } from "../../../utils/requestHandler";
import Loading from "../../Loading";
import { useRooms } from "../../../hooks/useRooms";
import './RequestModal.css';
import Modal from "../../Modal";

interface RequestModalProps {
    request: Request;
    onClose: () => void;
}

const RequestModal = ({request, onClose}: RequestModalProps) => {
  const [roomSelected, setRoomSelected]= useState(0); // ID del salón seleccionado
  const [showSchedules, setShowSchedules] = useState(false);  
  const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState('');
  const [horaFinalSeleccionada, setHoraFinalSeleccionada] = useState(''); 
  const [horaInicio] = useState(request ? request?.Hora_inicio : ''); 
  const [horaFinal] = useState(request ? request?.Hora_final : ''); 

  const [roomsAvailable, rangesAvailable, loading] = useRooms(request);

  const toggleHorarios = () => {
    setShowSchedules(!showSchedules);
  };

  // Maneja la selección de un salón
  const handleRoomSelected = (salon: Room) => {
    setRoomSelected(salon?.id_sala);
  
    // Establece las horas de inicio y fin seleccionadas si están disponibles
    if (!horaInicioSeleccionada && salon.horaInicio) {
      setHoraInicioSeleccionada(salon?.horaInicio);
    }
    if (!horaFinalSeleccionada && salon.horaFin) {
      setHoraFinalSeleccionada(salon?.horaFin);
    }
  };

  // Maneja la acción de agendar una reunión
  const handleAgendarReunion = async () => {
    if (!roomSelected) {
      alert('Por favor, selecciona un salón.');
      return;
    }
  
    const horaInicioFinal = horaInicioSeleccionada || horaInicio;
    const horaFinalFinal = horaFinalSeleccionada || horaFinal;
  
    if (!horaInicioFinal || !horaFinalFinal) {
      alert('Por favor, selecciona un horario válido.');
      return;
    }
  
    const data = {
      salaId: roomSelected,
      horaInicio: horaInicioFinal,
      horaFin: horaFinalFinal,
    };
  
    try {
      const result = await approveRequest(request.id_solicitudes, data); // Usar el servicio
      console.log('Solicitud aprobada con éxito:', result);
      onClose();
    } catch (error) {
      console.error('Error al aprobar request:', error);
    }
  };
 
  // Maneja la Accion de rechazar una reunion
  const handleRechazarSolicitud = async () => {
    try {
      const result = await disapproveRequest(request.id_solicitudes); // Usar el servicio
      console.log('Solicitud rechazada con éxito:', result);
      onClose();
    } catch (error) {
      console.error('Error al rechazar request:', error);
    }
  };

  if (loading) {
    return  (
      <Modal onClose={onClose}>
        <Loading />
      </Modal>);
  }

  return (
    <Modal onClose={onClose}>
        <table className="table-request">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Número</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.Nombre} {request?.Apellido}</td>
              <td>{request?.Correo}</td>
              <td>{request?.Telefono}</td>
              <td></td>
            </tr>
            <tr>
              <th>Secretaria</th>
              <th>Fecha Reserva</th>
              <th>Hora de inicio</th>
              <th>Hora de finalización</th>
            </tr>
            <tr>
              <td>{request.Secretaria}</td>
              <td>{request.Fecha_reserva}</td>
              <td>
                {showSchedules ? (
                  <input
                    type="time"
                    value={horaInicioSeleccionada || horaInicio}
                    onChange={(e) => setHoraInicioSeleccionada(e.target.value)}
                  />
                ) : (
                  horaInicioSeleccionada || request.Hora_inicio
                )}
              </td>
              <td>
                {showSchedules ? (
                  <input
                    type="time"
                    value={horaFinalSeleccionada || horaFinal}
                    onChange={(e) => setHoraFinalSeleccionada(e.target.value)}
                  />
                ) : (
                  horaFinalSeleccionada || request.Hora_final
                )}
              </td>
            </tr>
            <tr>
              <th>Número asistentes</th>
              <th>Propósito de la reunión</th>
              <th>Computador</th>
              <th>Hdmi</th>
            </tr>
            <tr>
              <td>{request.Num_asistentes}</td>
              <td>{request.Proposito}</td>
              <td>{request.Computador ? 'Si' : 'No'}</td>
              <td>{request.HDMI ? 'Si' : 'No'}</td>
            </tr>
          </tbody>
        </table>

        <div className="botones-container">
          <button className={`botones ${!showSchedules ? 'active': ''}`} onClick={() => setShowSchedules(false)}>Salones Disponibles</button>
          <button className={`botones ${showSchedules ? 'active': ''}`} onClick={toggleHorarios}>Horarios Disponibles</button>
        </div>

        <div className="modal-inferior">
          <div className="accept-reject-buttons-container">
            <button className="agendarBoton" onClick={handleAgendarReunion}>Agendar Solicitud</button>
            <button className="rechazarBoton" onClick={handleRechazarSolicitud}>Rechazar Solicitud</button>
          </div>

          <div className="rooms-container">
            {showSchedules ? (
                rangesAvailable?.length > 0 ? (
                  rangesAvailable?.map((room: Room, index: number) => (
                    <div key={index} className ="room-item">
                      <RoomCard
                        room={room}
                        isSelected={roomSelected === room.id_sala}
                        onSelect={() => handleRoomSelected(room)}
                      />
                    </div>
                  ))
                ) : (
                  <div>No hay intervalos disponibles para esta request.</div>
                )
            ) : (
              roomsAvailable
                  .map((room: Room, index: number) => (
                    <div key={index} className="room-item">
                      <RoomCard
                        room={room}
                        isSelected={roomSelected === room.id_sala}
                        onSelect={() => handleRoomSelected(room)}
                      />
                    </div>
                  ))
            )}
          </div>
        </div>
    </Modal>
  );
}

export default RequestModal;