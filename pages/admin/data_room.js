import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';

const data_admin = () => {
    const router = useRouter();
    const { id } = router.query;
    const [room, setRoom] = useState([]);

    useEffect(() => {
        checkLogin();
        fetchRoom();
    }, []);

    const fetchRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.API_URL}/rooms/room/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setRoom(result.message);
            } else {
                console.log('fetch data room failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <table className="min-w-full text-center">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-600 uppercase tracking-wider">LIST</th>
                            <th className="px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-600 uppercase tracking-wider">DESCRIPTION</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Room</td>
                            <td className="px-6 py-4 whitespace-nowrap">{room.name_room}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Price</td>
                            <td className="px-6 py-4 whitespace-nowrap">{room.price}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Status</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`${room.status == 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded text-white`}>
                                    {room.status == 1 ? 'Enable' : 'Disable'}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </>

    )
}

export default data_admin