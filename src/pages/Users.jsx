// // // frontend/src/pages/Users.jsx
// // import { useState, useEffect, useContext } from 'react';
// // import axios from '../api/axios';
// // import Swal from 'sweetalert2';
// // import { toast } from 'react-toastify';
// // import { AuthContext } from '../context/AuthContext';

// // export default function Users() {
// //   const { user } = useContext(AuthContext);
// //   const isAdmin = user.role === 'admin';

// //   // ahora incluimos password y confirm en el form
// //   const [form, setForm] = useState({
// //     email:   '',
// //     role:    'adult',  // coincide con tus roles: 'admin','adult','child'
// //     password: '',
// //     confirm:  ''
// //   });
// //   const [editingId, setEditingId] = useState(null);
// //   const [users, setUsers] = useState([]);

// //   // Carga inicial
// //   useEffect(() => {
// //     const url = isAdmin ? '/users' : '/users/me';
// //     axios.get(url)
// //       .then(res => {
// //         const data = Array.isArray(res.data) ? res.data : [res.data];
// //         setUsers(data);
// //       })
// //       .catch(() => toast.error('No se pudieron cargar los usuarios'));
// //   }, [isAdmin]);

// //   // Crear o actualizar
// //   const handleSubmit = async e => {
// //     e.preventDefault();
// //     const { email, role, password, confirm } = form;

// //     // Validaciones
// //     if (!email || !role || (!editingId && (!password || !confirm))) {
// //       toast.warn('Completa todos los campos obligatorios');
// //       return;
// //     }
// //     if ((password || confirm) && password !== confirm) {
// //       toast.error('Las contraseñas no coinciden');
// //       return;
// //     }

// //     try {
// //       if (editingId) {
// //         // al editar, enviamos sólo password si el usuario la llenó
// //         const body = { email, role };
// //         if (password) body.password = password;
// //         const { data } = await axios.put(`/users/${editingId}`, body);
// //         toast.success('Usuario actualizado');
// //         setUsers(u => u.map(x => x._id === editingId ? data : x));
// //       } else {
// //         // crear
// //         const { data } = await axios.post('/users', { email, role, password });
// //         toast.success('Usuario creado');
// //         setUsers(u => [...u, data]);
// //       }
// //       // reset form
// //       setForm({ email:'', role:'adult', password:'', confirm:'' });
// //       setEditingId(null);
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Error guardando usuario');
// //     }
// //   };

// //   const handleEdit = u => {
// //     setEditingId(u._id);
// //     setForm({
// //       email:   u.email,
// //       role:    u.role,
// //       password: '',
// //       confirm:  ''
// //     });
// //   };

// //   const handleDelete = async id => {
// //     const { isConfirmed } = await Swal.fire({
// //       title: '¿Borrar este usuario?',
// //       icon: 'warning',
// //       showCancelButton: true,
// //       confirmButtonText: 'Sí, borrar',
// //       cancelButtonText: 'Cancelar'
// //     });
// //     if (!isConfirmed) return;
// //     try {
// //       await axios.delete(`/users/${id}`);
// //       toast.success('Usuario eliminado');
// //       setUsers(u => u.filter(x => x._id !== id));
// //     } catch {
// //       toast.error('Error al eliminar');
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">
// //         {isAdmin ? 'Gestión de Usuarios' : 'Mi Cuenta'}
// //       </h1>

// //       {/* Form (sólo admin puede crear; ambos pueden editar su cuenta) */}
// //       {(isAdmin || editingId === user._id) && (
// //         <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
// //           <h2 className="text-xl mb-2">
// //             {editingId ? 'Editar usuario' : 'Crear usuario'}
// //           </h2>

// //           {/* Email */}
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             value={form.email}
// //             onChange={e => setForm({ ...form, email: e.target.value })}
// //             className="border p-2 mb-2 w-full"
// //             required
// //           />

// //           {/* Contraseña */}
// //           <input
// //             type="password"
// //             placeholder={editingId ? 'Nueva contraseña (opc.)' : 'Contraseña'}
// //             value={form.password}
// //             onChange={e => setForm({ ...form, password: e.target.value })}
// //             className="border p-2 mb-2 w-full"
// //             minLength={6}
// //             {...(!editingId && { required: true })}
// //           />

// //           {/* Repetir contraseña */}
// //           <input
// //             type="password"
// //             placeholder={editingId ? 'Repite nueva contraseña' : 'Repite contraseña'}
// //             value={form.confirm}
// //             onChange={e => setForm({ ...form, confirm: e.target.value })}
// //             className="border p-2 mb-2 w-full"
// //             {...(!editingId && { required: true })}
// //           />

