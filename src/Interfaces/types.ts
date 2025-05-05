import { Brand, Category } from "@/Redux/features/product/productApi";

export interface IReview {
    userId: {
        _id: string;
        name: string;
        avatar: string;
        role: string;
    };
    description: string;
    rating: number;
    createdAt: Date;
    _id?: string;
}
export interface IProduct {
    _id?: string | undefined;
    name: string;
    description: string;
    rating?: number;
    discount?: number;
    brand: string | Brand | {
        _id?: string;
        name: string;
        description: string;
        icon: string;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
    };
    price: number;
    category: string | Category;
    images?: string[];
    featuredImages?: string;
    quantity?: number;
    inStock?: boolean;
    status?: string | 'sale' | 'featured' | 'hot';
    reviews?: IReview[];
    isError?: boolean;
    isLoading?: boolean;
    createdAt?: string;
    updatedAt?: string;
    offerPrice?: number;


}
export interface IUser {
    _id: string;
    name: string;
    role: string;
    avatar: string;
    status: string;
    email: string;
    cart: { productId: string; quantity: number; price: number; totalPrice: number }[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;

}
export interface ProductUpdate {
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    status: 'sale' | 'featured' | 'hot';
    reviews?: IReview[];
    quantity?: number;
    inStock?: boolean;
}


export interface IOrder {
    _id: string;
    user: Partial<IUser>; // reference to the user who placed the order
    products: {
        productId: {
            _id: string;
            name: string;
            price: number;
            featuredImages: string;

        }; // reference to the product
        quantity: number; // quantity of the product ordered
        price: number; // price per unit of the product
        totalPrice: number; // total price for this product (quantity * price)
    }[];
    amount: number; // total price of the order (sum of all products' totalPrice)
    shippingAddress: string;
    paymentStatus: string; // e.g., 'Pending', 'Completed', 'Failed'
    orderStatus: string; // e.g., 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    orderDate: Date; // the date when the order was placed
    transaction: {
        id: string,
        code: number,
        message: string,
        status: string,
        method: string,
        bank_status: string,
        date_time: string,
    },
    estimatedDeliveryDate?: Date; // optional, estimated delivery date
    createdAt: Date;
}

export interface useAllOrdersQuery {
    data: IOrder[];
    isLoading: boolean;
    error: boolean;
}
export interface useAllProductssQuery {
    data: IProduct[];
    isLoading: boolean;
    error: boolean;
    meta: {
        totalPages: number;
    };
    isError: boolean;
}
export interface useSingleProductQuery {
    data: IProduct;
    isLoading: boolean;
    error: boolean;
    isError: boolean;
}
export interface useAllUsersQuery {
    data: IUser[];
    isLoading: boolean;
    error: boolean;
}

export interface ICategory {
    _id?: string;
    name: string;
    description: string;
    icon: string;
}

export interface IBlog {
    id: number;
    title: string;
    description: string;
    image: string;
}
