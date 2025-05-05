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

// Define location state type
interface LocationState {
    from?: {
        pathname: string;
    };
}

const Login: React.FC<LoginProps> = ({ setShowModal }) => {
    const dispatch = useAppDispatch();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [login] = useLoginMutation();
    const location = useLocation();
    const navigate = useNavigate();
    const from = (location.state as LocationState)?.from?.pathname || "/";

    const onSubmit = async (logInInfo: LoginFormData) => {
        try {
            const res = await login(logInInfo).unwrap();

            if (res?.data?.accessToken) {
                const user = verifyToken(res.data.accessToken);
                if (!user) throw new Error("Invalid token");

                dispatch(setUser({ user, token: res.data.accessToken }));
                toast.success('Login successful!!');
                setShowModal(false);
                navigate(from, { replace: true }); // redirect to previous route
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Login Error:", error);
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
                        className="w-full p-3 border border-gray-300 text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full p-3 border text-primary border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">Enter valid password</p>}
                </div>

                {/* Login Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition duration-200"
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
                        setValue("email", "user@3.com");
                        setValue("password", "123456");
                    }}
                    className="text-blue-500 underline"
                >
                    Login as User
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setValue("email", "test@admin.com");
                        setValue("password", "aaaaaa");
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
