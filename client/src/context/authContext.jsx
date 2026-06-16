import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    tempRegistration: null,
    loading: true,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload, loading: false, error: null };
        case 'LOGIN_FAILURE':
            return { ...state, user: null, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, user: null, tempRegistration: null, loading: false, error: null };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_REGISTRATION_DATA':
            return { ...state, tempRegistration: action.payload, loading: false, error: null };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    // Initial session recovery check on application mount
    useEffect(() => {
        const checkLoggedUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await authService.checkAuthStatus();
                    if (data.isAuthenticated && data.user) {
                        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                    } else {
                        logoutUser();
                    }
                } catch (err) {
                    logoutUser();
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        checkLoggedUser();
    }, []);

    // Global Event Listeners
    useEffect(() => {
        const handleUnauthorized = () => {
            console.log("Token expired or unauthorized access detected. Logging out...");
            logoutUser();
        };
        window.addEventListener('auth-unauthorized', handleUnauthorized);
        
        // Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener('auth-unauthorized', handleUnauthorized);
        };
    }, []);


    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            if (data.success && data.user) {
                localStorage.setItem('token', data.token);
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid credentials";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };


    // Check for any draft email in local storage to potentially restore registration progress
    const checkDraftEmail = () => {
        return localStorage.getItem('draft_email');
    };

    const confirmRestore = (emailDraft) => {
        // If confirmed, update storage/state if needed and go to info step
        dispatch({ type: 'SET_REGISTRATION_DATA', payload: { email: emailDraft } });
    };

    const cancelRestore = () => {
        localStorage.removeItem('draft_email');
        dispatch({ type: 'SET_REGISTRATION_DATA', payload: null });
    };

    // Registration Step 1: Validates email availability. 
    const registerStep1 = async (email, password) => {
        try {
            const data = await authService.registerStep1(email, password);
            if (data.success) {
                // Instantly commit the temporary access values into our context registry
                localStorage.setItem('draft_email', email);
                dispatch({ type: 'SET_REGISTRATION_DATA', payload: { email, password } });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Email is already taken";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };

    // Registration Step 2: Profile Updates: Executes final database transaction parameters.
    const registerStep2 = async (userData) => {
        try {
            const data = await authService.registerStep2(userData);
            if (data.success && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.removeItem('draft_email');
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Profile assignment failed";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERROR', payload: null });
    };

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                tempRegistration: state.tempRegistration,
                loading: state.loading,
                error: state.error,
                login,
                checkDraftEmail,
                confirmRestore,
                cancelRestore,
                registerStep1,
                registerStep2,
                logoutUser,
                clearErrors
            }}>
            {!state.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);