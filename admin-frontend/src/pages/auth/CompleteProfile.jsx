
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Tu nombre es requerido.'),
  restaurantName: z.string().min(2, 'El nombre del restaurante es requerido.'),
});

const CompleteProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(profileSchema) });
  const { profileExists } = useAuth();

  // Forzar renderización después de 1 segundo si aún no se ha renderizado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!forceRender) {
        setForceRender(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [forceRender]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/users/me/profile', data);
      // Forzar una recarga o re-sincronización del estado de autenticación
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo completar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

    // Si el usuario ya tiene perfil, redirigir al dashboard
    if (profileExists === true) {
      return <Navigate to="/" replace />;
    }

    // Mostrar loading si no se ha forzado el render
    if (!forceRender) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando formulario...</p>
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
