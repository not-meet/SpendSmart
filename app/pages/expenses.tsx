import React from "react";
import { useRouter } from "next/router";

const Expenses = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-200">
      <div className="grid min-h-screen w-full grid-cols-10 grid-rows-10 gap-4 p-5 rounded-lg">
        {/* Navbar */}
        <div className="col-span-10 flex items-center justify-between p-3 rounded-lg shadow-2xl bg-stone-300">
          <div>
            <button
              className="text-black text-lg"
              onClick={() => router.push("/")} // Navigate to home
            >
              Home
            </button>
          </div>
          <div className="text-black text-3xl font-bold">spendSmart</div>
          <div>
            <button className="text-black mr-4">Sign In</button>
            <button className="text-black">Sign Up</button>
          </div>
        </div>

        <div className="col-span-3 row-span-6 rounded-lg bg-[#d2b48c] shadow-2xl"></div>

        {/* Form Section */}
        <div className="col-span-7 row-span-7 bg-[#a38771] rounded-lg p-6 flex shadow-2xl flex-col justify-between">
          {/* Form Inputs */}
          <div>
            <label className="block text-lg text-gray-800 font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              className="w-full p-2 mb-4 border-b border-gray-800 focus:outline-none bg-transparent"
            />
            <label className="block text-lg text-gray-800 font-bold mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              className="w-full p-2 h-24 border-b border-gray-800 focus:outline-none bg-transparent"
            ></textarea>
          </div>

          {/* Amount Input (Bottom Left) */}
          <div className="flex flex-col">
            <label className="text-lg text-gray-800 font-bold mb-2">
              Allocate Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-1/3 p-2 border-b border-gray-800 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Total Monthly Expense Input */}
        <div className="col-span-3 row-span-3 bg-[#cab6a1] rounded-lg shadow-2xl p-4 flex flex-col justify-center">
          <label className="block text-lg text-gray-800 font-bold mb-2">
            Total Monthly Expense
          </label>
          <input
            type="number"
            placeholder="Enter monthly expense"
            className="w-full p-2 border-b border-gray-800 focus:outline-none bg-transparent"
          />
        </div>

        {/* Remaining Money to Allocate */}
        <div className="col-span-4 row-span-2 bg-[#cab6a1] rounded-lg shadow-2xl p-4 flex flex-col justify-center">
          <h2 className="text-lg font-bold">Remaining Money to Allocate</h2>
          <p className="text-xl font-bold text-gray-800">Amount Left: $1000</p>
        </div>

        {/* Save and Exit Button */}
        <div className="col-span-3 row-span-2 flex justify-start items-start">
          <button className="bg-[#a25f4b] text-white font-bold py-6 px-6 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-[#8f4e3b] shadow-lg">
            Save and Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;

