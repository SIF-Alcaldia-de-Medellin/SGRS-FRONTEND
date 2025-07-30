import { useState } from 'react';
import RequestCard from '../Card'; 
/* import Dropdown from '../Dropdown';*/
import RequestModal from '../Modal';  
import './GridRequests.css';
import { STATE_OPTIONS, STATES, API_URL } from '../../../config/consts';
import { Request } from '../../../types';
import Loading from '../../Loading';
import { useAuth } from '../../../providers/Auth';
import Dropdown from '../../Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import RequestFormModal from '../FormModal';
import { useRequest } from '../../../hooks/useRequests';
import UserFormModal from '../../User/FormModal';

const GridRequests = () => {
  // Estado local para manejar solicitudes, filtro, carga y modal
  const { user } = useAuth();
  const [filter, setFilter] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFormUserOpen,setModalFormUserOpen] = useState(user?.role !== 'admin' && user?.isFirstTime)
  const [selectedRequest, setSelectedRequest] = useState(null);
  const {requests, loading } = useRequest();

  const filteredRequests = filter || searchValue
    ? requests.filter((request: Request) => {
        const stateRequest = mapState(request?.Estado || 0);
        const email = request?.Correo || '';

        if (filter && !searchValue) return stateRequest === filter;
        if (!filter && searchValue) return email.toLowerCase().includes(searchValue.toLowerCase());
        return (
            stateRequest === filter && email.toLowerCase().includes(searchValue.toLowerCase())
        );
      })
    : requests;

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const openRequestModal = async (request: Request) => {
    try {
      const response = await fetch(`${API_URL}/solicitudes/${request?.id_solicitudes}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedRequest(data.data);
        setModalOpen(true);
      } else {
        console.error('Error al cargar la solicitud:', data.message);
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
    }
  };

  const closeRequestModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const openFormModal = () => {
    setModalOpen(true);
  }

  const closeRequestFormModal = () => {
    setModalOpen(false);
  }

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="solicitudes">
        <Loading />
      </div>
    );
  }

  return (
    <div className="solicitudes">
      <div className='container-text'>
        <div className='container-soli'>
          <h1 className='title-page'>{user.role === 'admin' ? 'Solicitudes' : 'Mis Solicitudes'}</h1>
          <i className='subtitle-page'>{user.role === 'admin' ? 'Gestión de solicitudes de reserva para salones' : 'Gestión de mis solicitudes de reserva para salones'}</i>
        </div>
      </div>
      <div className="filter-bar">
        <input 
          className='search-bar'
          type="text" 
          placeholder="Buscar por correo..." 
          value={searchValue} 
          onChange={handleSearchValue} 
        />
        <Dropdown options={STATE_OPTIONS} onChange={handleFilterChange} />
      </div>
      <div className="solicitudes-grid">
        {Array.isArray(filteredRequests) && filteredRequests.map((request: Request, index: number) => (
          <RequestCard 
            key={index} 
            request={request} 
            onClick={() => openRequestModal(request)} 
          />
        ))}
      </div>
      {modalOpen && selectedRequest && (
        <RequestModal request={selectedRequest} onClose={closeRequestModal} />
      )}
      {user?.role != 'admin' && (
        <button className='add-request-button' onClick={openFormModal}><p className="text-button">Solicitar Reserva </p><FontAwesomeIcon icon={faPlus} /></button>
      )}
      {modalOpen && !selectedRequest && (
        <RequestFormModal request={'modal form request'} onClose={closeRequestFormModal} />
      )}
      {modalFormUserOpen && (
        <UserFormModal request={'modal form user'} closeModal={()=>{
          setModalFormUserOpen(false)
          localStorage.setItem('isFirstTime', 'false')
        }} />
      )}
    </div>
  );
}

const mapState = (state: number) => {
  return STATES[state] || 'desconocido';
};

export default GridRequests;