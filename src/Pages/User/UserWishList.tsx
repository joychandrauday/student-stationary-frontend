import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';

const UserWishList = () => {
    const wishlistItems = [
        {
            id: 1,
            name: 'Notebook',
            imageUrl: 'https://via.placeholder.com/150',
            price: 200,
            rating: 4.5,
        },
        {
            id: 2,
            name: 'Pencil Set',
            imageUrl: 'https://via.placeholder.com/150',
            price: 50,
            rating: 4.0,
        },
        {
            id: 3,
            name: 'Eraser',
            imageUrl: 'https://via.placeholder.com/150',
            price: 30,
            rating: 3.5,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">My Wishlist</h1>

            {/* Wishlist Items */}
            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-40 object-cover mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                            <p className="text-gray-500 mb-2">Price: {item.price} ৳</p>
                            <p className="text-gray-500 mb-4">Rating: {item.rating} ⭐</p>
                            <div className="flex justify-between items-center">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    <FaShoppingCart className="inline-block mr-2" />
                                    Add to Cart
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    <FaTrashAlt className="inline-block mr-2" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-600 py-10">
                    <p className="text-xl">Your wishlist is empty. Start adding some items!</p>
                </div>
            )}
        </div>
    );
};

export default UserWishList;
