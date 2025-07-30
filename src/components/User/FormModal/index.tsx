import { useEffect, useState } from "react";
import { Request } from "../../../types";
import Modal from "../../Modal";
import { API_URL } from "../../../config/consts";
import MINISTRIES_DATA from './ministries.json';
import './FormModal.css';

interface IUserFormModalProps {
    request: Request | string;
    closeModal: () => void;
}

interface IErrorsUserForm {
  name?: string;
  lastName?: string;
  ministry?: string;
  form?: string;
}

interface IMinistry {
  Nombre?: string;
  id?: number;
}

const UserFormModal = ({closeModal}: IUserFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    ministry: '',
  });

  const [ministries, setMinistries] = useState<Array<IMinistry>>([]);
  const [errors, setErrors] = useState<IErrorsUserForm>({});

  useEffect(() => {
    if (MINISTRIES_DATA && MINISTRIES_DATA.ministries && Array.isArray(MINISTRIES_DATA.ministries)) {
      setMinistries(MINISTRIES_DATA.ministries);
    } else {
      console.error('Error: Datos de secretarías no están correctamente estructurados.');
      setMinistries([]);
    }
  }, []);

  const validateForm = () => {
    let error = false;
    setErrors({});
    if(formData.name.length == 0){
      setErrors({...errors, name: 'El nombre no puede estar vacio'});
      error = true;
    }
    if(formData.lastName.length == 0){
      setErrors({...errors, lastName: 'El apellido no puede estar vacio'});
      error = true
    }
    if(formData.ministry == ''){
      setErrors({...errors, ministry: 'Seleccione una secretaria valida'});
      error = true
    }

    return error;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Server Error Response:', errorResponse);
        throw new Error('Error al enviar la solicitud');
      }

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      closeModal();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setErrors({...errors, form: 'Ha ocurrido un error al guardar la información'});
    }
  }


  return(
    <Modal isCloseButton={false} >
      <div className='form-container'>
        <h1>Información Adicional Registro</h1>
        <i className="info">Necesitamos completar algunos datos para reconocer correctamente el usuario que hara uso de los salones dentro del distrito. Para ello por favor diligencia el siguiente formulario:</i>
        <form onSubmit={handleSubmit} className="form-user">
          <div className='row'>
            <div className="input-form">
              <input
                type="text"
                name="name"
                placeholder='Nombre'
                value={formData.name}
                onChange={handleChange}
                required
                className={`Row ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <i className="error-message">{errors.name}</i>}
            </div>
            <div className="input-form">
              <input
                type="text"
                name="lastName"
                placeholder='Apellido'
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`Row ${errors.lastName ? 'error' : ''}`}
              />
              {errors.lastName && <i className="error-message">{errors.lastName}</i>}
            </div>
          </div>

          <div className="row">
            <div className="input-form">
              <select
                name="ministry"
                value={formData.ministry}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Secretaría donde perteneces
                </option>
                {ministries.length > 0 ? (
                  ministries.map((ministry: IMinistry) => (
                    <option key={ministry.id} value={ministry.Nombre}>
                      {ministry.Nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay secretarías disponibles</option>
                )}
              </select>
              {errors.ministry && <i className="error-message">{errors.ministry}</i>}
            </div>
          </div>

          {errors.form && <i className="error-message">{errors.form}</i>}
          <button type="submit" className="submit-button">Enviar</button>
        </form>
      </div>
    </Modal>
  )
}

export default UserFormModal;