import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch products
  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then((response) => {
        setProducts(response.data.data); // Assuming data is in `data.data`
        setLoadingProducts(false);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Fetch orders
  useEffect(() => {
    axios.get('http://localhost:3000/api/orders')
      .then((response) => {
        setOrders(response.data.data); // Assuming data is in `data.data`
        setLoadingOrders(false);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div>
      <Helmet>
        <title>Student Stationary | all needed stationaries at one place.</title>
      </Helmet>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <div key={product.id} className="p-2 border">
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-700">$ {product.price}</p>
                <div className="bg-blue-500 hover:bg-blue-600 w-full text-center rounded-md py-2 mt-3">
                <Link
                  to={`/product/${product._id}`}
                  className=" w-full text-white  "
                >
                  View Details
                </Link>
              </div>
              </div>
            ))}
          </Slider>
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4">Recent Orders</h2>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          <Slider {...sliderSettings}>
            {orders.map((order) => (
              <div key={order.id} className="p-2 border rounded-md shadow-sm">
                <p className="text-lg font-semibold">Order ID: {order.id}</p>
                <p className="text-gray-700">Customer: {order.email}</p>
                <p className="text-gray-700">Total: ৳{order.totalPrice}</p>
                <p className="text-gray-500 text-sm">Date: {order.createdAt}</p>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Home;
