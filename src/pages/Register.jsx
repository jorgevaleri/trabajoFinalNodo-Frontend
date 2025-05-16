// src/pages/Register.jsx
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email obligatorio'),
  password: yup.string().min(6,'Al menos 6 caracteres').required(),
  confirm: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required(),
  role: yup.string().oneOf(['admin','adult','child']),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async data => {
    try {
      // <-- aquí uso la función del AuthContext
      await registerUser({
        email: data.email,
        password: data.password,
        role: data.role
      });
      toast.success('¡Usuario registrado!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrarme</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full px-4 py-2 pr-10 border rounded ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block mb-1">Confirmar contraseña</label>
            <input
              type="password"
              {...register('confirm')}
              className={`w-full px-4 py-2 border rounded ${
                errors.confirm ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm.message}</p>}
          </div>

          {/* Rol */}
          <div>
            <label className="block mb-1">Rol</label>
            <select {...register('role')} className="w-full px-4 py-2 border rounded">
              <option value="admin">Administrador</option>
              <option value="adult">Adulto</option>
              <option value="child">Niño</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-4 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
