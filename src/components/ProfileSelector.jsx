// src/components/ProfileSelector.jsx
/* ESTE COMPONENTE MUESTRA UNA TARJETA DE PERFIL CON AVATAR Y NOMBRE, Y PERMITE SELECCIONARLO MEDIANTE UN CLIC. USA PropTypes PARA VALIDAR QUE RECIBA LOS DATOS CORRECTOS. */

// IMPORTA PropTypes PARA LA VALIDACIÓN DE TIPOS DE PROPIEDADES
import PropTypes from "prop-types"

// DEFINE Y EXPORTA EL COMPONENTE ProfileSelector
export default function ProfileSelector({ profile, onSelect }) {
  return (
    // CONTENEDOR PRINCIPAL CON ESTILOS Y EVENTO onClick QUE EJECUTA onSelect CON EL PERFIL COMO ARGUMENTO
    <div
      onClick={() => onSelect(profile)} // AL HACER CLIC, LLAMA A LA FUNCIÓN onSelect PASÁNDOLE EL PERFIL SELECCIONADO
      className="flex flex-col items-center cursor-pointer p-4 m-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
    >

       {/* AVATAR DEL PERFIL */}
      <img
        src={profile.avatarUrl} // IMAGEN DEL PERFIL USANDO LA URL DEL AVATAR
        alt={profile.name} // TEXTO ALTERNATIVO USANDO EL NOMBRE DEL PERFIL
        className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600"
      />

      {/* NOMBRE DEL PERFIL */}
      <span className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-100">
        {profile.name} {/* MUESTRA EL NOMBRE DEL PERFIL */}
      </span>
    </div>
  )
}

// DEFINICIÓN DE LOS TIPOS DE PROPIEDADES QUE EL COMPONENTE ESPERA
ProfileSelector.propTypes = {
  profile: PropTypes.shape({ // EL OBJETO profile DEBE TENER:
    id: PropTypes.string.isRequired, // UN id TIPO STRING, OBLIGATORIO
    name: PropTypes.string.isRequired, // UN name TIPO STRING, OBLIGATORIO
    avatarUrl: PropTypes.string, // UN avatarUrl TIPO STRING, OPCIONAL
  }).isRequired, // EL OBJETO profile ES OBLIGATORIO
  onSelect: PropTypes.func.isRequired, // LA FUNCIÓN onSelect ES OBLIGATORIA
}
