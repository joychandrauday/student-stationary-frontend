
const blogs = [
    {
        id: 1,
        title: "Best Stationery Items for Productivity",
        description:
            "Discover top-quality stationery items that can enhance your efficiency and creativity at work.",
        image: "https://i.pinimg.com/736x/0d/02/7e/0d027e02e380eff5a7d830d268be6ac9.jpg",
    },
    {
        id: 2,
        title: "How to Organize Your Workspace",
        description:
            "Learn the best tips to declutter and arrange your workspace for maximum productivity.",
        image: "https://i.pinimg.com/736x/44/66/a7/4466a769cab0c8c066cf5fa33a8f9ca1.jpg",
    },
    {
        id: 3,
        title: "Essential Writing Tools You Must Have",
        description:
            "Explore high-quality pens, notebooks, and accessories that every writer should own.",
        image: "https://i.pinimg.com/736x/60/16/66/601666bccf8c46a319d61eac616b08d1.jpg",
    },
];

const BlogSection = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Latest Blog Posts
                </h2>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300"
                        >
                            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-800">{blog.title}</h3>
                                <p className="text-gray-600 mt-2">{blog.description}</p>
                                <button className="mt-4 px-4 py-2 bg-primary-foreground text-white hover:bg-primary transition duration-300">
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSection;
