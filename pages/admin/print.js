import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLoginAdmin';

const print = () => {
    const router = useRouter();
    const { id } = router.query;
    const [bill, setBill] = useState([]);

    useEffect(() => {
        checkLogin();
        fetchBill();
    }, []);

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

    const handlePrint = () => {
        window.print();
    };    

    return (
        <>
            <div className='container mx-auto p-4'>
                <div className='text-center text-3xl font-bold mb-4'>Invoice</div>
                <div className='flex items-center justify-center mb-4'>
                    <span className='text-xl mr-10'>Monthly : {bill.monthly}</span>
                    <span className=''>(Payment is due on the 10th of every following month.)</span>
                </div>
                <table className='min-w-full text-center border-collapse'>
                    <thead>
                        <tr>
                            <th className='border-2 p-2 w-1/12'>No</th>
                            <th className='border-2 p-2 w-5/12'>List</th>
                            <th className='border-2 p-2 w-2/12'>Count</th>
                            <th className='border-2 p-2 w-2/12'>Price/Unit</th>
                            <th className='border-2 p-2 w-2/12'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='border-l-2 border-r-2 p-2'>1</td>
                            <td className='border-r-2 p-2'>Room Price</td>
                            <td className='border-r-2 p-2'>1</td>
                            <td className='border-r-2 p-2'>{bill.price}</td>
                            <td className='border-r-2 p-2'>{bill.price}</td>
                        </tr>
                        <tr>
                            <td className='border-l-2 border-r-2 p-2'>2</td>
                            <td className='border-r-2 p-2'>Electricity</td>
                            <td className='border-r-2 p-2'>{bill.electricity_amount}</td>
                            <td className='border-r-2 p-2'>{bill.electricity_fee}</td>
                            <td className='border-r-2 p-2'>{bill.electricity_amount * bill.electricity_fee}</td>
                        </tr>
                        <tr>
                            <td className='border-l-2 border-r-2 p-2'>3</td>
                            <td className='border-r-2 p-2'>Water</td>
                            <td className='border-r-2 p-2'>{bill.water_amount}</td>
                            <td className='border-r-2 p-2'>{bill.water_fee}</td>
                            <td className='border-r-2 p-2'>{bill.water_amount * bill.water_fee}</td>
                        </tr>
                        <tr>
                            <td className='border-l-2 border-r-2 p-2'>4</td>
                            <td className='border-r-2 p-2'>Common Area</td>
                            <td className='border-r-2 p-2'>1</td>
                            <td className='border-r-2 p-2'>{bill.common_area_fee}</td>
                            <td className='border-r-2 p-2'>{bill.common_area_fee}</td>
                        </tr>
                        <tr>
                            <td className='border-l-2 border-r-2 border-b-2 p-2'>5</td>
                            <td className='border-r-2 border-b-2 p-2'>Maintenance</td>
                            <td className='border-r-2 border-b-2 p-2'>1</td>
                            <td className='border-r-2 border-b-2 p-2'>{bill.maintenance_fee}</td>
                            <td className='border-r-2 border-b-2 p-2'>{bill.maintenance_fee}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th className='border-2 p-2' colSpan={4}>Total Price</th>
                            <th className='border-2 p-2'>{bill.price + (bill.electricity_amount * bill.electricity_fee) + (bill.water_amount * bill.water_fee) + bill.maintenance_fee + bill.common_area_fee}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="text-center mt-4">
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Print
                </button>
            </div>
        </>
    )
}

export default print