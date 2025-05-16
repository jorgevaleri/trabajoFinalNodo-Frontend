// src/components/RegisterForm.jsx
// IMPORTA EL HOOK useForm DESDE REACT-HOOK-FORM PARA MANEJAR EL FORMULARIO
import { useForm } from "react-hook-form"
// IMPORTA EL RESOLVER DE YUP PARA VALIDAR CON EL ESQUEMA DEFINIDO
import { yupResolver } from "@hookform/resolvers/yup"
// IMPORTA TODO YUP PARA DEFINIR VALIDACIONES
import * as yup from "yup"
// IMPORTA toast DE REACT-TOASTIFY PARA MOSTRAR MENSAJES DE ÉXITO O ERROR
import { toast } from "react-toastify"
// IMPORTA LA INSTANCIA DE AXIOS CONFIGURADA
import axios from "../api/axios"

// 1) DEFINO EL ESQUEMA DE VALIDACIÓN UTILIZANDO YUP
const schema = yup.object({
  // EL CAMPO username ES STRING Y REQUERIDO
  username: yup.string().required("El nombre de usuario es obligatorio"),
  // EL CAMPO email DEBE SER UN EMAIL VÁLIDO Y ES REQUERIDO
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  // EL CAMPO password DEBE TENER AL MENOS 6 CARACTERES Y ES REQUERIDO
  password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
}).required() // EL OBJETO COMPLETO ES REQUERIDO

// EXPORTA EL COMPONENTE RegisterForm COMO FUNCIÓN POR DEFECTO
export default function RegisterForm() {
  // DESESTRUCTURA FUNCIONES Y ESTADO DEL HOOK useForm
  const {
    register, // REGISTRA LOS CAMPOS DEL FORMULARIO
    handleSubmit, // MANEJA EL ENVÍO DEL FORMULARIO
    formState: { errors, isSubmitting }, // ACCEDE A LOS ERRORES Y AL ESTADO DE ENVÍO
    reset // RESETEA EL FORMULARIO
  } = useForm({
    resolver: yupResolver(schema) // APLICA LA VALIDACIÓN DE YUP AL FORMULARIO
  })

  // FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO
  const onSubmit = async data => {
    try {
      // INTENTA ENVIAR LOS DATOS AL ENDPOINT DE REGISTRO
      await axios.post("/auth/register", data)
      // MUESTRA MENSAJE DE ÉXITO SI EL REGISTRO FUE EXITOSO
      toast.success("¡Registro exitoso!")
      // RESETEA LOS CAMPOS DEL FORMULARIO
      reset()
    } catch {
      // MUESTRA MENSAJE DE ERROR SI FALLA EL REGISTRO
      toast.error("Error al registrar")
    }
  }

  // RETORNA EL FORMULARIO
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* CAMPO PARA NOMBRE DE USUARIO */}
      <div>
        <label className="block mb-1 font-medium">Nombre de usuario</label>
        <input
          {...register("username")} // REGISTRA EL INPUT username
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {/* MUESTRA ERROR SI EXISTE */}
        {errors.username && (
          <p className="mt-1 text-red-600 font-bold">{errors.username.message}</p>
        )}
      </div>

      {/* CAMPO PARA EMAIL */}
      <div>
        <label className="block mb-1 font-medium">Correo electrónico</label>
        <input
          {...register("email")} // REGISTRA EL INPUT email
          type="email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {/* MUESTRA ERROR SI EXISTE */}
        {errors.email && (
          <p className="mt-1 text-red-600 font-bold">{errors.email.message}</p>
        )}
      </div>

      {/* CAMPO PARA CONTRASEÑA */}
      <div>
        <label className="block mb-1 font-medium">Contraseña</label>
        <input
          {...register("password")} // REGISTRA EL INPUT password
          type="password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        {/* MUESTRA ERROR SI EXISTE */}
        {errors.password && (
          <p className="mt-1 text-red-600 font-bold">{errors.password.message}</p>
        )}
      </div>

      {/* BOTÓN DE ENVÍO */}
      <button
        type="submit" // DEFINE EL TIPO SUBMIT
        disabled={isSubmitting} // DESACTIVA EL BOTÓN MIENTRAS SE ESTÁ ENVIANDO
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        {/* MUESTRA TEXTO DIFERENTE SEGÚN EL ESTADO DE ENVÍO */}
        {isSubmitting ? "Registrando…" : "Registrarse"}
      </button>
    </form>
  )
}
