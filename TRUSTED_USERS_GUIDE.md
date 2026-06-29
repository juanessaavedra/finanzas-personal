# 🔐 Guía de Usuarios Confiables (Trusted Users)

## Descripción General

Este sistema implementa **doble capa de seguridad** para controlar el acceso a la aplicación:

1. **Primera capa**: Registro público deshabilitado en Supabase
2. **Segunda capa**: Solo emails en la tabla `trusted_users` pueden usar la aplicación

## 🏗️ Arquitectura

```
Usuario intenta registrarse
        ↓
¿Email en trusted_users? ──NO──> ❌ Registro rechazado
        ↓ SÍ
¿Usuario en auth.users? ──NO──> Admin debe crear usuario
        ↓ SÍ
✅ Acceso permitido
```

## 📋 Tabla: `trusted_users`

### Estructura

```sql
CREATE TABLE public.trusted_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,      -- Email autorizado
  added_by UUID,                   -- Quién lo agregó
  added_at TIMESTAMP,              -- Cuándo se agregó
  is_active BOOLEAN DEFAULT true,  -- Activo/Inactivo
  notes TEXT                       -- Notas opcionales
);
```

### Campos

- **email**: Email del usuario autorizado (único, case-insensitive)
- **added_by**: UUID del usuario que lo agregó (opcional)
- **added_at**: Timestamp de cuándo se agregó
- **is_active**: Estado del usuario (true = activo, false = desactivado)
- **notes**: Notas sobre el usuario (opcional)

## 🛠️ Operaciones Comunes

### 1. Agregar un Usuario Confiable

**Opción A: Usando la función SQL**

```sql
SELECT public.add_trusted_user(
  'nuevo-usuario@example.com',
  'Usuario agregado por admin'
);
```

**Opción B: INSERT directo**

```sql
INSERT INTO public.trusted_users (email, notes)
VALUES ('nuevo-usuario@example.com', 'Descripción del usuario');
```

### 2. Ver Todos los Usuarios Confiables

```sql
SELECT
  email,
  is_active,
  added_at,
  notes
FROM public.trusted_users
ORDER BY added_at DESC;
```

### 3. Verificar si un Email es Confiable

```sql
SELECT public.is_trusted_user('email@example.com');
-- Retorna: true o false
```

### 4. Desactivar un Usuario Confiable

```sql
SELECT public.remove_trusted_user('email@example.com');
-- Retorna: true si se encontró y desactivó, false si no existe
```

**NOTA:** Esto NO elimina el usuario, solo lo desactiva (soft delete).

### 5. Reactivar un Usuario Confiable

```sql
SELECT public.reactivate_trusted_user('email@example.com');
-- Retorna: true si se encontró y reactivó, false si no existe
```

### 6. Eliminar Permanentemente un Usuario Confiable

```sql
DELETE FROM public.trusted_users
WHERE email = 'email@example.com';
```

**⚠️ ADVERTENCIA:** Esto elimina permanentemente el registro. Usa con precaución.

## 📝 Flujo de Trabajo Completo

### Para Agregar un Nuevo Usuario

#### Paso 1: Agregar email a trusted_users

```sql
SELECT public.add_trusted_user(
  'juan@example.com',
  'Usuario nuevo - Departamento de Finanzas'
);
```

#### Paso 2: Crear usuario en Supabase Auth

**Opción A: Desde Supabase Dashboard**
1. Ve a Authentication → Users
2. Click "Invite User" o "Add User"
3. Ingresa el email: `juan@example.com`
4. Establece contraseña temporal o envía invitación
5. Usuario recibe email para confirmar

**Opción B: Usando Supabase API/SDK**

```javascript
// En el backend o script de administración
const { data, error } = await supabase.auth.admin.createUser({
  email: 'juan@example.com',
  password: 'ContraseñaTemporal123!',
  email_confirm: true // Confirma email automáticamente
});
```

#### Paso 3: Usuario inicia sesión

El usuario ahora puede iniciar sesión con su email y contraseña.

### Para Remover Acceso de un Usuario

#### Opción 1: Desactivar en trusted_users (Recomendado)

```sql
SELECT public.remove_trusted_user('juan@example.com');
```

El usuario ya no podrá acceder, pero sus datos permanecen.

#### Opción 2: Eliminar de Supabase Auth

1. Ve a Authentication → Users en Supabase Dashboard
2. Busca el usuario por email
3. Click en "..." → Delete User