// //           {/* Rol (solo admin puede cambiar rol) */}
// //           <select
// //             value={form.role}
// //             onChange={e => setForm({ ...form, role: e.target.value })}
// //             className="border p-2 mb-4 w-full"
// //             disabled={!isAdmin}
// //           >
// //             <option value="admin">Administrador</option>
// //             <option value="adult">Adulto</option>
// //             <option value="child">Niño</option>
// //           </select>

// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
// //           >
// //             {editingId ? 'Guardar cambios' : 'Crear usuario'}
// //           </button>
// //           {editingId && (
// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setEditingId(null);
// //                 setForm({ email:'', role:'adult', password:'', confirm:'' });
// //               }}
// //               className="text-gray-600"
// //             >
// //               Cancelar
// //             </button>
// //           )}
// //         </form>
// //       )}

// //       {/* Tabla de usuarios */}
// //       <table className="min-w-full bg-white rounded shadow overflow-hidden">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="px-4 py-2">Email</th>
// //             <th className="px-4 py-2">Rol</th>
// //             {isAdmin && <th className="px-4 py-2">Acciones</th>}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {users.map(u => (
// //             <tr key={u._id} className="border-b">
// //               <td className="px-4 py-2">{u.email}</td>
// //               <td className="px-4 py-2">{u.role}</td>
// //               {isAdmin && (
// //                 <td className="px-4 py-2 space-x-2">
// //                   <button
// //                     onClick={() => handleEdit(u)}
// //                     className="text-green-600 hover:text-green-800"
// //                   >
// //                     ✏️
// //                   </button>
// //                   <button
// //                     onClick={() => handleDelete(u._id)}
// //                     className="text-red-600 hover:text-red-800"
// //                   >
// //                     🗑️
// //                   </button>
// //                 </td>
// //               )}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }


// // frontend/src/pages/Users.jsx
// import { useState, useEffect, useContext } from 'react';
// import axios from '../api/axios';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../context/AuthContext';

// // React‑Hook‑Form + Yup imports
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// // ---- Schema de validación ----
// const schema = yup.object({
//   email:   yup.string().email("Email inválido").required("El email es obligatorio"),
//   password: yup.string()
//     .when('isEdit', {
//       is: false,
//       then: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
//       otherwise: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").notRequired()
//     }),
//   confirm: yup.string()
//     .oneOf([yup.ref('password'), null], "Las contraseñas no coinciden")
//     .when('isEdit', {
//       is: false,
//       then: yup.string().required("Debes confirmar la contraseña"),
//       otherwise: yup.string().notRequired()
//     }),
//   role:    yup.string().oneOf(['admin','adult','child'], "Rol inválido").required("El rol es obligatorio"),
//   isEdit:  yup.boolean()  // campo auxiliar
// }).required();

// export default function Users() {
//   const { user } = useContext(AuthContext);
//   const isAdmin = user.role === 'admin';

//   const [editingId, setEditingId] = useState(null);
//   const [users, setUsers] = useState([]);

//   // React‑Hook‑Form setup
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting }
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       email: '',
//       password: '',
//       confirm: '',
//       role: 'adult',
//       isEdit: false
//     }
//   });

//   // Carga inicial de usuarios
//   useEffect(() => {
//     const url = isAdmin ? '/users' : '/users/me';
//     axios.get(url)
//       .then(res => {
//         const data = Array.isArray(res.data) ? res.data : [res.data];
//         setUsers(data);
//       })
//       .catch(() => toast.error('No se pudieron cargar los usuarios'));
//   }, [isAdmin]);

//   // Al enviar el formulario
//   const onSubmit = async (data) => {
//     try {
//       if (editingId) {
//         const body = { email: data.email, role: data.role };
//         if (data.password) body.password = data.password;
//         const { data: updated } = await axios.put(`/users/${editingId}`, body);
//         toast.success('Usuario actualizado');
//         setUsers(u => u.map(x => x._id === editingId ? updated : x));
//       } else {
//         const { data: created } = await axios.post('/users', {
//           email: data.email,
//           role: data.role,
//           password: data.password
//         });
//         toast.success('Usuario creado');
//         setUsers(u => [...u, created]);
//       }
//       handleCancel();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error guardando usuario');
//     }
//   };

//   // Preparar edición
//   const handleEdit = (u) => {
//     setEditingId(u._id);
//     reset({
//       email: u.email,
//       password: '',
//       confirm: '',
//       role: u.role,
//       isEdit: true
//     });
//   };

//   // Cancelar edición
//   const handleCancel = () => {
//     setEditingId(null);
//     reset({ email:'', password:'', confirm:'', role:'adult', isEdit: false });
//   };

