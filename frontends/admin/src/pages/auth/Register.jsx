
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../services/supabaseClient';

const registerSchema = z.object({
  email: z.string().email('Debe ser un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

const Register = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp(data);
      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold">¡Revisa tu correo!</h2>
          <p className="mt-4">Hemos enviado un enlace para verificar tu cuenta. Una vez verificado, podrás iniciar sesión.</p>
          <Link to="/login" className="btn-primary-static mt-6 inline-block">Ir a Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-center text-3xl font-bold">Crear Cuenta</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('email')} type="email" placeholder="Email" className="input-field-static" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          <input {...register('password')} type="password" placeholder="Contraseña" className="input-field-static" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          <button type="submit" disabled={isLoading} className="btn-primary-static w-full">
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="text-center">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
};

export default Register;
