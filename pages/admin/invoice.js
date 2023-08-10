import { useState, useEffect } from 'react';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const invoice = () => {
    const router = useRouter();
    const { id } = router.query;
    const months = [...Array(12)].map((_, index) => index + 1);
    const years = [...Array(2043 - 2023 + 1)].map((_, index) => 2023 + index);
    const [month, setMonth] = useState(months[0])
    const [year, setYear] = useState(years[0])
    const name_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [formCreate, setFormCreate] = useState({
        user_id: '',
        name_room: '',
        monthly: '',
        price: '',
        electricity_fee: '',
        electricity_amount: '',
        water_fee: '',
        water_amount: '',
        common_area_fee: '',
        maintenance_fee: ''
    });
    const [name, setName] = useState({
        first_name: '',
        last_name: ''
    })
    console.log(formCreate)

    useEffect(() => {
        checkLogin();
        fetchRooms();
        fetchService();
        setFormCreate((prevForm) => ({
            ...prevForm,
            monthly: month + '/' + year,
        }));
    }, [month, year]);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.API_URL}/rooms/room_user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setFormCreate((prevForm) => ({
                    ...prevForm,
                    user_id: result.message.user_id,
                    name_room: result.message.name_room,
                    price: result.message.price,
                }));
                setName((prevForm) => ({
                    ...prevForm,
                    first_name: result.message.first_name,
                    last_name: result.message.last_name
                }))
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                setFormCreate((prevForm) => ({
                    ...prevForm,
                    electricity_fee: result.message.electricity_fee,
                    water_fee: result.message.water_fee,
                    common_area_fee: result.message.common_area_fee
                }));
            } else {
                console.log('fetch data service failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

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

            const response = await fetch(`${process.env.API_URL}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formCreate)
            });

            const result = await response.json();

            if (result.status == 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Registration successful',
                    text: 'You have been registered successfully.',
                });
                router.push('/admin/unpaid');
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
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-3xl font-semibold mb-6">Create Bill</h1>
                <div className="bg-white rounded-lg shadow-md p-10 hover:shadow-xl h-[200px] w-[60%]">
                    <h1 className="text-center text-2xl font-bold">{formCreate.name_room}</h1>
                    <h1 className="text-lg font-semibold">Price : {formCreate.price}</h1>
                    <h1 className="text-lg font-semibold">Common Area Fee : {formCreate.common_area_fee}</h1>
                    <h1 className="text-lg font-semibold">User : {name.first_name ? name.first_name + ' ' + name.last_name : 'No User'}</h1>
                </div>
                <form onSubmit={handleSubmit} className="w-[80%] p-20">
                    <div className="flex flex-col md:flex-row md:space-x-2 mb-4">
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Month:
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                {months.map((mymonth) => (
                                    <option key={mymonth} value={mymonth}>
                                        {name_months[mymonth - 1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Year:
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                {years.map((myyear) => (
                                    <option key={myyear} value={myyear}>
                                        {myyear}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-2 mb-4">
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Electricity Amount:
                            </label>
                            <input
                                type="text"
                                name="electricity_amount"
                                value={formCreate.electricity_amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Electricity Fee:
                            </label>
                            <input
                                type="text"
                                name="electricity_fee"
                                value={formCreate.electricity_fee}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                disabled
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Electricity Total:
                            </label>
                            <input
                                type="text"
                                name="electricity_total"
                                value={formCreate.electricity_amount * formCreate.electricity_fee}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-2 mb-4">
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Water Amount:
                            </label>
                            <input
                                type="text"
                                name="water_amount"
                                value={formCreate.water_amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Water Fee:
                            </label>
                            <input
                                type="text"
                                name="water_fee"
                                value={formCreate.water_fee}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                disabled
                            />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Water Total:
                            </label>
                            <input
                                type="text"
                                name="water_total"
                                value={formCreate.water_amount * formCreate.water_fee}
                                className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Maintenance:
                        </label>
                        <input
                            type="text"
                            name="maintenance_fee"
                            value={formCreate.maintenance_fee}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Total Price:
                        </label>
                        <input
                            type="text"
                            name="total_price"
                            value={Number(formCreate.price) + (formCreate.electricity_amount * formCreate.electricity_fee) + (formCreate.water_amount * formCreate.water_fee) + Number(formCreate.maintenance_fee) + Number(formCreate.common_area_fee)}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            disabled
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
    )
}

export default invoice