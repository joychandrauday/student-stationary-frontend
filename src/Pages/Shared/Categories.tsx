import { Link } from "react-router-dom";
import { useGetcategoryQuery } from "@/Redux/features/Category/categoryApi";


const Categories = () => {
    const { data: categories } = useGetcategoryQuery()
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 🔹 Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Explore Categories
                </h1>

                {/* 🔹 Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {categories && categories.map((category) => (
                        <Link to={`/category/${category._id}`} key={category._id}>
                            <div className="bg-white shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300 cursor-pointer h-52 group">
                                {/* 📌 Category Info */}
                                <div className="p-4 flex flex-col items-center">
                                    <div className="w-20 h-20 group-hover:bg-primary-foreground flex items-center justify-center rounded-lg transition-all">
                                        <img src={category.icon} alt="" className="w-12 h-12 group-hover:invert" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800 mt-2">{category.name}</h2>
                                    <p className="text-gray-600 text-sm text-center mt-1">{category.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default Categories;
