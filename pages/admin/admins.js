import { useState, useEffect, useRef } from 'react';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const Admins = () => {
    const router = useRouter();
    const [admins, setAdmins] = useState([]);
    const [dropdownStates, setDropdownStates] = useState([]);
    const dropdownRefs = useRef([]);
    const [user_id, setUserID] = useState(null);
    const [status, setStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        checkLogin();
        fetchAdmins();
        hideDropDown();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.API_URL + '/users/admins', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setAdmins(result.message);
                setDropdownStates(result.message.map(() => false));
            } else {
                console.log('fetch data admin failed')
            }
        } catch (error) {
            console.log(error);
        }
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

    const openModal = (user_id, status) => {
        setUserID(user_id);
        setStatus(status)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setUserID(null);
        setStatus(null);
        setIsModalOpen(false);
    };

    const handleSubmitStatus = async () => {
        setIsModalOpen(false);

        try {
            const token = localStorage.getItem('token');

            const data = {
                status: status,
            }

            const response = await fetch(`${process.env.API_URL}/users/change_status/${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status == 'success') {
                setIsModalOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Update status successfully.'
                });
                fetchAdmins()
            } else {
                console.error('update status failed');
            }
        } catch (error) {
            console.error('update status failed', error);
        }
    }

    const handleViewData = (user_id) => {
        router.push({
            pathname: '/admin/data_admin',
            query: { id: user_id },
        });
    }

    const handleEditData = (user_id) => {
        router.push({
            pathname: '/admin/edit_data_admin',
            query: { id: user_id },
        });
    }

    const handleDelete = async (user_id) => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure you want to delete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');

                    const response = await fetch(`${process.env.API_URL}/users/${user_id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token,
                        },
                    });

                    const jsonData = await response.json();

                    if (jsonData.status == 'success') {
                        console.log('Data deleted successfully.');
                        Swal.fire('Deleted!',
                            'Data deleted successfully.',
                            'success');
                        fetchAdmins()
                    } else {
                        console.log('Failed to delete data.');
                        Swal.fire('Error!',
                            'Failed to delete the data.',
                            'error');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const handleCreate = () => {
        router.push('/admin/create_admin');
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <div className='flex justify-end my-2'>
                    <button onClick={handleCreate} className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                        Create Admin
                    </button>
                </div>

                <table className="min-w-full text-center">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">NAME</th>
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin, index) => (
                            <tr key={admin.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{admin.first_name + ' ' + admin.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`${admin.status === 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded text-white`}>
                                        {admin.status === 1 ? 'Enable' : 'Disable'}
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
                                                        onClick={() => openModal(admin.user_id, admin.status)}
                                                    >
                                                        Change Status
                                                    </a>
                                                    <a
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        role="menuitem"
                                                        onClick={() => handleEditData(admin.user_id)}
                                                    >
                                                        Edit Data
                                                    </a>
                                                    <a
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        role="menuitem"
                                                        onClick={() => handleViewData(admin.user_id)}
                                                    >
                                                        View Data
                                                    </a>
                                                    <a
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        role="menuitem"
                                                        onClick={() => handleDelete(admin.user_id)}
                                                    >
                                                        Delete
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
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black opacity-50 fixed inset-0"></div>
                    <div className="bg-white p-6 rounded shadow-md relative w-[50%]">
                        <h2 className="text-lg font-semibold mb-4">Change Status</h2>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300">
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 hover:text-gray-100 transition duration-150 ease-in-out"
                                onClick={handleSubmitStatus}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 hover:text-gray-800 transition duration-150 ease-in-out"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Admins;