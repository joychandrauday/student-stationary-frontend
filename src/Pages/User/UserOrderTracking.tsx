import { FaTruck, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaShippingFast } from 'react-icons/fa';

const UserOrderTracking = () => {
    const order = {
        id: 1,
        date: '2025-01-15',
        status: 'Shipped',
        trackingNumber: 'ABCD123456',
        estimatedDelivery: '2025-01-20',
        items: [
            { name: 'Notebook', quantity: 2, price: 150 },
            { name: 'Pencil Set', quantity: 1, price: 50 },
        ],
        total: 350,
        trackingEvents: [
            { date: '2025-01-15', status: 'Order Placed', icon: <FaTimesCircle className="text-gray-500" /> },
            { date: '2025-01-16', status: 'Shipped', icon: <FaTruck className="text-blue-500" /> },
            { date: '2025-01-17', status: 'Out for Delivery', icon: <FaShippingFast className="text-yellow-500" /> },
            { date: '2025-01-18', status: 'Delivered', icon: <FaCheckCircle className="text-green-500" /> },
        ],
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-6">Order Tracking</h1>

                {/* Order Information */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                        <p className="text-sm text-gray-500">
                            <FaCalendarAlt className="inline-block mr-1" />
                            Placed on {order.date}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">Total: {order.total} ৳</p>
                        <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-500' : order.status === 'Shipped' ? 'text-blue-500' : 'text-red-500'}`}>
                            {order.status}
                        </p>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tracking Timeline</h3>
                <div className="space-y-4">
                    {order.trackingEvents.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            {event.icon}
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{event.status}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipment Tracking Info */}
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Shipment Tracking</h3>
                    <div className="flex items-center space-x-4">
                        <span className="text-lg text-gray-800 font-medium">Tracking Number:</span>
                        <span className="text-lg text-blue-600">{order.trackingNumber}</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-lg text-gray-800 font-medium">Estimated Delivery: {order.estimatedDelivery}</p>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                    <ul className="space-y-2">
                        {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>{item.price} ৳</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-semibold text-lg">Total: {order.total} ৳</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex space-x-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                        View Full Order Details
                    </button>
                    <button className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserOrderTracking;
