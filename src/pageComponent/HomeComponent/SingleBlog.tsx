/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link, ScrollRestoration } from "react-router-dom";

const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<any>(null);

    useEffect(() => {
        fetch("/blogs.json")
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((item: any) => item.id === parseInt(id || ""));
                setBlog(found);
            });
    }, [id]);

    if (!blog) return <div className="text-center py-10">Loading blog...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link to="/blogs" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Blogs</Link>
            <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
            <p className="text-gray-700 leading-relaxed">{blog.content}</p>
            <ScrollRestoration />
        </div>
    );
};

export default SingleBlog;
