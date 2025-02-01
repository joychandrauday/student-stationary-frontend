import { useState, useEffect } from "react";
import logo from "../../assets/studentstationarylogowhite.png";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import CategoriesDropdown from "../HomeComponent/CategoriesDropdown";
import Login from "@/Pages/Shared/Login";
import SignUp from "@/Pages/Shared/SignUp";
import { useAppDispatch, useAppSelector } from "@/Redux/features/hook";
import { logOut, useCurrentUser } from "@/Redux/features/auth/authSlice";
import { useGetUserQuery } from "@/Redux/features/user/userApi";
import { IUser } from "@/Interfaces/types";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalType, setModalType] = useState("login"); // 'login' or 'register'
    const [searchQuery, setSearchQuery] = useState(""); // State to capture search input
    const navigate = useNavigate();
    const userToken = useAppSelector(useCurrentUser);
    const { data: user, refetch } = useGetUserQuery(userToken?.email as string) as {
        data: IUser | null; isLoading: boolean; error: unknown; refetch: () => void;
    };
    console.log(user, userToken);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    interface INavigateFunction {
        (path: string): void;
    }

    const handleNavigate: INavigateFunction = (path) => {
        navigate(path);
    };

    interface IToggleModalFunction {
        (type: "login" | "register"): void;
    }

    const toggleModal: IToggleModalFunction = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleLogout = () => {
        dispatch(logOut());
        refetch()
    };

    const handleSearch = () => {
        if (searchQuery) {
            navigate(`/products?search=${searchQuery}`);
        }
    };

    return (
        <div
            className={`w-full z-50 transition-all duration-300 ${isScrolled ? "bg-primary/80 shadow-lg backdrop-blur-lg" : "bg-primary"
                } text-white`}
        >
            <div className="mx-auto">
                {/* Top Row */}
                <div
                    className={`${isScrolled ? "hidden" : "hidden bg-primary-foreground"
                        } sm:flex justify-between items-center py-2 px-4 text-xs text-secondary`}
                >
                    <div className="flex space-x-4">
                        <span>📍 1234 Address, City, Country</span>
                        <span>📞 +123 456 7890</span>
                    </div>
                    <div className="font-medium">🎉 Free Shipping on orders over $50!</div>
                </div>

                {/* Middle Row */}
                <div
                    className={`${isScrolled ? "hidden" : "flex flex-wrap items-center justify-between py-4 px-4 sm:px-8 md:px-12"
                        }`}
                >
                    <div
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => handleNavigate("/")}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-36 md:w-40 cursor-pointer transition-transform duration-200"
                        />
                    </div>
                    <div className="hidden sm:flex items-center space-x-4 flex-grow mx-6">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery} // Bind input value to searchQuery state
                            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
                            className="w-full px-4 py-2 rounded-full bg-transparent border border-primary-foreground text-primary-foreground placeholder-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleSearch} // Trigger search when the button is clicked
                            className="p-2 rounded-full border border-primary-foreground hover:bg-primary-foreground hover:text-primary transition duration-200"
                        >
                            <AiOutlineSearch size={20} />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="relative group">
                                    <div className="flex items-center space-x-2 font-semibold cursor-pointer">
                                        <h2 className="text-center">
                                            Hello, <span className="text-primary-foreground">{user.name}</span>
                                        </h2>
                                        <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-sm uppercase">
                                            {user.name[0]} {/* First letter of username */}
                                        </div>
                                    </div>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 hidden group-hover:block bg-primary-foreground shadow-lg w-40 z-10">
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:border hover:bg-primary text-sm"
                                            onClick={handleLogout}
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => toggleModal("login")}
                                    className="text-sm font-medium"
                                >
                                    Log In
                                </button>
                                <h1>/</h1>
                                <button
                                    onClick={() => toggleModal("register")}
                                    className="text-sm font-medium link"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => handleNavigate("/cart")}
                            className="relative flex items-center justify-center text-sm font-medium border border-primary-foreground rounded-full p-2 hover:bg-primary-foreground hover:text-primary transition duration-200"
                        >
                            {
                                user?.cart?.length && user?.cart?.length > 0 && <div className="absolute top-0 right-0 bg-primary-foreground w-4 h-4 rounded-full text-[14px] flex items-center justify-center">{user?.cart?.length}</div>
                            }
                            <FiShoppingCart size={20} />
                        </button>
                    </div>
                </div >

                {/* Bottom Row */}
                <nav className="bg-primary text-sm font-medium">
                    <div className="flex justify-between items-center py-3 px-4 md:px-12">
                        {/* Left Section */}
                        <div className="flex items-center">
                            <CategoriesDropdown />
                        </div>

                        {/* Hamburger Icon */}
                        <div className="sm:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                                {isMenuOpen ? <FaTimes className="text-primary-foreground" size={24} /> : <FaBars size={24} />}
                            </button>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:flex items-center space-x-6">
                            <a href="/" className="hover:text-primary-foreground transition duration-200">Home</a>
                            <a href="/explore" className="hover:text-primary-foreground transition duration-200">Explore</a>
                            <a href="/products" className="hover:text-primary-foreground transition duration-200">Products</a>
                            <a href="/categories" className="hover:text-primary-foreground transition duration-200">Categories</a>
                            <a href="/about" className="hover:text-primary-foreground transition duration-200">About Us</a>
                            <a href="/contact" className="hover:text-primary-foreground transition duration-200">Contact</a>
                        </div>

                        {/* User Profile & Admin Links */}
                        <div className="hidden sm:flex items-center space-x-4">
                            {user?.role === "admin" ? (
                                <>
                                    <a href="/admin/users" className="hover:text-primary-foreground transition duration-200">Manage User</a>
                                    <a href="/admin/products/manage-products" className="hover:text-primary-foreground transition duration-200">Manage Products</a>
                                </>
                            ) : (
                                <>
                                    <a href="/user/account-details" className="flex items-center hover:text-primary-foreground transition duration-200 gap-2">
                                        {user?.avatar ? (
                                            <img src={user?.avatar} className="w-7 rounded-full" alt="User Avatar" />
                                        ) : (
                                            <FaUserCircle size={20} className="mr-2" />
                                        )}
                                        Profile
                                    </a>
                                    <a href="/user/my-orders" className="hover:text-primary-foreground transition duration-200">My Orders</a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="sm:hidden bg-primary-foreground px-4 py-3 flex flex-col space-y-2 items-end absolute z-50 right-0">
                            <a href="/" className="hover:text-primary-foreground transition duration-200">Home</a>
                            <a href="/explore" className="hover:text-primary-foreground transition duration-200">Explore</a>
                            <a href="/products" className="hover:text-primary-foreground transition duration-200">Products</a>
                            <a href="/categories" className="hover:text-primary-foreground transition duration-200">Categories</a>
                            <a href="/about" className="hover:text-primary-foreground transition duration-200">About Us</a>
                            <a href="/contact" className="hover:text-primary-foreground transition duration-200">Contact</a>

                            {/* Mobile Profile & Admin Links */}
                            {user?.role === "admin" ? (
                                <>
                                    <a href="/admin/users" className="hover:text-primary-foreground transition duration-200">Manage User</a>
                                    <a href="/admin/products/manage-products" className="hover:text-primary-foreground transition duration-200">Manage Products</a>
                                </>
                            ) : (
                                <>
                                    <a href="/user/account-details" className="flex items-center hover:text-primary-foreground transition duration-200 gap-2">
                                        {user?.avatar ? (
                                            <img src={user?.avatar} className="w-7 rounded-full" alt="User Avatar" />
                                        ) : (
                                            <FaUserCircle size={20} className="mr-2" />
                                        )}
                                        Profile
                                    </a>
                                    <a href="/user/my-orders" className="hover:text-primary-foreground transition duration-200">My Orders</a>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div >

            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal} // Close modal on overlay click
                >
                    <div
                        className="relative bg-transparent shadow-lg p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()} // Prevent closeModal on modal content click
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
                        >
                            ✕
                        </button>
                        {modalType === "login" && <Login setShowModal={setShowModal} refetch={refetch} />}
                        {modalType === "register" && <SignUp setShowModal={setShowModal} />}
                    </div >
                </div >
            )}

        </div >
    );
};

export default Navbar;
