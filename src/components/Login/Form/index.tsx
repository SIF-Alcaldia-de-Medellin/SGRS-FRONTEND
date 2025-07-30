import { useState } from 'react';
import { useAuth } from '../../../providers/Auth';
import backgroundForm from '../../../assets/loginBg.svg'
import './LoginForm.css'

interface FormElements extends HTMLFormControlsCollection {
    user: HTMLInputElement;
    password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
    readonly elements: FormElements
}

const LoginForm = () => { 
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();

    const handleSubmit = (event: React.FormEvent<LoginFormElement>) => {
        event.preventDefault();

        if (user !== '' && password != '') {
            const role = user === 'admin' ? 'admin' : 'default'                
            const isFirstTime = Math.random() > 0.5 ? true : false
            login('token', role, isFirstTime);
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className='formContainer'>
            <form onSubmit={handleSubmit} className="loginForm">
                <img src={backgroundForm} className='background' alt="Imagen de fondo" />
                <h1 className='title-login-form'>Login</h1>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className='input-login-page'
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='input-login-page'
                />
                <button className="button-login-form" type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default LoginForm;
