import { useState, useEffect } from 'react';
import { checkLogin } from '../../components/checkLoginAdmin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const invoice = () => {

    return (
        <>
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-3xl font-semibold mb-6">Create Bill</h1>
                <form onSubmit={handleSubmit} className="w-[80%]">
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
                                        {mymonth}
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
                            Common Area:
                        </label>
                        <input
                            type="text"
                            name="common_area_fee"
                            value={formCreate.common_area_fee}
                            className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Total Price:
                        </label>
                        <input
                            type="text"
                            name="total_price"
                            value={formCreate.price + (formCreate.electricity_amount * formCreate.electricity_fee) + (formCreate.water_amount * formCreate.water_fee) + formCreate.maintenance_fee + formCreate.common_area_fee}
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