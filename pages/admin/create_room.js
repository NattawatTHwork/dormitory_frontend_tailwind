import { useState, useEffect } from 'react';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const create_admin = () => {
    const router = useRouter();
    const [formCreate, setFormCreate] = useState({
        name_room: '',
        price: ''
    });

    useEffect(() => {
        checkLogin();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormCreate((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(process.env.API_URL + '/rooms/create_room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formCreate)
            });

            const result = await response.json();

            if (result.status == 'success') {
                setFormCreate({
                    name_room: '',
                    price: ''
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Room was created successfully',
                    text: 'Room has been created successfully.',
                });
                router.push('/admin/rooms');
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Room create failed',
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
                <h1 className="text-3xl font-semibold mb-6">Create Room</h1>
                <form onSubmit={handleSubmit} className="w-80">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Room:
                        </label>
                        <input
                            type="text"
                            name="name_room"
                            value={formCreate.name_room}
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
                            value={formCreate.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:ring-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Create
                    </button>
                </form>
            </div>
        </>
    );
};

export default create_admin;
