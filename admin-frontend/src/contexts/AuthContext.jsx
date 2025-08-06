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
      console.log('\n[AuthContext] Manejando sesión...');
      console.log('[AuthContext] Session data:', session);
      
      setUser(session?.user ?? null);
      setAuthToken(session?.access_token ?? null);

      let profileFound = false;
      let currentRestaurantData = null; // Variable local para los datos del restaurante

      if (session) {
        console.log('[AuthContext] Sesión activa. Verificando perfil en nuestro backend...');
        console.log('[AuthContext] Token:', session?.access_token ? 'Presente' : 'Ausente');
        
        // Pequeño delay para asegurar que el token esté configurado
        await new Promise(resolve => setTimeout(resolve, 200));
        
        try {
          const response = await api.get('/users/me/profile');
          console.log('[AuthContext] ✅ Perfil encontrado. Datos completos:', response.data);
          profileFound = true;
          
          // Guardar los datos del usuario de la base de datos
          setUserData(response.data);
          console.log('[AuthContext] ✅ Datos del usuario cargados:', response.data);
          
          // Asegurarse de que el restaurante exista y adjuntarlo
          if (response.data && response.data.restaurants && response.data.restaurants.length > 0) {
            currentRestaurantData = response.data.restaurants[0];
            console.log('[AuthContext] ✅ Datos del restaurante cargados:', currentRestaurantData);
          } else {
            console.log('[AuthContext] ⚠️ Perfil de usuario encontrado, pero sin datos de restaurante.');
          }
        } catch (error) {
          console.log('[AuthContext] Error completo:', error);
          console.log('[AuthContext] Error response:', error.response);
          console.log('[AuthContext] Error status:', error.response?.status);
          
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
      console.log(`[AuthContext] ✅ Verificación completada:`);
      console.log(`[AuthContext] - profileExists: ${profileFound}`);
      console.log(`[AuthContext] - restaurantData:`, currentRestaurantData);
      
      // Delay adicional para asegurar que todos los componentes estén listos
      setTimeout(() => {
        console.log(`[AuthContext] - loading: false (después del delay)`);
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