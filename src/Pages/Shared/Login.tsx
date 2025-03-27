/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLoginMutation } from '@/Redux/features/auth/authApi';
import { setUser } from '@/Redux/features/auth/authSlice';
import { useAppDispatch } from '@/Redux/features/hook';
import { verifyToken } from '@/Utils/verifyToken';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

// Define props type
interface LoginProps {
    setShowModal: (show: boolean) => void;
    refetch?: () => void;
    onsubmit?: () => void;
}

// Define form data type
interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC<LoginProps> = ({ setShowModal }) => {
    const dispatch = useAppDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [login] = useLoginMutation();
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve the desired route from the location state or fallback to "/"
    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (logInInfo: LoginFormData) => {
        try {
            const res = await login(logInInfo).unwrap();
            if (res.data.accessToken) {
                const user = verifyToken(res.data.accessToken);
                dispatch(setUser({ user, token: res.data.accessToken }));
                toast.success('Login successful!!');
                setShowModal(false);
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error("Login failed! Please check your credentials.");
        }
    };

    return (
        <div className="bg-white max-w-sm mx-auto shadow-md p-6">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-primary"
                    />
                    {errors.email && <p className="text-red-500 text-sm">Enter valid email</p>}
                </div>

                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register('password', { required: 'Password is required' })}
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-primary"
                    />
                    {errors.password && <p className="text-red-500 text-sm">Enter valid password</p>}
                </div>

                {/* Login Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-primary-foreground text-white font-semibold py-3 hover:bg-primary transition duration-200"
                    >
                        Log In
                    </button>
                </div>
            </form>

            {/* Quick Login Buttons */}
            <div className="mt-4 flex justify-between">
                <button
                    type="button"
                    onClick={() => {
                        // Set default user credentials
                        (document.getElementById("email") as HTMLInputElement).value = "user@3.com";
                        (document.getElementById("password") as HTMLInputElement).value = "123456";
                    }}
                    className="text-blue-500 underline"
                >
                    Login as User
                </button>
                <button
                    type="button"
                    onClick={() => {
                        (document.getElementById("email") as HTMLInputElement).value = "test@admin.com";
                        (document.getElementById("password") as HTMLInputElement).value = "aaaaaa";
                    }}
                    className="text-red-500 underline"
                >
                    Login as Admin
                </button>
            </div>
        </div>
    );
};

export default Login;
