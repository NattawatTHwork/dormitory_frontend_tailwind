import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router';
import { checkLogin } from '../../components/checkLogin';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const admins = () => {
    const [admins, setAdmins] = useState([])

    useEffect(() => {
        checkLogin();
        fetchAdmins();
    }, []);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }

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
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`${admin.status == 1 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded-lg text-white`}>{admin.status == 1 ? 'Enable' : 'Disable'}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                Options
                                                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </Menu.Button>
                                        </div>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                Change Status
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                View Detail
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                Delete
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <form method="POST" action="#">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    type="submit"
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                        'block w-full px-4 py-2 text-left text-sm'
                                                                    )}
                                                                >
                                                                    Sign out
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </form>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default admins