import { useEffect, useState } from "react";
import { API_URL } from "../config/consts";

export const useRequest = ()=>{
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_URL}/solicitudes/all`);  
                const data = await response.json();
                setRequests(data.data || []); 
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar las solicitudes', error);
                setLoading(false);
            }
        };

        fetchRequests();

        // Refresca las solicitudes cada 5 segundos
        const interval = setInterval(() => {
            fetchRequests(); 
        }, 60000 * 5); 

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    return {requests, loading};
}