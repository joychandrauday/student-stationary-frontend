import error from "../../assets/error.png";
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FDF7F2]">
            <div className="text-center ">
                <img src={error} alt="" className="w-72 mx-auto" />
                <h1 className="text-5xl font-bold text-gray-800">404 | Oops! Page Not Found</h1>
                <button
                    onClick={goToHome}
                    className="mt-6 px-6 py-2 bg-[#1F2937] text-white font-semibold rounded-full shadow-md hover:bg-[#FF6F61] transition duration-200"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
