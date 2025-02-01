
const StaticBgSection = () => {
    return (
        <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593526367339-673b8872f19a?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Text Content */}
            <div className="relative z-10 text-center text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                    Elevate Your Workspace
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    Discover high-quality stationery that blends elegance with functionality.
                </p>
            </div>
        </div>
    );
};

export default StaticBgSection;
