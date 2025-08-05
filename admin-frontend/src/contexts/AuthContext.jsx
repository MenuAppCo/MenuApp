import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import api from '../services/api';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null); // Nuevo estado para los datos del restaurante
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = async (session) => {
      console.log('\n[AuthContext] Manejando sesión...');
      setUser(session?.user ?? null);
      setAuthToken(session?.access_token ?? null);

      let profileFound = false;
      let currentRestaurantData = null; // Variable local para los datos del restaurante

      if (session) {
        console.log('[AuthContext] Sesión activa. Verificando perfil en nuestro backend...');
        try {
          const response = await api.get('/users/me/profile');
          console.log('[AuthContext] ✅ Perfil encontrado. Datos:', response.data);
          profileFound = true;
          // Asegurarse de que el restaurante exista y adjuntarlo
          if (response.data && response.data.restaurants && response.data.restaurants.length > 0) {
            currentRestaurantData = response.data.restaurants[0];
            console.log('[AuthContext] ✅ Datos del restaurante cargados:', currentRestaurantData);
          } else {
            console.log('[AuthContext] ⚠️ Perfil de usuario encontrado, pero sin datos de restaurante.');
          }
        } catch (error) {
          if (error.response?.status === 404) {
            console.log('[AuthContext] ❌ Perfil no encontrado (404). Se requiere completar el registro.');
            profileFound = false;
          } else {
            console.error('[AuthContext] ❌ Error al verificar el perfil:', error);
            profileFound = false;
          }
        }
      } else {
        console.log('[AuthContext] No hay sesión activa.');
        profileFound = false;
        currentRestaurantData = null; // Limpiar datos del restaurante si no hay sesión
      }

      setProfileExists(profileFound);
      setRestaurantData(currentRestaurantData); // Actualizar el estado del restaurante
      console.log(`[AuthContext] profileExists final: ${profileFound}`);
      console.log(`[AuthContext] restaurantData final:`, currentRestaurantData);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfileExists(false);
        setUser(null);
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
    user,
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

export const useAuth = () => useContext(AuthContext);