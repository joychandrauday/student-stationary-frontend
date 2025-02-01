/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRegisterMutation } from '@/Redux/features/auth/authApi';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
interface signProps {
    setShowModal: (show: boolean) => void;
    refetch?: () => void;
    onsubmit?: () => void;
}

const SignUp: React.FC<signProps> = ({ setShowModal }) => {
    const navigate = useNavigate()
    const [register] = useRegisterMutation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await register(formData).unwrap();
            if (response.success) {
                setShowModal(false);
                toast.success('Sign Up Successfully!!')
                navigate('/login');
            } else {
                toast.error('Email already exists. Please use a different email.')
            }
        } catch (error) {
            toast.error('Email already exists. Please use a different email.')
        }
    };


    return (
        <div className="w-full max-w-md bg-white shadow-md p-6">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full p-3 border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full p-3 border text-primary border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full p-3 border text-primary border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>

                {/* Sign Up Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-primary-foreground text-white font-semibold py-3 hover:bg-primary transition duration-200"
                    >
                        Sign Up
                    </button>
                </div>
            </form>

            {/* Login Link
            <p className="text-sm text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <a
                    href="#"
                    className="text-purple-600 hover:underline"
                >
                    Log In Here
                </a>
            </p> */}
        </div>
    );
};

export default SignUp;