//   // Eliminar usuario
//   const handleDelete = async (id) => {
//     const { isConfirmed } = await Swal.fire({
//       title: '¿Borrar este usuario?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, borrar',
//       cancelButtonText: 'Cancelar'
//     });
//     if (!isConfirmed) return;
//     try {
//       await axios.delete(`/users/${id}`);
//       toast.success('Usuario eliminado');
//       setUsers(u => u.filter(x => x._id !== id));
//       if (editingId === id) handleCancel();
//     } catch {
//       toast.error('Error al eliminar');
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         {isAdmin ? 'Gestión de Usuarios' : 'Mi Cuenta'}
//       </h1>

//       {(isAdmin || editingId === user._id) && (
//         <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-4 rounded shadow space-y-4">
//           <h2 className="text-xl mb-2">{editingId ? 'Editar usuario' : 'Crear usuario'}</h2>

//           {/* Email */}
//           <div>
//             <label className="block mb-1 font-medium">Email</label>
//             <input
//               type="email"
//               {...register("email")}
//               className={`w-full border p-2 rounded ${
//                 errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
//               }`}
//             />
//             {errors.email && <p className="text-red-600 font-bold mt-1">{errors.email.message}</p>}
//           </div>

//           {/* Contraseña */}
//           <div>
//             <label className="block mb-1 font-medium">
//               {editingId ? 'Nueva contraseña (opc.)' : 'Contraseña'}
//             </label>
//             <input
//               type="password"
//               {...register("password")}
//               className={`w-full border p-2 rounded ${
//                 errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
//               }`}
//             />
//             {errors.password && <p className="text-red-600 font-bold mt-1">{errors.password.message}</p>}
//           </div>

//           {/* Confirmar contraseña */}
//           <div>
//             <label className="block mb-1 font-medium">
//               {editingId ? 'Repite nueva contraseña' : 'Repite contraseña'}
//             </label>
//             <input
//               type="password"
//               {...register("confirm")}
//               className={`w-full border p-2 rounded ${
//                 errors.confirm ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
//               }`}
//             />
//             {errors.confirm && <p className="text-red-600 font-bold mt-1">{errors.confirm.message}</p>}
//           </div>

//           {/* Rol */}
//           <div>
//             <label className="block mb-1 font-medium">Rol</label>
//             <select
//               {...register("role")}
//               disabled={!isAdmin}
//               className={`w-full border p-2 rounded ${
//                 errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
//               }`}
//             >
//               <option value="admin">Administrador</option>
//               <option value="adult">Adulto</option>
//               <option value="child">Niño</option>
//             </select>
//             {errors.role && <p className="text-red-600 font-bold mt-1">{errors.role.message}</p>}
//           </div>

//           {/* Botones */}
//           <div className="flex items-center space-x-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
//             >
//               {isSubmitting
//                 ? (editingId ? 'Actualizando…' : 'Creando…')
//                 : (editingId ? 'Guardar cambios' : 'Crear usuario')}
//             </button>
//             {editingId && (
//               <button type="button" onClick={handleCancel} className="text-gray-600">
//                 Cancelar
//               </button>
//             )}
//           </div>
//         </form>
//       )}

//       {/* Tabla de usuarios */}
//       <table className="min-w-full bg-white rounded shadow overflow-hidden">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="px-4 py-2">Email</th>
//             <th className="px-4 py-2">Rol</th>
//             {isAdmin && <th className="px-4 py-2">Acciones</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(u => (
//             <tr key={u._id} className="border-b hover:bg-gray-50">
//               <td className="px-4 py-2">{u.email}</td>
//               <td className="px-4 py-2">{u.role}</td>
//               {isAdmin && (
//                 <td className="px-4 py-2 space-x-2">
//                   <button
//                     onClick={() => handleEdit(u)}
//                     className="text-green-600 hover:text-green-800"
//                   >✏️</button>
//                   <button
//                     onClick={() => handleDelete(u._id)}
//                     className="text-red-600 hover:text-red-800"
//                   >🗑️</button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
// );
// }


