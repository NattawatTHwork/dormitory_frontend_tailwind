import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import jwtDecode from 'jwt-decode'

const Navbar = () => {
    const [nav, setNav] = useState(false)
    // const [token, setToken] = useState('')
    const [decodedToken, setdecodedToken] = useState('')

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = () => {
        const myToken = localStorage.getItem('token');
        // if (myToken !== null) {
        if (myToken) {
            setdecodedToken(jwtDecode(myToken));
        }
        // if (myToken) {
        //     setToken(myToken);
        // }
    }

    const handleNav = () => (
        setNav(!nav)
    )

    const handleLogout = async () => {
        try {
            setNav(!nav);
            localStorage.removeItem('token')
            window.location = '/signin'
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-black'>
                <h1 className='w-full text-3xl font-bold text-black'>DORMITORY</h1>
                {decodedToken && (decodedToken.role == 3 ?
                    <ul className='hidden lg:flex'>
                        <li className='p-4'><Link href='/'>HOME</Link></li>
                        <li className='p-4'><Link href='/history'>HISTORY</Link></li>
                        <li className='p-4'><button onClick={handleLogout}>LOGOUT</button></li>
                    </ul> :
                    <ul className='hidden lg:flex'>
                        <li className='p-4'><Link href='/admin'>HOME</Link></li>
                        <li className='p-4'><Link href='/admin/paid'>PAID</Link></li>
                        <li className='p-4'><Link href='/admin/unpaid'>UNPAID</Link></li>
                        <li className='p-4'><Link href='/admin/admins'>ADMINS</Link></li>
                        <li className='p-4'><Link href='/admin/users'>USERS</Link></li>
                        <li className='p-4'><Link href='/admin/rooms'>ROOMS</Link></li>
                        <li className='p-4'><Link href='/admin/services'>SERVICES</Link></li>
                        <li className='p-4'><button onClick={handleLogout}>LOGOUT</button></li>
                    </ul>)}
                {decodedToken && (
                    <div>
                        <div onClick={handleNav} className='block lg:hidden'>
                            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                        </div>
                        <div className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-white ease-in-out duration-500' : 'fixed left-[-100%] top-0 h-full w-[60%] ease-in-out duration-500'}>
                            {decodedToken.role == 3 ?
                                <ul className='uppercase p-4'>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/' onClick={handleNav}>HOME</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/history' onClick={handleNav}>HISTORY</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><button onClick={handleLogout}>LOGOUT</button></li>
                                </ul> :
                                <ul className='uppercase p-4'>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/' onClick={handleNav}>HOME</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/admin/paid' onClick={handleNav}>PAID</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/admin/unpaid' onClick={handleNav}>UNPAID</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/admin/admins' onClick={handleNav}>ADMINS</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/admin/users' onClick={handleNav}>USERS</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/admin/rooms' onClick={handleNav}>ROOMS</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><Link href='/admin/services' onClick={handleNav}>SERVICES</Link></li>
                                    <li className='p-4 border-b border-gray-600 text-center'><button onClick={handleLogout}>LOGOUT</button></li>
                                </ul>
                            }
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Navbar