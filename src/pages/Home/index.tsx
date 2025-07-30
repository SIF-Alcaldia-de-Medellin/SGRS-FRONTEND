import "./HomePage.css";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../providers/Auth";
import { Outlet } from "react-router-dom";

const HomePage = () => {
    const { user } = useAuth();
    const routesAdmin = [
        {
            name:'Solicitudes', 
            path: '/', 
            isActive: true
        }
    ];

    const routesDefault = [
        {
            name:'Mis Solicitudes', 
            path: '/', 
            isActive: true
        }
    ]

    return (
        <div className="content">
            <Navbar routes={user?.role === 'admin' ? routesAdmin : routesDefault}/>
            <Outlet />
        </div>
    )
}

export default HomePage;