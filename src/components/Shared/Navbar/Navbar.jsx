import React from "react";
import { LiaBookReaderSolid } from "react-icons/lia";
const Navbar = () => {
  return (
    <div className="navbar bg-base-100 container mx-auto mt-4 ">
      <div className="flex-1">
        <a className="flex items-center gap-2 text-xl font-bold">Student Stationary <LiaBookReaderSolid className="text-2xl"/></a>
      </div>
      <div className="flex-none">
        <div className="linkWrap flex gap-3">
          <a href="/" className="bg-blue-950 text-white px-4 py-2 rounded-none  text-sm btn font-semibold hover:text-base-900">Home</a>
          <a href="/all-products" className="bg-blue-950 text-white px-4 py-2 rounded-none  text-sm btn font-semibold hover:text-base-900">All Products</a>
          <a href="/add" className="bg-blue-950 text-white px-4 py-2 rounded-none  text-sm btn font-semibold hover:text-base-900">Add Products</a>
          <a href="/orders" className="bg-blue-950 text-white px-4 py-2 rounded-none  text-sm btn font-semibold hover:text-base-900">All Orders</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
