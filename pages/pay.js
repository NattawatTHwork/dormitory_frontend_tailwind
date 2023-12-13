import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../components/checkLoginUser';
import jwtDecode from 'jwt-decode'
import Swal from 'sweetalert2';

const pay = () => {
    const router = useRouter();
    const { id } = router.query;
    const [bill, setBill] = useState([]);
    const [file, setFile] = useState(null);

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

            const decode = jwtDecode(token)

            if (result.message.user_id != decode.user_id) {
                router.push('/');
            }

            if (result.status == 'success') {
                setBill(result.message);
            } else {
                console.log('fetch data admin failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('bill_id', id);

            const response = await fetch(`${process.env.API_URL}/uploads`, {
                method: 'POST',
                body: formData,
            })

            const result = await response.json();
            console.log(result);
            if (result.status == 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Upload Success',
                    text: 'You have successfully uploaded your image.',
                });
                setFile(null);
                fetchBill();
            } else if (result.status == 'nofile') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'You did not select an image to upload.',
                });
            } else if (result.status == 'error') {
                await Swal.fire({
                    icon: 'error',
                    title: 'Registration successful',
                    text: 'You failed to upload a image.',
                });
            }
        } else {
            console.error('No file selected.');
        }
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="flex justify-center h-screen">
                    <div className="bg-white rounded-lg shadow-md p-10 hover:shadow-xl h-[700px] w-[60%]">
                        <h1 className="text-center text-2xl font-bold">{bill.bill_number}</h1>
                        <h1 className="text-lg font-semibold">User : {bill.first_name + ' ' + bill.last_name}</h1>
                        <h1 className="text-lg font-semibold">Monthly : {bill.monthly}</h1>
                        <h1 className="text-lg font-semibold">Total Price : {bill.price + (bill.electricity_amount * bill.electricity_fee) + (bill.water_amount * bill.water_fee) + bill.maintenance_fee + bill.common_area_fee}</h1>
                        <div className="flex justify-center">
                            <img src="/QR.png" alt="QR Code" />
                        </div>
                        {bill.img_path ? (
                            <h1 className="text-lg text-green-500 font-semibold text-center">The receipt has been sent.</h1>
                        ) : (
                            <h1 className="text-lg text-red-500 font-semibold text-center">The receipt has not been sent yet.</h1>
                        )}
                        <div className="flex justify-center mt-4 p-4">
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={handleUpload} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mx-1">
                                {bill.img_path ? 'UPLOAD AGAIN' : 'UPLOAD'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default pay