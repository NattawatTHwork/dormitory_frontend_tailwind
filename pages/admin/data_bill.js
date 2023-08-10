import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';

const data_admin = () => {
    const router = useRouter();
    const { id } = router.query;
    const [bill, setBill] = useState([]);

    useEffect(() => {
        checkLogin();
        fetchBill();
    }, []);
    
    const convertTime = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fetchBill = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.API_URL}/bills/detail/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setBill(result.message);
            } else {
                console.log('fetch data admin failed')
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
                            <td className="px-6 py-4 whitespace-nowrap">Bill Number</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.bill_number}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Date Create</td>
                            <td className="px-6 py-4 whitespace-nowrap">{convertTime(bill.date_check_bill)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Room</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.name_room}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">User</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.first_name+' '+bill.last_name}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Monthly</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.monthly}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Price</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.price}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Common Area</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.common_area_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Electricity Amount</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.electricity_amount}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Electricity Fee</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.electricity_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Electricity Total</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.electricity_amount*bill.electricity_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Water Amount</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.water_amount}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Water Fee</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.water_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Water Total</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.water_amount*bill.water_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Maintenance</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.maintenance_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Total Price</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bill.price + (bill.electricity_amount * bill.electricity_fee) + (bill.water_amount * bill.water_fee) + bill.maintenance_fee + bill.common_area_fee}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Status</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`${bill.bill_status == 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded text-white`}>
                                    {bill.bill_status == 1 ? 'Paid' : 'Unpaid'}
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