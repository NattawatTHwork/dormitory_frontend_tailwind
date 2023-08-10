import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';

const services = () => {
    const router = useRouter();
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

    const editService = () => {
        router.push('/admin/edit_service');
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <table className="min-w-full text-center">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-600 uppercase tracking-wider">LIST</th>
                            <th className="px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-600 uppercase tracking-wider">VALUE</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Electricity Fee</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className='font-semibold'>{service.electricity_fee}</span> Baht / Unit</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Water Fee</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className='font-semibold'>{service.water_fee}</span> Baht / Unit</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Common Area Fee</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className='font-semibold'>{service.common_area_fee}</span> Baht / Unit</td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    <button onClick={editService} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                        Edit Services Charge
                    </button>
                </div>
            </div>
        </>
    )
}

export default services