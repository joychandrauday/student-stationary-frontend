import { useState } from "react";
import { IconType } from "react-icons";
import { useLocation } from "react-router-dom"; // Import this for React Router
import {
    FaShoppingCart,
    FaUsers,
    FaBoxOpen,
    FaChartBar,
    FaCog,
    FaCreditCard,
    FaUser,
    FaHeart,
    FaTruck,
} from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "../../assets/studentstationarylogowhite.png";
import { useAppDispatch } from "@/Redux/features/hook";
import { logOut } from "@/Redux/features/auth/authSlice";

interface SubItem {
    title: string;
    url: string;
}

interface AdminItem {
    title: string;
    url: string;
    icon: IconType;
    subItems?: SubItem[];
}

const adminItems: AdminItem[] = [
    {
        title: "Dashboard",
        url: "dashboard",
        icon: AiOutlineDashboard,
    },
    {
        title: "Manage Products",
        url: "products",
        icon: FaBoxOpen,
        subItems: [
            { title: "Add Product", url: "add-product" },
            { title: "Manage Products", url: "manage-products" },
        ],
    },
    {
        title: "Manage Users",
        url: "users",
        icon: FaUsers,
    },
    {
        title: "Orders",
        url: "orders",
        icon: FaShoppingCart,
    },
    {
        title: "Reports",
        url: "reports",
        icon: FaChartBar,
    },
    {
        title: "Settings",
        url: "settings",
        icon: FaCog,
    },
];

const userItems: AdminItem[] = [
    {
        title: "Dashboard",
        url: "dashboard",
        icon: AiOutlineDashboard,
    },
    {
        title: "My Orders",
        url: "my-orders",
        icon: FaShoppingCart,
    },
    {
        title: "Order Tracking",
        url: "order-tracking",
        icon: FaTruck,
    },
    {
        title: "Wish List",
        url: "wish-list",
        icon: FaHeart,
    },
    {
        title: "Account Details",
        url: "account-details",
        icon: FaUser,
    },
    {
        title: "Payment Methods",
        url: "payment",
        icon: FaCreditCard,
    },
    {
        title: "Settings",
        url: "settings",
        icon: FaCog,
    },
];

interface User {
    _id: string;
    name: string;
    role: string;
    avatar: string;
}

interface AppSidebarProps {
    user?: User | null;
}

const AppSidebar = ({ user }: AppSidebarProps) => {
    const items = user?.role === "admin" ? adminItems : userItems;
    const dispatch = useAppDispatch();
    // Track which menu is expanded
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const location = useLocation(); // React Router hook to get current path

    const handleLogout = () => {
        dispatch(logOut());
    };

    const toggleSubMenu = (title: string) => {
        setExpanded((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <Sidebar className="min-h-screen bg-primary-foreground text-white overflow-hidden">
            {/* Logo */}
            <div className="flex items-center bg-primary-foreground justify-center p-6 shadow shadow-black">
                <a href="/">
                    <img src={logo} alt="Stationery Shop Logo" className="h-16" />
                </a>
            </div>
            {/* Sidebar Content */}
            <SidebarContent className="bg-primary-foreground pt-4 scrollbar-hidden">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="group px-2">
                            {item.subItems ? (
                                <>
                                    {/* Parent Menu */}
                                    <SidebarMenuButton
                                        className={`flex items-center justify-start w-full py-5 shadow rounded-none cursor-pointer ${location.pathname.includes(item.url)
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white"
                                            }`}
                                        onClick={() => toggleSubMenu(item.title)}
                                    >
                                        <div className="flex items-center gap-4 p-3">
                                            <item.icon
                                                className={`${location.pathname.includes(item.url)
                                                    ? "text-white"
                                                    : "text-gray-300"
                                                    }`}
                                                size={24}
                                            />
                                            <span className="text-md font-semibold">{item.title}</span>
                                        </div>
                                        <span
                                            className={`transform transition-transform ${expanded[item.title] ? "rotate-90" : ""
                                                }`}
                                        >
                                            ▶
                                        </span>
                                    </SidebarMenuButton>
                                    {/* Submenu */}
                                    {expanded[item.title] && (
                                        <div className="pl-12 pt-2">
                                            {item.subItems.map((subItem) => (
                                                <a
                                                    key={subItem.title}
                                                    href={`/${user?.role ?? "guest"}/${item.url}/${subItem.url}`}
                                                    className={`block py-2 px-3 rounded-lg ${location.pathname ===
                                                        `/${user?.role ?? "guest"}/${item.url}/${subItem.url}`
                                                        ? "bg-primary text-white"
                                                        : "hover:bg-primary hover:text-white"
                                                        }`}
                                                >
                                                    {subItem.title}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <SidebarMenuButton asChild className="bg-hover-primary">
                                    <a
                                        href={`/${user?.role ?? "guest"}/${item.url}`}
                                        className={`flex items-center gap-4 p-3 hover:bg-primary shadow rounded-none transition-all duration-300 ${location.pathname === `/${user?.role ?? "guest"}/${item.url}`
                                            ? "bg-primary text-white"
                                            : "hover:bg-gray-800 hover:text-primary"
                                            }`}
                                    >
                                        <item.icon
                                            className={`${location.pathname === `/${user?.role ?? "guest"}/${item.url}`
                                                ? "text-white"
                                                : "text-gray-300"
                                                }`}
                                            size={24}
                                        />
                                        <span className="text-md font-semibold">{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            {/* Profile and Logout Section */}
            <div className="mt-auto p-4 bg-primary-foreground">
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/40"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h4 className="text-md font-semibold">{user?.name ?? "Guest"}</h4>
                        <p className="text-sm text-gray-300">{user?.role ?? "Guest"}</p>
                    </div>
                </div>
                <button
                    className="w-full py-2 px-4 bg-primary hover:bg-red-700 text-white rounded-none transition"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </Sidebar>
    );
};

export default AppSidebar;
