import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import Cookies from "js-cookie";

export type TUser = {
    email: string;
    role: string;
    iat: number;
    exp: number;
};

type TAuthState = {
    user: null | TUser;
    token: null | string;
};

export const initialState: TAuthState = {
    user: null,
    token: null,
};

// Utility function to get cookies on app initialization
const getUserFromCookies = () => {
    const user = Cookies.get("user");
    const token = Cookies.get("token");

    return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
    };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getUserFromCookies(), // Initialize state from cookies
    reducers: {
        setUser: (state, action) => {
            const { user, token }: { user: TUser; token: string } = action.payload;
            state.user = user;
            state.token = token;

            // Set cookies with a 7-day expiration
            Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true, sameSite: "Strict" });
            Cookies.set("token", token, { expires: 7, secure: true, sameSite: "Strict" });
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            Cookies.remove("user"); 
            Cookies.remove("token");
        }
    }
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentUser = (state: RootState) => state.auth.user;