// frontend/src/pages/Users.jsx
import { useState, useEffect, useContext, useMemo } from 'react';
import axios from '../api/axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// --- Esquema para CREAR (password + confirm obligatorios) ---
const createSchema = yup.object({
  email:   yup.string().email("Email inválido").required("El email es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
  confirm: yup.string().oneOf([yup.ref('password'), null], "Las contraseñas no coinciden").required("Debes confirmar la contraseña"),
  role:    yup.string().oneOf(['admin','adult','child'], "Rol inválido").required("El rol es obligatorio"),
});

// --- Esquema para EDITAR (password + confirm opcionales) ---
// const editSchema = yup.object({
//   email:   yup.string().email("Email inválido").required("El email es obligatorio"),
//   password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").notRequired(),
//   confirm: yup.string()
//     .oneOf([yup.ref('password'), null], "Las contraseñas no coinciden")
//     .when('password', {
//       is: val => !!val,
//       then: schema => schema.required("Debes confirmar la contraseña"),
//       otherwise: schema => schema.notRequired()
//     }),
//   role:    yup.string().oneOf(['admin','adult','child'], "Rol inválido").required("El rol es obligatorio"),
// });

const editSchema = yup.object({
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  // transformamos cadena vacía a undefined para que no entre en min cuando el usuario no quiere cambiarla
  password: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .notRequired()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirm: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .notRequired()
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir")
    .when("password", {
      is: (val) => typeof val === "string" && val.length > 0,
      then: (schema) => schema.required("Debes confirmar la nueva contraseña"),
    }),
  role: yup
    .string()
    .oneOf(["admin", "adult", "child"], "Rol inválido")
    .required("El rol es obligatorio"),
}).required();

export default function Users() {
  const { user } = useContext(AuthContext);
  const isAdmin = user.role === 'admin';

  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);

  // Seleccionamos resolver según modo
  const resolver = useMemo(
    () => yupResolver(editingId ? editSchema : createSchema),
    [editingId]
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver,
    defaultValues: {
      email: '',
      password: '',
      confirm: '',
      role: 'adult'
    }
  });

  // Carga inicial de usuarios
  useEffect(() => {
    const url = isAdmin ? '/users' : '/users/me';
    axios.get(url)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setUsers(data);
      })
      .catch(() => toast.error('No se pudieron cargar los usuarios'));
  }, [isAdmin]);

  // Envío del formulario
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        const body = { email: data.email, role: data.role };
        if (data.password) body.password = data.password;
        const { data: updated } = await axios.put(`/users/${editingId}`, body);
        toast.success('Usuario actualizado');
        setUsers(u => u.map(x => x._id === editingId ? updated : x));
      } else {
        const { data: created } = await axios.post('/users', {
          email: data.email,
          role: data.role,
          password: data.password
        });
        toast.success('Usuario creado');
        setUsers(u => [...u, created]);
      }
      handleCancel();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error guardando usuario');
    }
  };

  // Preparar edición
  const handleEdit = (u) => {
    setEditingId(u._id);
    reset({
      email: u.email,
      password: '',
      confirm: '',
      role: u.role
    });
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    reset({ email:'', password:'', confirm:'', role:'adult' });
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Borrar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;
    try {
      await axios.delete(`/users/${id}`);
      toast.success('Usuario eliminado');
      setUsers(u => u.filter(x => x._id !== id));
      if (editingId === id) handleCancel();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isAdmin ? 'Gestión de Usuarios' : 'Mi Cuenta'}
      </h1>

      {(isAdmin || editingId === user._id) && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-xl mb-2">{editingId ? 'Editar usuario' : 'Crear usuario'}</h2>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full border p-2 rounded ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            />
            {errors.email && <p className="text-red-600 font-bold mt-1">{errors.email.message}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block mb-1 font-medium">
              {editingId ? 'Nueva contraseña (opc.)' : 'Contraseña'}
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full border p-2 rounded ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            />
            {errors.password && <p className="text-red-600 font-bold mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block mb-1 font-medium">
              {editingId ? 'Repite nueva contraseña' : 'Repite contraseña'}
            </label>
            <input
              type="password"
              {...register("confirm")}
              className={`w-full border p-2 rounded ${
                errors.confirm ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            />
            {errors.confirm && <p className="text-red-600 font-bold mt-1">{errors.confirm.message}</p>}
          </div>

          {/* Rol */}
          <div>
            <label className="block mb-1 font-medium">Rol</label>
            <select
              {...register("role")}
              disabled={!isAdmin}
              className={`w-full border p-2 rounded ${
                errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            >
              <option value="admin">Administrador</option>
              <option value="adult">Adulto</option>
              <option value="child">Niño</option>
            </select>
            {errors.role && <p className="text-red-600 font-bold mt-1">{errors.role.message}</p>}
          </div>

          {/* Botones */}
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
            >
              {isSubmitting
                ? (editingId ? 'Actualizando…' : 'Creando…')
                : (editingId ? 'Guardar cambios' : 'Crear usuario')}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="text-gray-600">
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Tabla de usuarios */}
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            {isAdmin && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
              {isAdmin && (
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="text-green-600 hover:text-green-800"
                  >✏️</button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:text-red-800"
                  >🗑️</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
