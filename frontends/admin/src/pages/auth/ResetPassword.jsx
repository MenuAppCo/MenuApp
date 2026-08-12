import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'

const resetSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

// Supabase devuelve los errores del enlace en el fragmento de la URL
// (#error=...&error_description=...), no en la query.
const leerErrorDelEnlace = () => {
  const fragmento = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const query = new URLSearchParams(window.location.search)
  const codigo = fragmento.get('error_code') || query.get('error_code')
  const descripcion = fragmento.get('error_description') || query.get('error_description')
  if (!codigo && !descripcion) return null
  if (codigo === 'otp_expired') {
    return 'El enlace ha caducado. Solicita uno nuevo.'
  }
  return descripcion ? decodeURIComponent(descripcion.replace(/\+/g, ' ')) : 'El enlace no es válido.'
}

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  // null = aun comprobando, true/false = resuelto
  const [sesionValida, setSesionValida] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  })

  useEffect(() => {
    const errorDelEnlace = leerErrorDelEnlace()
    if (errorDelEnlace) {
      setError(errorDelEnlace)
      setSesionValida(false)
      return
    }

    // Al abrir el enlace, el cliente de Supabase canjea los tokens de la URL
    // y crea la sesion de recuperacion. Puede llegar antes o despues de este
    // efecto, asi que se comprueba la sesion actual y se escuchan los cambios.
    let activo = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (activo && session) setSesionValida(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (!activo) return
      if (session) setSesionValida(true)
      else if (evento === 'SIGNED_OUT') setSesionValida(false)
    })

    // Sin sesion pasado un margen razonable, el enlace no sirve.
    const temporizador = setTimeout(() => {
      if (activo) setSesionValida((previo) => (previo === null ? false : previo))
    }, 3000)

    return () => {
      activo = false
      clearTimeout(temporizador)
      subscription?.unsubscribe()
    }
  }, [])

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) {
        throw new Error(error.message || 'No se pudo actualizar la contraseña')
      }
      // Se cierra la sesion de recuperacion para forzar un login limpio con
      // la contraseña nueva.
      await supabase.auth.signOut()
      navigate('/login', { replace: true, state: { passwordUpdated: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Nueva contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Elige la contraseña con la que entrarás a partir de ahora
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {sesionValida === null && (
          <p className="text-center text-sm text-gray-600">Validando el enlace...</p>
        )}

        {sesionValida === false && (
          <div className="space-y-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded" role="status">
              Este enlace no es válido o ya ha caducado. Solicita uno nuevo para continuar.
            </div>
            <Link
              to="/forgot-password"
              className="btn-primary-static w-full flex justify-center py-3"
            >
              Solicitar un enlace nuevo
            </Link>
          </div>
        )}

        {sesionValida === true && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field-static pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Repetir contraseña
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field-static pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary-static w-full flex justify-center py-3"
              >
                {isLoading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
