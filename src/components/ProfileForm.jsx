// src/components/ProfileForm.jsx
// IMPORTA PropTypes PARA VALIDAR LAS PROPIEDADES DEL COMPONENTE
import PropTypes from "prop-types"
// IMPORTA useForm DE REACT HOOK FORM PARA MANEJAR FORMULARIOS
import { useForm } from "react-hook-form"
// IMPORTA EL RESOLVER DE YUP PARA INTEGRACIÓN CON REACT HOOK FORM
import { yupResolver } from "@hookform/resolvers/yup"
// IMPORTA TODAS LAS FUNCIONES DE YUP PARA VALIDACIONES
import * as yup from "yup"

// DEFINICIÓN DEL ESQUEMA DE VALIDACIÓN CON YUP
const schema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"), // NOMBRE REQUERIDO
  age: yup
    .number()
    .typeError("La edad debe ser un número") // VERIFICA QUE SEA NÚMERO
    .min(0, "Edad inválida") // MÍNIMO 0
    .required("La edad es obligatoria"), // EDAD REQUERIDA
  avatarUrl: yup
    .string()
    .url("Debe ser una URL válida") // VALIDA QUE SEA UNA URL
    .nullable() // ACEPTA NULL
    .notRequired(), // NO ES REQUERIDO
})

// DEFINICIÓN DEL COMPONENTE ProfileForm CON PROPIEDADES
export default function ProfileForm({
  initialData = { name: "", age: "", avatarUrl: "" }, // DATOS INICIALES DEL FORMULARIO
  onSubmit, // FUNCIÓN QUE SE LLAMA AL ENVIAR EL FORMULARIO
  onCancel, // FUNCIÓN OPCIONAL PARA CANCELAR
  submitLabel, // TEXTO DEL BOTÓN DE ENVÍO
}) {
  // INICIALIZA EL FORMULARIO USANDO useForm Y EL RESOLVER DE YUP
  const {
    register, // PARA REGISTRAR LOS INPUTS
    handleSubmit, // FUNCIÓN PARA MANEJAR EL SUBMIT
    formState: { errors, isSubmitting }, // ERRORES Y ESTADO DE ENVÍO
    reset, // FUNCIÓN PARA RESETEAR EL FORMULARIO
  } = useForm({
    resolver: yupResolver(schema), // APLICA EL ESQUEMA DE VALIDACIÓN
    defaultValues: initialData, // VALORES POR DEFECTO
  })

  // USA UN EFECTO PARA RESETEAR EL FORMULARIO CUANDO CAMBIE initialData
  React.useEffect(() => {
    reset(initialData) // RESETEA EL FORMULARIO CON LOS NUEVOS DATOS
  }, [initialData, reset])

  // FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO
  const handleForm = async (data) => {
    await onSubmit({
      name: data.name,
      age: Number(data.age), // CONVIERTE LA EDAD A NÚMERO
      avatarUrl: data.avatarUrl || null, // USA NULL SI NO SE PROPORCIONA
    })
    reset(initialData) // RESETEA EL FORMULARIO TRAS ENVIAR
  }

  // RETORNA EL FORMULARIO A RENDERIZAR
  return (
    <form
      onSubmit={handleSubmit(handleForm)} // ASIGNA LA FUNCIÓN AL SUBMIT
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4"
    >
      {/* DISTRIBUYE LOS INPUTS EN UNA GRILLA RESPONSIVA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CAMPO PARA EL NOMBRE */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Nombre
          </label>
          <input
            {...register("name")} // REGISTRA EL INPUT "name"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {/* MUESTRA EL MENSAJE DE ERROR SI EXISTE */}
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* CAMPO PARA LA EDAD */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Edad
          </label>
          <input
            {...register("age")} // REGISTRA EL INPUT "age"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.age
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {/* MUESTRA EL MENSAJE DE ERROR SI EXISTE */}
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">
              {errors.age.message}
            </p>
          )}
        </div>

        {/* CAMPO PARA LA URL DEL AVATAR */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Avatar URL
          </label>
          <input
            {...register("avatarUrl")} // REGISTRA EL INPUT "avatarUrl"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.avatarUrl
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {/* MUESTRA EL MENSAJE DE ERROR SI EXISTE */}
          {errors.avatarUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.avatarUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* BOTONES DE ENVIAR Y CANCELAR */}
      <div className="mt-4 flex space-x-2">
        {/* BOTÓN DE ENVÍO */}
        <button
          type="submit"
          disabled={isSubmitting} // DESHABILITADO MIENTRAS SE ENVÍA
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 transition"
        >
          {/* MUESTRA "Enviando..." SI ESTÁ ENVIANDO */}
          {isSubmitting ? "Enviando..." : submitLabel}
        </button>

        {/* BOTÓN DE CANCELAR SI SE PROPORCIONÓ LA FUNCIÓN */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel} // LLAMA A onCancel AL HACER CLICK
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

// DEFINICIÓN DE LAS PROPIEDADES ESPERADAS PARA ESTE COMPONENTE
ProfileForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string, // NOMBRE COMO STRING
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // EDAD COMO STRING O NÚMERO
    avatarUrl: PropTypes.string, // URL COMO STRING
  }),
  onSubmit: PropTypes.func.isRequired, // FUNCIÓN OBLIGATORIA PARA ENVÍO
  onCancel: PropTypes.func, // FUNCIÓN OPCIONAL PARA CANCELAR
  submitLabel: PropTypes.string.isRequired, // TEXTO DEL BOTÓN DE ENVÍO
}
