# 💰 Finanzas Personales - React Web App

Aplicación web de finanzas personales desarrollada con **React**, **TypeScript**, **Supabase** y **shadcn/ui**, con diseño **Financial Dashboard** profesional.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

---

## ✨ Características

### 📊 Dashboard Financiero
- **Balance total** con diseño moderno y glassmorphism
- **Ingresos y gastos** del mes con colores profit/loss
- **Tasa de ahorro** automática con porcentajes
- **Transacciones recientes** con categorías visuales e iconos
- **Navegación por meses** (anterior/siguiente)
- **Actualización en tiempo real** con pull-to-refresh

### 🔐 Seguridad
- ✅ **Registro deshabilitado** (sin registro público)
- ✅ **Sistema de usuarios confiables** (trusted_users table)
- ✅ **Doble verificación**: Usuario registrado + Email en lista de confianza
- ✅ Rate limiting (5 intentos / 15 min)
- ✅ Prevención de SQL injection
- ✅ Row Level Security (RLS) en Supabase
- ✅ Email sanitization y validación
- ✅ Password hashing (bcrypt)
- ✅ Gestión de sesiones con JWT

### 🎨 Diseño Financial Dashboard
Basado en principios de diseño financiero profesional:

- **Colores:**
  - Verde `#22C55E` para ganancias
  - Rojo `#EF4444` para pérdidas
  - Azul oscuro `#003366` para confianza
- **Tipografía:** Plus Jakarta Sans (ExtraBold, Bold, SemiBold)
- **Componentes:** shadcn/ui (Radix UI + Tailwind CSS)
- **Efectos:** Animaciones suaves y transiciones modernas
- **Formato colombiano:** Pesos (COP) sin decimales

### 🇨🇴 Formato Colombiano
- **Moneda:** `$50.000` (punto como separador de miles)
- **Fechas:** `23 jun 2024` (formato dd MMM yyyy)
- **Fechas relativas:** Hoy, Ayer, Hace 3 días

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
React 18+ con TypeScript
├── Estado: Zustand (state management)
├── Backend: Supabase (PostgreSQL + Auth)
├── Estilos: Tailwind CSS + shadcn/ui
├── Routing: React Router v7
├── Formato: date-fns (i18n español)
└── Build: Vite
```

### Estructura del Proyecto

```
src/
├── models/              # TypeScript interfaces
│   ├── user.ts
│   ├── transaction.ts
│   ├── category.ts
│   └── budget.ts
│
├── services/            # Backend services
│   ├── supabase.ts
│   ├── auth.service.ts
│   ├── transaction.service.ts
│   └── category.service.ts
│
├── stores/              # Zustand state management
│   ├── auth.store.ts
│   ├── dashboard.store.ts
│   └── transaction.store.ts
│
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── TransactionFormPage.tsx
│
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── common/         # Reusable components
│   ├── dashboard/      # Dashboard-specific components
│   └── auth/           # Auth-specific components
│
├── utils/              # Utilities
│   └── formatters.ts   # Currency and date formatting (COP)
│
├── config/             # Configuration
│   └── constants.ts    # App constants
│
├── lib/                # Library code
│   └── utils.ts        # Utility functions (cn, etc)
│
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

---

## 🚀 Instalación

### Prerequisitos

