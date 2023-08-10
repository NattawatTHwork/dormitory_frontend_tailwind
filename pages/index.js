import { useEffect, useState, useRef } from 'react';
import { checkLogin } from '../components/checkLoginUser';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [unpaid, setunPaid] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await checkLogin();
      if (user) {
        fetchBill(user.user_id);
      }
    };
    fetchData();
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

  const fetchBill = async (user_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.API_URL}/bills/unpaid/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      const result = await response.json();

      if (result.status == 'success') {
        setunPaid(result.message);
      } else {
        console.log('fetch data admin failed')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = () => {
    router.push('/data_bill');
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <table className="min-w-full text-center">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">ROOM</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">DATE CREATE</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">MONTHLY</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">TOTAL PRICE</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">VIEW</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {unpaid.map((myunpaid, index) => (
              <tr key={myunpaid.room_id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{myunpaid.name_room}</td>
                <td className="px-6 py-4 whitespace-nowrap">{convertTime(myunpaid.date_check_bill)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{myunpaid.monthly}</td>
                <td className="px-6 py-4 whitespace-nowrap">{myunpaid.price + (myunpaid.electricity_amount * myunpaid.electricity_fee) + (myunpaid.water_amount * myunpaid.water_fee) + myunpaid.maintenance_fee + myunpaid.common_area_fee}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${myunpaid.bill_status === 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded text-white`}>
                    {myunpaid.bill_status === 1 ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={handleView} className='px-4 py-2 border rounded font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-800 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800'>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

}
