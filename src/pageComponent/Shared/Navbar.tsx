import { useState, useEffect } from "react";
import logo from "../../assets/studentstationarylogowhite.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import CategoriesDropdown from "../HomeComponent/CategoriesDropdown";
import Login from "@/Pages/Shared/Login";
import SignUp from "@/Pages/Shared/SignUp";
import { useAppDispatch, useAppSelector } from "@/Redux/features/hook";
import { logOut } from "@/Redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/features/store";
import { orderedProducts } from "@/Redux/features/cart/cartSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [modalType, setModalType] = useState("login"); // 'login' or 'register'
    const [searchQuery, setSearchQuery] = useState(""); // State to capture search input
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useAppDispatch();
    const products = useAppSelector(orderedProducts)
    const location = useLocation();
    const links = [
        { path: "/", label: "Home" },
        { path: "/explore", label: "Explore" },
        { path: "/products", label: "Products" },
        { path: "/categories", label: "Categories" },
        { path: "/about", label: "About Us" },
        { path: "/contact", label: "Contact" },
    ];
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
    };

    const handleSearch = () => {
        if (searchQuery) {
            navigate(`/products?searchTerm=${searchQuery}`);
        }
    };

    return (
        <div
            className={`w-full z-50 transition-all duration-300 bg-primary text-white`}
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


                    </div>
                </div >

                {/* Bottom Row */}
                <nav className={`bg-primary text-sm font-medium ${isScrolled ? "z-50 backdrop-blur-md bg-opacity-75 fixed top-0 w-full" : "bg-transparent"
                    }`}>
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
                            {links.map((link) => (
                                <a
                                    key={link.path}
                                    href={link.path}
                                    className={`transition duration-200 ${location.pathname === link.path
                                        ? "text-primary-foreground font-semibold"
                                        : "hover:text-primary-foreground"
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* User Profile & Admin Links */}
                        <div className="hidden sm:flex items-center space-x-4">
                            <button
                                onClick={() => handleNavigate("/cart")}
                                className="relative flex items-center justify-center text-sm font-medium border border-primary-foreground rounded-full p-2 hover:bg-primary-foreground hover:text-primary transition duration-200"
                            >

                                <div className="absolute top-0 right-0 bg-primary-foreground w-4 h-4 rounded-full text-[14px] flex items-center justify-center">{products.length}</div>

                                <FiShoppingCart size={20} />
                            </button>
                            {!user ? (
                                <>

                                </>
                            ) : (
                                <>
                                    {/* user avatar */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="btn btn-ghost btn-circle avatar">
                                            <img src={user.avatar || "/relisticon.png"} width={40} height={40} alt="User Avatar" className="rounded-full" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-44">
                                            <DropdownMenuItem className="font-bold flex flex-col items-start hover:bg-primary-foreground">
                                                <h1>Welcome,</h1>
                                                <h1 className="">{user?.name ?? 'Unknown'}</h1>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="font-bold hover:bg-primary-foreground">
                                                <a href={`${user.role === 'admin' ? 'admin' : 'user'}/dashboard`}> Dashboard </a>
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>

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
                            <a href="/contact-us" className="hover:text-primary-foreground transition duration-200">Contact</a>

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

            {
                showModal && (
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
                            {modalType === "login" && <Login setShowModal={setShowModal} />}
                            {modalType === "register" && <SignUp setShowModal={setShowModal} />}
                        </div >
                    </div >
                )
            }

        </div >
    );
};

export default Navbar;
