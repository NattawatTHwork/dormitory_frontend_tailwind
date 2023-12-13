import { useState, useEffect, useRef } from 'react';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const rooms = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [dropdownStates, setDropdownStates] = useState([]);
    const dropdownRefs = useRef([]);
    const [room_id, setRoomID] = useState(null);
    const [status, setStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        checkLogin();
        fetchRooms();
        hideDropDown();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.API_URL + '/rooms/room', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setRooms(result.message);
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

    const openModal = (room_id, status) => {
        setRoomID(room_id);
        setStatus(status)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setRoomID(null);
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

            const response = await fetch(`${process.env.API_URL}/rooms/change_status/${room_id}`, {
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
                fetchRooms()
            } else {
                console.error('update status failed');
            }
        } catch (error) {
            console.error('update status failed', error);
        }
    }

    const handleViewData = (room_id) => {
        router.push({
            pathname: '/admin/data_room',
            query: { id: room_id },
        });
    }

    const handleEditData = (room_id) => {
        router.push({
            pathname: '/admin/edit_data_room',
            query: { id: room_id },
        });
    }

    const handleDelete = async (room_id) => {
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

                    const response = await fetch(`${process.env.API_URL}/rooms/${room_id}`, {
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
                        fetchRooms()
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
        router.push('/admin/create_room');
    }

    const onPageChange = newPage => {
        setCurrentPage(newPage);
    };

    const filteredRooms = rooms.filter(room =>
        room.name_room.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalFilteredItems = filteredRooms.length;
    const totalFilteredPages = Math.ceil(totalFilteredItems / 10);
    const indexOfLastFilteredItem = currentPage * 10;
    const indexOfFirstFilteredItem = indexOfLastFilteredItem - 10;
    const currentFilteredItems = filteredRooms.slice(indexOfFirstFilteredItem, indexOfLastFilteredItem);


    return (
        <>
            <div className="container mx-auto p-4">
                <div className='flex justify-end my-2'>
                    <button onClick={handleCreate} className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                        Create Room
                    </button>
                </div>

                <div className="flex justify-end my-2">
                    <input
                        type="text"
                        placeholder="Search by room..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300"
                    />
                </div>

                <table className="min-w-full text-center">
                    <thead>
                        <tr>
                            {/* <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">No</th> */}
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/2">ROOM</th>
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">STATUS</th>
                            <th className="px-6 py-3 bg-gray-100 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentFilteredItems.map((room, index) => (
                            <tr key={room.room_id}>
                                {/* <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap">{room.name_room}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`${room.status === 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded text-white`}>
                                        {room.status === 1 ? 'Enable' : 'Disable'}
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
                                                        onClick={() => openModal(room.room_id, room.status)}
                                                    >
                                                        Change Status
                                                    </a>
                                                    <a
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        role="menuitem"
                                                        onClick={() => handleEditData(room.room_id)}
                                                    >
                                                        Edit Data
                                                    </a>
                                                    <a
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        role="menuitem"
                                                        onClick={() => handleViewData(room.room_id)}
                                                    >
                                                        View Data
                                                    </a>
                                                    <a
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        role="menuitem"
                                                        onClick={() => handleDelete(room.room_id)}
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
    )
}

export default rooms