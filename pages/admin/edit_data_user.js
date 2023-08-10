import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';

const edit_data_admin = () => {
    const router = useRouter();
    const { id } = router.query;
    const [formUser, setFormUser] = useState([]);

    useEffect(() => {
        checkLogin();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.API_URL}/users/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                const updatedFormUser = {
                    ...result.message,
                    password: result.message.password_view,
                    repeatpassword: result.message.password_view
                };

                delete updatedFormUser.password_view;

                setFormUser(updatedFormUser);
            } else {
                console.log('fetch data user failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormUser((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formUser.password !== formUser.repeatpassword) {
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match!',
                text: 'Please make sure your passwords match.',
            });
            return;
        }
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.API_URL}/users/edit_user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formUser)
            });

            const result = await response.json();

            if (result.status == 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Registration successful',
                    text: 'You have been registered successfully.',
                });
                fetchUser()
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
                <h1 className="text-3xl font-semibold mb-6">Edit User</h1>
                <form onSubmit={handleSubmit} className="w-80">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            First Name:
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={formUser.first_name}
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
                            value={formUser.last_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            E-mail:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formUser.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Phone Number:
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formUser.phone}
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
                            value={formUser.username}
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
                            value={formUser.password}
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
                            value={formUser.repeatpassword}
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