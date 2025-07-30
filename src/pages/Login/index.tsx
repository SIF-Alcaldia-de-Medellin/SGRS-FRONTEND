import alcaldiaImg from '../../assets/alcaldia.svg';
import loginImg from '../../assets/loginImg.svg';
import LoginForm from '../../components/Login/Form';
import './LoginPage.css'

const LoginPage = () => {
    return (
        <div className='login-page'>
            <div className="navbar-login-page">
                <div className='circle-img'>
                    <img src={alcaldiaImg} alt="Logo Alcaldía" className='alcaldiaImg' />
                </div>
                <p>Alcaldia de Medellin</p>
            </div>
            <div className='login-container'>
                <div className='img-container'>
                    <img src={loginImg} alt="" className='loginImg' />
                </div>
                <LoginForm data-testid='login-form'/>
            </div>
        </div>
    );
}

export default LoginPage;