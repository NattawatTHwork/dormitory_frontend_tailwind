import { useEffect, useState, useRef } from 'react';
import { checkLogin } from '../components/checkLoginUser';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [unpaid, setunPaid] = useState([]);
  const [dropdownStates, setDropdownStates] = useState([]);
  const dropdownRefs = useRef([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const user = await checkLogin();
      if (user) {
        fetchBill(user.user_id);
      }
    };
    fetchData();
    hideDropDown();
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

  const hideDropDown = () => {
    const handleClickOutside = (e) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(e.target)) {
          setDropdownStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = false;
            return newStates;
          });
        }
      });
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  };

  const handleDropDown = (index) => {
    setDropdownStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
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

  const handleViewData = (bill_id) => {
    router.push({
      pathname: '/data_bill',
      query: { id: bill_id },
    });
  }

  const handlePay = (bill_id) => {
    router.push({
      pathname: '/pay',
      query: { id: bill_id },
    });
  }

  const onPageChange = newPage => {
    setCurrentPage(newPage);
  };

  const filteredunPaid = unpaid.filter(unpaid =>
    unpaid.name_room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unpaid.monthly.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFilteredItems = filteredunPaid.length;
  const totalFilteredPages = Math.ceil(totalFilteredItems / 10);
  const indexOfLastFilteredItem = currentPage * 10;
  const indexOfFirstFilteredItem = indexOfLastFilteredItem - 10;
  const currentFilteredItems = filteredunPaid.slice(indexOfFirstFilteredItem, indexOfLastFilteredItem);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-end my-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>
        <table className="min-w-full text-center">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">ROOM</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">DATE CREATE</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">MONTHLY</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">TOTAL PRICE</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {currentFilteredItems.map((myunpaid, index) => (
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
                  <button
                    ref={(ref) => (dropdownRefs.current[index] = ref)}
                    onClick={() => handleDropDown(index)}
                    type="button"
                    className="px-4 py-2 border rounded font-medium text-gray-600 transition duration-150 ease-in-out hover:text-gray-800 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800"
                  >
                    Option
                  </button>
                  {dropdownStates[index] && (
                    <div className="flex justify-center">
                      <div className="origin-top-right absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={() => handleViewData(myunpaid.bill_id)}
                          >
                            View Data
                          </a>
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={() => handlePay(myunpaid.bill_id)}
                          >
                            Pay
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <div className='flex justify-end my-2'>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-300"
            >
              Previous Page
            </button>
            <button
              disabled={indexOfLastFilteredItem >= totalFilteredItems}
              onClick={() => onPageChange(currentPage + 1)}
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-300"
            >
              Next Page
            </button>
          </div>
          <div className='flex justify-end my-2'>
            <p className="mt-2">
              Page {currentPage} of {totalFilteredPages}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
