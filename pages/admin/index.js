import { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';

const index = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        checkLogin();
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(process.env.API_URL + '/rooms/room_user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setRooms(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = (room_id) => {
        router.push({
            pathname: '/admin/room',
            query: { id: room_id },
        });
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {rooms.map((room) => (room.room_status == 1 && (
                        <div className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 hover:shadow-xl h-[80px]" key={room.room_id} onClick={() => handleClick(room.room_id)}>
                            <h2 className="text-lg font-semibold">{room.name_room}</h2>
                            <h5>{room.first_name && (room.first_name + ' ' + room.last_name)}</h5>
                        </div>
                    )))}
                </div>
            </div>
        </>
    )
}

export default index