**NOTA:** Esto eliminará el usuario de auth.users pero NO de trusted_users.

## 🔍 Consultas Útiles

### Usuarios confiables activos

```sql
SELECT email, added_at, notes
FROM public.trusted_users
WHERE is_active = true
ORDER BY email;
```

### Usuarios confiables inactivos

```sql
SELECT email, added_at, notes
FROM public.trusted_users
WHERE is_active = false
ORDER BY email;
```

### Usuarios confiables sin cuenta en auth

```sql
SELECT t.email, t.added_at
FROM public.trusted_users t
LEFT JOIN auth.users u ON LOWER(t.email) = LOWER(u.email)
WHERE t.is_active = true
AND u.id IS NULL;
```

### Usuarios en auth sin estar en trusted_users

```sql
SELECT u.email, u.created_at
FROM auth.users u
LEFT JOIN public.trusted_users t ON LOWER(u.email) = LOWER(t.email)
WHERE t.id IS NULL;
```

## 🚨 Troubleshooting

### Problema: Usuario no puede iniciar sesión

**Verificaciones:**

1. ¿Email está en trusted_users?
```sql
SELECT * FROM public.trusted_users WHERE email = 'user@example.com';
```

2. ¿Email está activo en trusted_users?
```sql
SELECT is_active FROM public.trusted_users WHERE email = 'user@example.com';
```

3. ¿Usuario existe en auth.users?
```sql
SELECT email, created_at FROM auth.users WHERE email = 'user@example.com';
```

### Problema: Error "Email is not authorized"

**Solución:** Agregar el email a trusted_users:
```sql
SELECT public.add_trusted_user('user@example.com', 'Agregado por error anterior');
```

### Problema: Usuario está en trusted_users pero no puede registrarse

**Causa:** Registro público está deshabilitado.

**Solución:** El administrador debe crear el usuario manualmente desde Supabase Dashboard.

## ⚙️ Configuración

### Verificar que el registro público está deshabilitado

En `supabase/config.toml`:

```toml
[auth]
enable_signup = false  # ✅ Debe ser false

[auth.email]
enable_signup = false  # ✅ Debe ser false
```

### Verificar que el trigger está activo

```sql
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'validate_trusted_user_trigger';
```

Debe retornar:
- trigger_name: `validate_trusted_user_trigger`
- event_manipulation: `INSERT`
- event_object_table: `users`

## 📊 Estadísticas

### Total de usuarios confiables

```sql
SELECT
  COUNT(*) FILTER (WHERE is_active = true) as active_users,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
  COUNT(*) as total_users
FROM public.trusted_users;
```

### Usuarios agregados en los últimos 30 días

```sql
SELECT
  DATE(added_at) as date,
  COUNT(*) as users_added
FROM public.trusted_users
WHERE added_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(added_at)
ORDER BY date DESC;
```

## 🔐 Mejores Prácticas

1. **Agregar notas descriptivas**: Siempre incluye información sobre quién es el usuario
   ```sql
   SELECT public.add_trusted_user(
     'user@example.com',
     'Juan Pérez - Contador Senior - Agregado 2024-06-29'
   );
   ```

2. **Desactivar en lugar de eliminar**: Usa `remove_trusted_user()` en lugar de DELETE
   - Mantiene historial
   - Permite reactivación
   - Mejor para auditoría

3. **Revisar periódicamente**: Audita la lista de usuarios confiables mensualmente
   ```sql
   SELECT email, notes, added_at
   FROM public.trusted_users
   WHERE is_active = true
   ORDER BY added_at DESC;
   ```

4. **Coordinar con auth.users**: Asegura que cada usuario en trusted_users tenga cuenta en auth.users

5. **Documentar cambios**: Usa el campo `notes` para documentar cambios importantes

## 📚 Funciones Disponibles

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `is_trusted_user(email)` | Verifica si email es confiable y activo | BOOLEAN |
| `add_trusted_user(email, notes)` | Agrega nuevo usuario confiable | UUID |
| `remove_trusted_user(email)` | Desactiva usuario confiable | BOOLEAN |
| `reactivate_trusted_user(email)` | Reactiva usuario confiable | BOOLEAN |

## 🆘 Soporte

Para más información sobre configuración de Supabase, ver:
- `SUPABASE_SETUP.md` - Configuración inicial
- `README.md` - Documentación general
- Migraciones en `supabase/migrations/`
- Seeds en `supabase/seed.sql`

---

**Última actualización:** 2024-06-29
