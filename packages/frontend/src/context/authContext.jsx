import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
      // Esta función se ejecuta solo una vez, al cargar el componente
        const storedUser = localStorage.getItem('user');
        const ahora = new Date().getTime();
        return storedUser && storedUser.expiry < ahora ? JSON.parse(storedUser) : null;
    });
  
    useEffect(() => {
      localStorage.setItem('user', JSON.stringify(user));
    }, [user]); 

  const loginContext = (accessToken) => {
    
    try {
      const user = jwtDecode(accessToken);
      localStorage.setItem('accessToken', accessToken);
      const ahora = new Date();
      //expira en 2 horas como el refresh
      const expiry =  ahora.getTime() + (120 * 60 * 1000)
      localStorage.setItem('user', JSON.stringify(user));
      setUser({...user, expiry})
    } catch (error) {
      setUser(null)
    }
  };

  // Función de Logout
  const logoutContext = () => {
    localStorage.removeItem('accessToken');
    setUser(null)
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

   const value = {
    user,
    loginContext,
    logoutContext,
    getToken
    };

  return (
    <AuthContext.Provider value={ value}>
      {children}
    </AuthContext.Provider>
  );
};