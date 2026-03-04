import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Profile, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  setCurrentProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; profile?: Profile } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_PROFILE'; payload: Profile }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAILURE'; payload: string };

const initialState: AuthState = {
  user: null,
  currentProfile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        currentProfile: action.payload.profile || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'REGISTER_SUCCESS':
      return { ...state, isLoading: false, error: null };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        currentProfile: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
      };
    
    case 'SET_PROFILE':
      return {
        ...state,
        currentProfile: action.payload,
      };
    
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing user session on app load and refresh it from backend
    const initializeAuth = async () => {
      const savedUser = authService.getUser();
      const savedProfile = authService.getProfile();

      if (!savedUser) {
        return;
      }

      try {
        const freshUser = await authService.getUserById(savedUser.id);

        if (freshUser) {
          // Persist the refreshed user and use it for the session
          authService.saveUser(freshUser);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: freshUser, profile: savedProfile },
          });
        } else {
          // User no longer exists on server; clear local session
          authService.removeUser();
        }
      } catch (error) {
        console.error('Failed to refresh user from server, falling back to cached user.', error);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: savedUser, profile: savedProfile },
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const user = await authService.login({ username, password });
      
      if (user) {
        authService.saveUser(user);
        
        // If user has profiles, set the first one as default
        const defaultProfile = user.profiles && user.profiles.length > 0 ? user.profiles[0] : null;
        if (defaultProfile) {
          authService.saveProfile(defaultProfile);
        }
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, profile: defaultProfile } 
        });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const result = await authService.register(userData);
      
      if (result === 'User registered successfully') {
        dispatch({ type: 'REGISTER_SUCCESS' });
        return true;
      } else {
        dispatch({ type: 'REGISTER_FAILURE', payload: result });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      return false;
    }
  };

  const logout = () => {
    authService.removeUser();
    dispatch({ type: 'LOGOUT' });
  };

  const setCurrentProfile = (profile: Profile) => {
    authService.saveProfile(profile);
    dispatch({ type: 'SET_PROFILE', payload: profile });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    setCurrentProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};