import { useState, useEffect } from 'react';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const create_admin = () => {
    const router = useRouter();
    const [formCreate, setFormCreate] = useState({
        username: '',
        password: '',
        repeatpassword: '',
        first_name: '',
        last_name: ''
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

        if (formCreate.password !== formCreate.repeatpassword) {
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match!',
                text: 'Please make sure your passwords match.',
            });
            return;
        }
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(process.env.API_URL + '/users/create_admin', {
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
                    username: '',
                    password: '',
                    repeatpassword: '',
                    first_name: '',
                    last_name: ''
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Registration successful',
                    text: 'You have been registered successfully.',
                });
                router.push('/admin/admins');
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
                <h1 className="text-3xl font-semibold mb-6">Create Admin</h1>
                <form onSubmit={handleSubmit} className="w-80">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            First Name:
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formCreate.first_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Last Name:
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={formCreate.last_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Username:
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formCreate.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Password:
                        </label>
                        <input
                            type="text"
                            name="password"
                            value={formCreate.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Repeat Password:
                        </label>
                        <input
                            type="text"
                            name="repeatpassword"
                            value={formCreate.repeatpassword}
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
