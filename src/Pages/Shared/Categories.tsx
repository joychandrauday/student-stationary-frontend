import { Link } from "react-router-dom";
import { FaPenFancy, FaBriefcase, FaPalette, FaBook, FaLaptop, FaEllipsisH } from "react-icons/fa";

const categories = [
    {
        id: 1,
        name: "Writing",
        description: "Explore writing tools and accessories.",
        icon: <FaPenFancy className="text-4xl text-blue-500" />,
        image: "https://source.unsplash.com/400x300/?writing,notebook",
    },
    {
        id: 2,
        name: "Office",
        description: "Find office supplies and stationery.",
        icon: <FaBriefcase className="text-4xl text-green-500" />,
        image: "https://source.unsplash.com/400x300/?office,supplies",
    },
    {
        id: 3,
        name: "Art",
        description: "Discover creative art materials and tools.",
        icon: <FaPalette className="text-4xl text-red-500" />,
        image: "https://source.unsplash.com/400x300/?art,painting",
    },
    {
        id: 4,
        name: "Educational",
        description: "Browse educational books and resources.",
        icon: <FaBook className="text-4xl text-yellow-500" />,
        image: "https://source.unsplash.com/400x300/?education,books",
    },
    {
        id: 5,
        name: "Technology",
        description: "Find the latest tech gadgets and accessories.",
        icon: <FaLaptop className="text-4xl text-purple-500" />,
        image: "https://source.unsplash.com/400x300/?technology,gadgets",
    },
    {
        id: 6,
        name: "Others",
        description: "Explore various other useful items.",
        icon: <FaEllipsisH className="text-4xl text-gray-500" />,
        image: "https://source.unsplash.com/400x300/?miscellaneous,items",
    },
];

const Categories = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 🔹 Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Explore Categories
                </h1>

                {/* 🔹 Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link to={`/category/${category.name.toLowerCase()}`} key={category.id}>
                            <div className="bg-white shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300 cursor-pointer">
                                {/* 📌 Category Info */}
                                <div className="p-4 flex flex-col items-center">
                                    {category.icon}
                                    <h2 className="text-xl font-semibold text-gray-800 mt-2">{category.name}</h2>
                                    <p className="text-gray-600 text-sm text-center mt-1">{category.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
