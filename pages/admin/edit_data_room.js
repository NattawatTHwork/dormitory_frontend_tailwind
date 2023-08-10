import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';

const edit_data_admin = () => {
    const router = useRouter();
    const { id } = router.query;
    const [formRoom, setFormRoom] = useState([]);

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
                setFormRoom(result.message);
            } else {
                console.log('fetch data room failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormRoom((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.API_URL}/rooms/edit_room/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formRoom)
            });

            const result = await response.json();

            if (result.status == 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Registration successful',
                    text: 'You have been registered successfully.',
                });
                fetchRoom()
            } else if (result.status === 'exists') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'Please use another username that has not been registered yet.',
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text: 'There was an error during registration.',
                });
            }
        } catch (error) {
            console.error('Form submission error', error);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center mt-10 pb-20">
                <h1 className="text-3xl font-semibold mb-6">Edit Room</h1>
                <form onSubmit={handleSubmit} className="w-80">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Room:
                        </label>
                        <input
                            type="text"
                            name="name_room"
                            value={formRoom.name_room}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Price:
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formRoom.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:ring-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Update
                    </button>
                </form>
            </div>
        </>
    )
}

export default edit_data_admin