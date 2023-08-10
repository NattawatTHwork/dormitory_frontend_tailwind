import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';

const edit_service = () => {
    const [service, setService] = useState('')

    useEffect(() => {
        checkLogin();
        fetchService();
    }, []);

    const fetchService = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.API_URL}/services/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setService(result.message);
            } else {
                console.log('fetch data service failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setService((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.API_URL}/services`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(service)
            });

            const result = await response.json();

            if (result.status == 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Services update successfuly',
                    text: 'You have been registered successfully.',
                });
                fetchService()
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
                <h1 className="text-3xl font-semibold mb-6">Edit Services</h1>
                <form onSubmit={handleSubmit} className="w-80">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Electricity Fee:
                        </label>
                        <input
                            type="text"
                            name="electricity_fee"
                            value={service.electricity_fee}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Water Fee:
                        </label>
                        <input
                            type="text"
                            name="water_fee"
                            value={service.water_fee}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Common Area Fee:
                        </label>
                        <input
                            type="text"
                            name="common_area_fee"
                            value={service.common_area_fee}
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
        </>)
}

export default edit_service