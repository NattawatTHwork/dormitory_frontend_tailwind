import { useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { checkLogin } from '../components/checkLogin';

const signin = () => {
    const [formSignin, setFormSignin] = useState({
        username: '',
        password: ''
    })

    useEffect(() => {
        checkLogin();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.API_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formSignin),
            });

            const result = await response.json();

            if (result.status === 'success') {
                localStorage.setItem('token', result.token);
                if (result.message === 1) {
                    window.location = '/admin'
                } else if (result.message === 2) {
                    window.location = '/admin'
                } else if (result.message === 3) {
                    window.location = '/'
                }
            } else if (result.status == 'nofound') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This account does not exist in the system.',
                });
            } else if (result.status == 'disable') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This account disable.',
                });
            } else if (result.status == 'failed') {
                await Swal.fire({
                    icon: 'error',
                    title: result.message,
                    text: 'This password is incorrect.',
                });
            } else {
                alert('Login Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <div className='max-w-[700px] mx-auto my-16 p-4'>
                <div>
                    <h1 className='text-2xl font-bold py-2'>Sign in to your account</h1>
                    <p className='py-2'>
                        Don't have an account yet?{' '}
                        <Link href='/signup' className='underline'>
                            Sign up.
                        </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col py-2'>
                        <label className='py-2 font-medium'>Username</label>
                        <input onChange={(e) => setFormSignin(prevState => ({ ...prevState, username: e.target.value }))} className='border p-3 rounded' type='text' />
                    </div>
                    <div className='flex flex-col py-2'>
                        <label className='py-2 font-medium'>Password</label>
                        <input onChange={(e) => setFormSignin(prevState => ({ ...prevState, password: e.target.value }))} className='border p-3 rounded' type='password' />
                    </div>
                    <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white rounded'>
                        Sign In
                    </button>
                    <div className='text-right'>
                        <Link href='/reset' className='underline'>Reset Password</Link>
                    </div>
                </form>
            </div>

        </>
    )
}

export default signin