- **Node.js** 18+ instalado
- **pnpm** instalado (o npm/yarn)
- **Cuenta de Supabase** (gratis en [supabase.com](https://supabase.com))

### Paso 1: Clonar y configurar

```bash
cd finanzas-react

# Instalar dependencias
pnpm install
```

### Paso 2: Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta los scripts SQL del archivo `../SUPABASE_SETUP.md`
3. Crea un usuario manualmente (sin registro público)
4. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

5. Edita `.env` y agrega tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 3: Ejecutar la app

```bash
# Modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview
```

La app estará disponible en `http://localhost:5173`

---

## 📦 Dependencias Principales

### Producción
- `react` - Librería UI
- `react-router-dom` - Routing
- `@supabase/supabase-js` - Cliente de Supabase
- `zustand` - State management
- `shadcn/ui` - Componentes UI (Radix UI + Tailwind)
- `date-fns` - Manejo de fechas
- `lucide-react` - Iconos
- `sonner` - Notificaciones toast

### Desarrollo
- `typescript` - Tipado estático
- `vite` - Build tool y dev server
- `tailwindcss` - CSS utility-first
- `postcss` - CSS processing

---

## 🎯 Uso

### Login
1. Abre la app en `http://localhost:5173`
2. Ingresa email y contraseña del usuario creado en Supabase
3. Click en "Iniciar Sesión"

### Dashboard
- **Ver balance:** Total acumulado de todas las transacciones
- **Ver estadísticas:** Ingresos, gastos y ahorro del mes actual
- **Navegar meses:** Usa las flechas ← → para cambiar de período
- **Refrescar:** Actualiza los datos automáticamente

### Agregar/Editar Transacción
1. Click en el botón flotante `+` o en "Nueva"
2. Selecciona tipo: Ingreso o Gasto
3. Ingresa monto (ej: 50000)
4. Selecciona categoría
5. Agrega descripción
6. Selecciona fecha
7. Click en "Guardar"
8. Para editar: click en cualquier transacción de la lista

---

## 🔒 Seguridad

### Características de Seguridad Implementadas

1. **Sistema de Usuarios Confiables (Trusted Users)**
   - ✅ Registro público **DESHABILITADO** en Supabase
   - ✅ Tabla `trusted_users` controla acceso por email
   - ✅ **Doble verificación**: Usuario debe estar registrado en Supabase Y en lista de confianza
   - ✅ Solo usuarios autorizados pueden iniciar sesión
   - ✅ Trigger automático valida email en cada intento de registro
   - 🔧 Gestión de usuarios confiables:
     - Agregar: `SELECT public.add_trusted_user('email@example.com', 'notes');`
     - Remover: `SELECT public.remove_trusted_user('email@example.com');`
     - Reactivar: `SELECT public.reactivate_trusted_user('email@example.com');`
     - Verificar: `SELECT public.is_trusted_user('email@example.com');`

2. **Rate Limiting**
   - Máximo 5 intentos de login fallidos por email
   - Bloqueo temporal de 15 minutos

3. **SQL Injection Prevention**
   - Supabase usa prepared statements automáticamente
   - Email sanitization con regex en el cliente
   - Validación de formato de email en base de datos
   - Sin concatenación de SQL directo

4. **Row Level Security (RLS)**
   - Cada usuario solo puede ver sus propios datos
   - Políticas a nivel de base de datos en todas las tablas
   - trusted_users protegida con políticas específicas

5. **Password Security**
   - Hashing con bcrypt (Supabase)
   - Mínimo 6 caracteres
   - Nunca expuestas en logs o respuestas

### Configuración de Usuarios Confiables

**Para agregar usuarios autorizados:**

1. Edita `supabase/seed.sql` y agrega los emails permitidos:
```sql
INSERT INTO public.trusted_users (email, notes) VALUES
  ('tu-email@example.com', 'Descripción del usuario');
```

2. O ejecuta desde SQL Editor en Supabase Dashboard:
```sql
SELECT public.add_trusted_user('nuevo-email@example.com', 'Usuario nuevo');
```

3. Para crear el usuario completo en Supabase:
   - Ve a Authentication → Users
   - Click "Invite User" o "Add User"
   - Ingresa email (debe estar en trusted_users)
   - Usuario recibirá email de confirmación

**IMPORTANTE:** Solo emails en la tabla `trusted_users` con `is_active = true` podrán usar la aplicación.

Ver `../SUPABASE_SETUP.md` para más detalles de configuración.

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo

# Producción
pnpm build            # Build de producción
pnpm preview          # Preview del build

# Calidad
pnpm lint             # Check de tipos TypeScript
```

---

## 🎨 shadcn/ui Components

Este proyecto usa [shadcn/ui](https://ui.shadcn.com/), una colección de componentes reutilizables construidos con Radix UI y Tailwind CSS.

### Componentes Incluidos

- `button` - Botones con variantes
- `card` - Tarjetas y contenedores
- `input` - Campos de entrada
- `label` - Etiquetas de formulario
- `select` - Selects con dropdown
- `dialog` - Modales y diálogos
- `alert` - Alertas y mensajes
- `separator` - Separadores visuales
- `sonner` - Sistema de notificaciones toast

### Agregar Más Componentes

```bash
pnpm dlx shadcn@latest add <component-name>
```

---

## 🌐 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
pnpm build

# Deploy la carpeta dist/
```

### Variables de Entorno en Producción

Asegúrate de configurar las variables de entorno en tu plataforma de deploy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🚧 Roadmap

### ✅ Completado (v2.0)
- [x] Migración completa de Flutter a React
- [x] Autenticación segura con Supabase
- [x] Dashboard con balance y estadísticas
- [x] CRUD de transacciones
- [x] Formato colombiano (COP)
- [x] shadcn/ui components
- [x] Responsive design
- [x] Rate limiting
- [x] Row Level Security

### 🚧 Por Implementar
- [ ] Gestión de categorías (crear/editar/eliminar)
- [ ] Gráficos de gastos por categoría (Recharts)
- [ ] Presupuestos mensuales
- [ ] Filtros y búsqueda de transacciones
- [ ] Exportar a Excel/PDF
- [ ] Dark mode toggle
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Multi-currency support
- [ ] Testing (Vitest + React Testing Library)

---

## 🆘 Troubleshooting

### Error: "Missing Supabase credentials"
- Verifica que el archivo `.env` exista y tenga las variables correctas
- Asegúrate de que las variables empiecen con `VITE_`

### Error: "Invalid login credentials"
- Verifica que el usuario exista en Supabase
- Confirma email y password correctos
- Revisa que la tabla `users` tenga el perfil del usuario

### No se muestran transacciones
- Verifica que las políticas RLS estén creadas en Supabase
- Confirma que el `user_id` sea correcto en las transacciones
- Revisa la consola del navegador para errores

### Error de compilación TypeScript
- Ejecuta `pnpm install` para asegurar que todas las dependencias estén instaladas
- Verifica que `tsconfig.json` tenga la configuración correcta

---

## 🤝 Contribuir

Esta es una app personal, pero sugerencias son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Uso personal. No distribución pública.

---

## 📚 Recursos

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/)

---

## 👨‍💻 Autor

Migrado de Flutter a React usando arquitectura moderna y mejores prácticas.

**Tecnologías:** React + TypeScript + Supabase + shadcn/ui + Tailwind CSS

---

## 🙏 Agradecimientos

- **shadcn** por los componentes UI increíbles
- **Supabase** por el backend gratuito y fácil de usar
- **React Team** por el framework
- **Tailwind CSS** por el sistema de estilos
- **Radix UI** por los componentes accesibles

---

## 📊 Diferencias con la versión Flutter

| Característica | Flutter | React Web |
|---|---|---|
| Plataforma | iOS/Android/Web | Web optimizada |
| Lenguaje | Dart | TypeScript |
| Estado | Provider (MVVM) | Zustand |
| UI | Material Design | shadcn/ui (Radix + Tailwind) |
| Routing | go_router | React Router |
| Build | Flutter SDK | Vite |
| Tamaño | ~15MB APK | ~200KB gzipped |
| Performance | Nativa | Web moderna |

**Ventaja principal:** La versión React está optimizada para web con mejor SEO, menor tiempo de carga y accesibilidad mejorada.

---

**¿Preguntas?** Abre un issue en el repositorio.
