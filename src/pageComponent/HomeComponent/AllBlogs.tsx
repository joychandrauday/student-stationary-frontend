import { IBlog } from "@/Interfaces/types";
import { useEffect, useState } from "react";
import { Link, ScrollRestoration } from "react-router-dom";

const AllBlogs = () => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);

    useEffect(() => {
        fetch("/blogs.json")
            .then((res) => res.json())
            .then((data: IBlog[]) => setBlogs(data))
            .catch((err) => console.error("Failed to fetch blogs:", err));
    }, []);

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Latest Blog Posts</h2>
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
                                <Link to={`/blog/${blog.id}`}>
                                    <button className="mt-4 px-4 py-2 bg-primary-foreground text-white hover:bg-primary transition duration-300">
                                        Read More
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollRestoration />
        </div>
    );
};

export default AllBlogs;
