import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "@/Pages/Shared/Home";
import ErrorPage from "@/Pages/Shared/ErrorPage";
import Dashboard from "@/layouts/Dashboard";
import AdminDashboard from "@/Pages/Admin/AdminDashboard";
import AdminUserManagement from "@/Pages/Admin/AdminUserManagement";
import AdminReport from "@/Pages/Admin/AdminReport";
import AdminAddProduct from "@/Pages/Admin/AdminAddProduct";
import AdminManageProduct from "@/Pages/Admin/AdminManageProduct";
import AdminOrderPage from "@/Pages/Admin/AdminOrderPage";
import UserDashboard from "@/Pages/User/UserDashboard";
import UserOrderPage from "@/Pages/User/UserOrderPage";
import UserWishList from "@/Pages/User/UserWishList";
import UserOrderTracking from "@/Pages/User/UserOrderTracking";
import UserProfileDetails from "@/Pages/User/UserProfileDetails";
import UserPaymentMethod from "@/Pages/User/UserPaymentMethod";
import UserSetting from "@/Pages/User/UserSetting";
import Login from "@/Pages/Shared/Login";
import AllProducts from "@/Pages/Shared/AllProducts";
import Explore from "@/Pages/Shared/Explore";
import About from "@/Pages/Shared/About";
import Categories from "@/Pages/Shared/Categories";
import ProtectedRoutes from "@/layouts/ProtectedRoutes";
import SingleProduct from "@/Pages/Shared/SingleProduct";
import Cart from "@/Pages/Shared/Cart";
import SingleCategories from "@/Pages/Shared/SingleCategories";
import UserPayment from "@/Pages/User/UserPayment";
import ContactUS from "@/Pages/Shared/ContactUS";
import AdminManageCategory from "@/Pages/Admin/AdminManageCategory";
import AdminManageFlash from "@/Pages/Admin/AdminManageFlash";
import AdminManageBrand from "@/Pages/Admin/AdminManageBrand";
import AdminNewsLetter from "@/Pages/Admin/AdminNewsLetter";
import Unsubscribe from "@/Pages/Shared/Unsubscribe";
import SingleBlog from "@/pageComponent/HomeComponent/SingleBlog";
import AllBlogs from "@/pageComponent/HomeComponent/AllBlogs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <AllProducts />,
      },
      {
        path: "/payment",
        element: <UserPayment />,
      },
      {
        path: "/product/:id",
        element: <SingleProduct />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <ContactUS />,
      },
      {
        path: "/blogs",
        element: <AllBlogs />,
      },
      {
        path: "/blog/:id",
        element: <SingleBlog />,
      },
      {
        path: "/login",
        element: <Login refetch={undefined} setShowModal={() => false} />,
      },
      {
        path: "/unsubscribe",
        element: <Unsubscribe />,
      },

      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/category/:category",
        element: <SingleCategories />,
      },
      {
        path: "/cart",
        element: <ProtectedRoutes>
          <Cart />,
        </ProtectedRoutes>
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoutes>
      <Dashboard />
    </ProtectedRoutes>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUserManagement />,
      },
      {
        path: "orders",
        element: <AdminOrderPage />,
      },
      {
        path: "reports",
        element: <AdminReport />,
      },
      {
        path: "newsletter",
        element: <AdminNewsLetter />,
      },
      {
        path: "products/add-product",
        element: <AdminAddProduct />,
      },
      {
        path: "products/manage-products",
        element: <AdminManageProduct />,
      },
      {
        path: "products/manage-category",
        element: <AdminManageCategory />,
      },
      {
        path: "products/manage-flash-sale",
        element: <AdminManageFlash />,
      },
      {
        path: "products/manage-brand",
        element: <AdminManageBrand />,
      },
    ],
  },
  {
    path: "/user",
    element: <ProtectedRoutes>
      <Dashboard />
    </ProtectedRoutes>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <UserDashboard />,
      },
      {
        path: "my-orders",
        element: <UserOrderPage />,
      },
      {
        path: "wish-list",
        element: <UserWishList />,
      },
      {
        path: "order-tracking",
        element: <UserOrderTracking />,
      },
      {
        path: "account-details",
        element: <UserProfileDetails />,
      },
      {
        path: "payment-methods",
        element: <UserPaymentMethod />,
      },
      {
        path: "settings",
        element: <UserSetting />,
      },
    ],
  },

]);

export default router;