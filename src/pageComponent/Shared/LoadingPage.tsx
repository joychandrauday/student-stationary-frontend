import loader from '../../assets/loader2.gif';
const LoadingPage = () => {
    return (
        <div>
            <div className="flex min-h-[50vh] items-center justify-center">
                <img src={loader} alt="" className='w-24 h-24' />
            </div>
        </div>
    );
}

export default LoadingPage;
