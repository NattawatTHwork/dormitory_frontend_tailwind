import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import Select from 'react-select';

const room = () => {
    const router = useRouter();
    const { id } = router.query;
    const [room, setRoom] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [room_id, setRoomID] = useState(null);
    const [user_id, setUserID] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        checkLogin();
        fetchRooms();
        fetchUsers();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.API_URL}/rooms/room_user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setRoom(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.API_URL + '/users/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                const userOptions = result.message.map((user) => ({
                    value: user.user_id,
                    label: user.first_name + ' ' + user.last_name,
                }));
                setUsers(userOptions);
            } else {
                console.log('fetch data admin failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const openModal = (room_id, user_id) => {
        setRoomID(room_id);
        setUserID(user_id)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setRoomID(null);
        setUserID(null);
        setIsModalOpen(false);
    };

    const handleSubmitStatus = async () => {
        setIsModalOpen(false);

        try {
            const token = localStorage.getItem('token');

            const data = {
                user_id: user_id,
            }

            const response = await fetch(`${process.env.API_URL}/rooms/manage_user/${room_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status == 'success') {
                setIsModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Update status successfully.'
                });
                fetchRooms()
            } else {
                console.error('update status failed');
            }
        } catch (error) {
            console.error('update status failed', error);
        }
    }

    const handleInvoice = (room_id) => {
        router.push({
            pathname: '/admin/invoice',
            query: { id: room_id },
        });
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="flex justify-center h-screen">
                    <div className="bg-white rounded-lg shadow-md p-10 hover:shadow-xl h-[150px] w-[60%]">
                        <h1 className="text-center text-2xl font-bold">{room.name_room}</h1>
                        <h1 className="text-lg font-semibold">Price : {room.price}</h1>
                        <h1 className="text-lg font-semibold">User : {room.first_name ? room.first_name + ' ' + room.last_name : 'No User'}</h1>
                        <div className="flex justify-center mt-4 p-4">
                            <button onClick={() => openModal(room.room_id, room.user_id)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mx-1">
                                Manage User
                            </button>
                            <button onClick={() => handleInvoice(room.room_id)} className={`flex-1 text-white font-semibold py-2 px-4 rounded-lg mx-1 ${!room.first_name ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`} disabled={!room.first_name}>
                                Issue Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black opacity-50 fixed inset-0"></div>
                    <div className="bg-white p-6 rounded shadow-md relative w-[50%]">
                        <h2 className="text-lg font-semibold mb-4">Manage User</h2>
                        <Select
                            defaultValue={{ value: room.user_id, label: room.first_name && (room.first_name + ' ' + room.last_name) }}
                            onChange={(e) => setUserID(e.value)}
                            options={users}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 hover:text-gray-100 transition duration-150 ease-in-out"
                                onClick={handleSubmitStatus}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 hover:text-gray-800 transition duration-150 ease-in-out"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default room