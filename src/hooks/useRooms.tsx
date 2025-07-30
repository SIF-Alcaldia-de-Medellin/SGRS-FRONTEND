import { useEffect, useState } from "react";
import { fetchRoomsAvailable } from "../utils/fetchRoomsAvailable";
import { fetchSchedulesAvailable } from "../utils/fetchSchedulesAvailable";
import { Request, Room } from "../types";

export const useRooms = (request: Request): [never[], never[], boolean] => {
    const [roomsAvailable, setRoomsAvailable] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [rangesAvailable, setRangesAvailable] = useState([]);

    useEffect(() => {
        const loadSalas = async () => {
            try {
                const rooms = await fetchRoomsAvailable(request); 
                setRoomsAvailable(rooms);
        
                const intervalos = await fetchSchedulesAvailable(request); // Llama al hook para obtener horarios
                const salonesConIntervalos = intervalos.map((room: Room) => {
                if (!room.intervalos || room.intervalos.length === 0) {
                    room.estado = 0;  
                }
                return room;
                });
                setRangesAvailable(salonesConIntervalos); 
            } catch (error) {
                console.error('Error al cargar salas o intervalos:', error); 
            } finally {
                setLoading(false);
            }
        };
    
        loadSalas(); 
    }, [request]); 

    return [roomsAvailable, rangesAvailable, loading]
}