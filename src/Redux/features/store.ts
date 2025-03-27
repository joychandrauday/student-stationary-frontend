import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import { baseApi } from '../api/baseApi';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // default to localStorage
import Cookies from 'js-cookie';

// Custom cookie storage for redux-persist
const cookieStorage = {
    getItem: (key: string) => {
        const cookie = Cookies.get(key);  // Get cookie by key
        return cookie ? Promise.resolve(cookie) : Promise.resolve(null); // Ensure it returns a promise
    },
    setItem: (key: string, value: string) => {
        Cookies.set(key, value, { expires: 7, path: '' }); // Set cookie with an expiration of 7 days
        return Promise.resolve(); // Return a resolved promise
    },
    removeItem: (key: string) => {
        Cookies.remove(key);  // Remove cookie by key
        return Promise.resolve(); // Return a resolved promise
    }
};

// Persist configuration for cart (using localStorage)
const cartPersistOptions = {
    key: "cart",
    storage,  // default localStorage
};

// Persist configuration for auth (using cookies)
const authPersistOptions = {
    key: "auth",
    storage: cookieStorage,  // custom cookieStorage for auth
};

const persistedCart = persistReducer(cartPersistOptions, cartReducer);
const persistedAuth = persistReducer(authPersistOptions, authReducer);

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        cart: persistedCart,
        auth: persistedAuth,  // Add the auth reducer
    },
    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
