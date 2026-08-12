import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import api, { setAuthToken } from '../services/api';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario de Supabase (auth)
  const [userData, setUserData] = useState(null); // Usuario de la base de datos (perfil)
  // null = todavía no se sabe. true/false solo cuando el backend responde de
  // forma concluyente: 200 (existe) o 404 (no existe).
  const [profileExists, setProfileExists] = useState(null);
  // Se llena cuando NO se pudo determinar (red caída, 500, token rechazado).
  // Es distinto de "no tiene perfil": con esto no hay que mandar a nadie al
  // formulario de completar registro.
  const [profileError, setProfileError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null); // Restaurante del usuario
  const [loading, setLoading] = useState(true);

  // Solo la consulta más reciente puede escribir en el estado. Sin esto, dos
  // respuestas que llegan desordenadas dejan el perfil con el valor viejo.
  const consultaActual = useRef(0);
  // Id del usuario cuyo perfil ya se resolvió. Evita repetir la consulta en
  // cada refresco de token, que también dispara onAuthStateChange.
  const perfilResueltoPara = useRef(null);

  const consultarPerfil = useCallback(async () => {
    const id = ++consultaActual.current;
    const vigente = () => id === consultaActual.current;

    try {
      const { data } = await api.get('/users/me/profile');
      if (!vigente()) return;
      setUserData(data);
      setRestaurantData(data?.restaurants?.[0] ?? null);
      setProfileExists(true);
      setProfileError(null);
    } catch (error) {
      if (!vigente()) return;

      if (error.response?.status === 404) {
        // El backend confirma que no hay perfil: hay que completarlo.
        setUserData(null);
        setRestaurantData(null);
        setProfileExists(false);
        setProfileError(null);
      } else {
        // No se pudo determinar. Se deja en desconocido a propósito, para no
        // enseñarle el formulario a alguien que sí tiene perfil.
        console.error('[AuthContext] No se pudo verificar el perfil:', error);
        setProfileError(error);
        setProfileExists(null);
        perfilResueltoPara.current = null; // permite reintentar
      }
    }
  }, []);

  const resolverSesion = useCallback(
    async (session) => {
      setUser(session?.user ?? null);
      setAuthToken(session?.access_token ?? null);

      if (!session) {
        consultaActual.current++; // descarta respuestas en vuelo
        perfilResueltoPara.current = null;
        setUserData(null);
        setRestaurantData(null);
        setProfileExists(null);
        setProfileError(null);
        setLoading(false);
        return;
      }

      // Ya sabemos el perfil de este usuario: un refresco de token no obliga a
      // preguntar otra vez. Solo se actualiza la cabecera de axios, hecho arriba.
      if (perfilResueltoPara.current === session.user.id) {
        setLoading(false);
        return;
      }

      // Se marca antes de consultar para que el evento duplicado del arranque
      // (INITIAL_SESSION y getSession llegan casi a la vez) no dispare dos
      // peticiones al backend.
      perfilResueltoPara.current = session.user.id;
      await consultarPerfil();
      setLoading(false);
    },
    [consultarPerfil]
  );

  // Vuelve a preguntar por el perfil. Lo usa la pantalla de completar registro
  // tras crearlo, y el reintento cuando la verificación falla.
  const refreshProfile = useCallback(async () => {
    perfilResueltoPara.current = null;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;
    setAuthToken(session.access_token);
    perfilResueltoPara.current = session.user.id;
    await consultarPerfil();
  }, [consultarPerfil]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      resolverSesion(session);
    });

    // Red de seguridad por si no llegara el evento INITIAL_SESSION: sin esto la
    // app se quedaría en "Cargando..." para siempre. El control de duplicados
    // de resolverSesion hace que no se consulte el perfil dos veces.
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolverSesion(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [resolverSesion]);

  const value = {
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user, // Usuario de Supabase (auth)
    userData, // Usuario de la base de datos (perfil)
    profileExists,
    profileError,
    refreshProfile,
    restaurantData,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
