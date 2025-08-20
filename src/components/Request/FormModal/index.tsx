//import { useState } from "react";
import { Request } from "../../../types";
// import RoomCard from "../../Room/Card";
import Modal from "../../Modal";

interface RequestFormModalProps {
    request: Request | string;
    onClose: () => void;
}

const RequestFormModal = ({request, onClose}: RequestFormModalProps) => {
  return(
    <Modal onClose={onClose}>
      Modal {request?.toString()}
    </Modal>
  )
  /* const [filtro] = useState(''); 
  const [salonSeleccionado, setSalonSeleccionado] = useState(null); // ID del salón seleccionado
  const [showHorarios, setShowHorarios] = useState(false); 
  const [salasDisponibles, setSalasDisponibles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [intervalosDisponibles, setIntervalosDisponibles] = useState([]);
  const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState('');
  const [horaFinalSeleccionada, setHoraFinalSeleccionada] = useState(''); 
  const [horaInicio] = useState(request ? request?.Hora_inicio : ''); 
  const [horaFinal] = useState(request ? request?.Hora_final : ''); 

  useEffect(() => {
    // Función para cargar salas y horarios disponibles
    const loadSalas = async () => {
      try {
        const salas = await fetchSalasDisponibles(request); // Llama al hook para obtener salas
        setSalasDisponibles(salas);

        const intervalos = await fetchHorariosDisponibles(request); // Llama al hook para obtener horarios
        const salonesConIntervalos = intervalos.map(salon => {
          // Marca los salones sin intervalos como reservados
          if (!salon.intervalos || salon.intervalos.length === 0) {
            salon.estado = 0;  
          }
          return salon;
        });

        setIntervalosDisponibles(salonesConIntervalos); // Actualiza el estado con los intervalos
      } catch (error) {
        console.error('Error al cargar salas o intervalos:', error); 
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    loadSalas(); 
  }, [request]); // Dependencia en la request para recargar datos si cambia

  // Alterna la visibilidad de los horarios
  const toggleHorarios = () => {
    setShowHorarios(!showHorarios);
  };

  // Maneja la selección de un salón
  const handleSalonSelect = (salon) => {
    setSalonSeleccionado(salon.id_sala);
  
    // Establece las horas de inicio y fin seleccionadas si están disponibles
    if (!horaInicioSeleccionada && salon.horaInicio) {
      setHoraInicioSeleccionada(salon.horaInicio);
    }
    if (!horaFinalSeleccionada && salon.horaFin) {
      setHoraFinalSeleccionada(salon.horaFin);
    }
  };

  // Maneja la acción de agendar una reunión
  const handleAgendarReunion = async () => {
    if (!salonSeleccionado) {
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
      salaId: salonSeleccionado,
      horaInicio: horaInicioFinal,
      horaFin: horaFinalFinal,
    };
  
    try {
      const result = await agendarSolicitud(request.id_requestes, data); // Usar el servicio
      console.log('Solicitud aprobada con éxito:', result);
      onClose();
    } catch (error) {
      console.error('Error al aprobar request:', error);
    }
  };
 
  // Maneja la Accion de rechazar una reunion
  const handleRechazarSolicitud = async () => {
    try {
      const result = await rechazarSolicitud(request.id_requestes); // Usar el servicio
      console.log('Solicitud rechazada con éxito:', result);
      onClose();
    } catch (error) {
      console.error('Error al rechazar request:', error);
    }
  };

  // Maneja el clic en el modal para cerrarlo si se hace clic fuera del contenido
  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga
  }

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content">
        <table className="table-request">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Número</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request.Nombre} {request.Apellido}</td>
              <td>{request.Correo}</td>
              <td>{request.Telefono}</td>
              <td>{request.Direccion}</td>
            </tr>
            <tr>
              <th>Secretaria</th>
              <th>Fecha Reserva</th>
              <th>Hora de inicio</th>
              <th>Hora de finalización</th>
            </tr>
            <tr>
              <td>{request.id_secretarias.Nombre}</td>
              <td>{request.Fecha_reserva}</td>
              <td>
                {showHorarios ? (
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
                {showHorarios ? (
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
          <button className="botones" onClick={() => setShowHorarios(false)}>Salones Disponibles</button>
          <button className="botones" onClick={toggleHorarios}>Horarios Disponibles</button>
        </div>

        <div className="modal-inferior">
          <div className="accept-reject-buttons-container">
            <button className="rechazarBoton" onClick={handleRechazarSolicitud}>Rechazar Solicitud</button>
            <button className="agendarBoton" onClick={handleAgendarReunion}>Agendar Solicitud</button>
          </div>

          <div className="salones-container">
            {showHorarios ? (
              <div className="intervalos-container">
                {intervalosDisponibles.length > 0 ? (
                  intervalosDisponibles.map((salon) => (
                    <div key={salon.id_sala} className ="salon-item">
                      <RoomCard
                        room={salon}
                        isSelected={salonSeleccionado === salon.id_sala}
                        onSelect={() => handleSalonSelect(salon)}
                      />
                    </div>
                  ))
                ) : (
                  <div>No hay intervalos disponibles para esta request.</div>
                )}
              </div>
            ) : (
              salasDisponibles.filter(salon => salon.id_sala && salon.id_sala.toString().includes(filtro)).map((salon, index) => (
                <div key={index} className="salon-item">
                  <RoomCard
                    room={salon}
                    isSelected={salonSeleccionado === salon.id_sala}
                    onSelect={() => handleSalonSelect(salon)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  ); */
}

export default RequestFormModal;