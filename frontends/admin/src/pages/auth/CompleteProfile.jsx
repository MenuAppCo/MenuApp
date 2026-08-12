import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Tu nombre es requerido.'),
  restaurantName: z.string().min(2, 'El nombre del restaurante es requerido.'),
});

const CompleteProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema) });
  const { profileExists, profileError, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/users/me/profile', data);
      await refreshProfile();
      navigate('/', { replace: true });
    } catch (err) {
      // 409 = el perfil ya existía (doble envío o una pestaña que se adelantó).
      // No es un error para el usuario: basta con seguir adelante.
      if (err.response?.status === 409) {
        await refreshProfile();
        navigate('/', { replace: true });
        return;
      }
      setError(err.response?.data?.message || 'No se pudo completar el perfil.');
      setIsLoading(false);
    }
  };

  // El formulario solo se muestra cuando el backend ha confirmado que no hay
  // perfil. Mientras no haya respuesta concluyente se espera, para que no
  // aparezca y desaparezca a quien ya lo completó.
  if (profileExists === true) {
    return <Navigate to="/" replace />;
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">No pudimos verificar tu perfil</h2>
          <p className="text-gray-600">
            Comprueba tu conexión e inténtalo de nuevo. Tus datos siguen intactos.
          </p>
          <button onClick={refreshProfile} className="btn-primary-static">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (profileExists === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-3xl font-bold">Completa tu Perfil</h2>
        <p className="text-center">¡Bienvenido! Solo necesitamos unos datos más para empezar.</p>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name')} placeholder="Tu Nombre Completo" className="input-field-static" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <input {...register('restaurantName')} placeholder="Nombre de tu Restaurante" className="input-field-static" />
          {errors.restaurantName && <p className="text-red-500">{errors.restaurantName.message}</p>}
          <button type="submit" disabled={isLoading} className="btn-primary-static w-full">
            {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
