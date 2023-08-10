import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';

const data_user = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState([]);

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
                setUser(result.message);
            } else {
                console.log('fetch data user failed')
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
                            <td className="px-6 py-4 whitespace-nowrap">Name</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.first_name + ' ' + user.last_name}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Username</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Password</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.password_view}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Status</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`${user.status == 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded text-white`}>
                                    {user.status == 1 ? 'Enable' : 'Disable'}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </>

    )
}

export default data_user