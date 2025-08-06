import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import api from '../services/api';
import { setAuthToken } from '../services/api';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario de Supabase (auth)
  const [userData, setUserData] = useState(null); // Usuario de la base de datos (perfil)
  const [profileExists, setProfileExists] = useState(null); // null = no verificado, true/false = verificado
  const [restaurantData, setRestaurantData] = useState(null); // Nuevo estado para los datos del restaurante
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = async (session) => {
      setUser(session?.user ?? null);
      setAuthToken(session?.access_token ?? null);

      let profileFound = false;
      let currentRestaurantData = null;

      if (session) {
        // Pequeño delay para asegurar que el token esté configurado
        await new Promise(resolve => setTimeout(resolve, 200));
        
        try {
          const response = await api.get('/users/me/profile');
          profileFound = true;
          
          // Guardar los datos del usuario de la base de datos
          setUserData(response.data);
          
          // Asegurarse de que el restaurante exista y adjuntarlo
          if (response.data && response.data.restaurants && response.data.restaurants.length > 0) {
            currentRestaurantData = response.data.restaurants[0];
          }
        } catch (error) {
          if (error.response?.status === 404) {
            profileFound = false;
          } else {
            console.error('[AuthContext] Error al verificar el perfil:', error);
            profileFound = false;
          }
        }
      } else {
        profileFound = false;
        currentRestaurantData = null;
      }

      setProfileExists(profileFound);
      setRestaurantData(currentRestaurantData);
      
      // Delay adicional para asegurar que todos los componentes estén listos
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfileExists(null);
        setUser(null);
        setUserData(null); // Resetear datos del usuario de la base de datos
        setRestaurantData(null); // Resetear datos del restaurante al cerrar sesión
        setAuthToken(null);
        setLoading(false);
      }
      handleSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user, // Usuario de Supabase (auth)
    userData, // Usuario de la base de datos (perfil)
    profileExists,
    restaurantData, // Exponer los datos del restaurante
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};