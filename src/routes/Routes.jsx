import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import AllProducts from "../pages/AllProducts/AllProducts";
import SingleProduct from "../pages/SIngleProduct/SIngleProduct";
import AllOrders from "../pages/AllOrders/AllOrders";
import AddProduct from "../pages/AddProduct/AddProduct";


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
        path: "/all-products",
        element: <AllProducts />,
      },
      {
        path: "/product/:id",
        element: <SingleProduct />,
      },
      {
        path: "/orders",
        element: <AllOrders />,
      },
      {
        path: "/add",
        element: <AddProduct />,
      },
    ],
  },
]);
