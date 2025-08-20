import './Navbar.css';
import AlcaldiaLogo from '../../assets/alcaldia.png'
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/Auth';

interface Route{
    name: string;
    path: string;
    isActive: boolean;
}

interface NavbarProps {
    routes: Route[];
}

const Navbar = ({ routes }: NavbarProps) => {
    const { logout } = useAuth();

    return (
        <div className="navbar">
            <div className="logo">
                <img className='image' src={AlcaldiaLogo} alt="Logo Alcaldía de Medellín" />
            </div>
            <div className='menu'>
                {routes.map((route) => (
                    <Link to={route.path} className={'menu-option '+ (route.isActive ? 'active' : '')} key={route.name}>
                        {route.name}
                    </Link>
                ))}
            </div>
            <div className='logout'>
                <button className="logout-button" onClick={logout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Navbar;
