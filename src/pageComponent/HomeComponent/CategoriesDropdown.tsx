import Aos from 'aos';
import { useEffect } from 'react';
import { TbCategory } from 'react-icons/tb';
import { useGetcategoryQuery } from '@/Redux/features/Category/categoryApi';

const CategoriesDropdown = () => {
    const { data: categories } = useGetcategoryQuery()
    useEffect(() => {
        Aos.init({ duration: 800, offset: 100 });
    }, []);

    console.log(categories);

    return (
        <div className="relative group z-50 rounded-none">
            <div
                className="hover:text-primary-foreground group flex items-center gap-2 transition duration-200"
            >
                <TbCategory size={20} />
                Browse By Category
            </div>
            <div
                className="absolute top-full left-0 bg-primary text-white rounded-lg shadow-lg py-2 w-48 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto"
                data-aos="fade-down"
            >
                <ul>
                    {categories && categories.map((category, index) => (
                        <li key={category.name}>
                            <a
                                href={`/products?category=${category._id}`}
                                className="flex shadow items-center gap-3 px-4 py-2 hover:bg-primary-foreground transition duration-200"
                                data-aos="fade-right"
                                data-aos-delay={`${(index + 1) * 100}`}
                            >
                                <img src={category.icon} alt="" className='w-5 h-5 invert' />
                                {category.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    );
};

export default CategoriesDropdown;
