# Sistema de Control de Viaje Punta Cana 2027

Sistema web para controlar evidencias de compra y puntos acumulados para ganar el viaje a Punta Cana 2027 de Sinergia Global.

## Características

✅ **Autoregistro de distribuidores** con email y contraseña  
✅ **Subida de evidencias** de compra (imágenes)  
✅ **Dashboard de admin** para aprobar/rechazar evidencias  
✅ **Asignación automática de puntos** (3 pts base + puntos extras del admin)  
✅ **Dashboard de distribuidor** con progreso hacia los 90 puntos  
✅ **Seguimiento de 12 semanas** (28 sept. - 21 dic. 2026)  
✅ **Niveles 1 y 2** de distribuidores  
✅ **Storage de imágenes** en Supabase  

## Tech Stack

- **Frontend**: Next.js 15 + React + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Vercel

## Setup

### 1. Clonar y instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia la URL y la anon key del proyecto
3. Agrega a `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

### 3. Crear tablas en Supabase

1. Ve a SQL Editor en Supabase Dashboard
2. Copia y ejecuta el contenido de `SQL_SETUP.sql`

### 4. Crear Storage Bucket

1. Ve a Storage en Supabase Dashboard
2. Crea un nuevo bucket llamado `submissions`
3. Hazlo público (public policy)

### 5. Configurar Admin

Para que un usuario sea admin, actualiza manualmente en la base de datos:

```sql
UPDATE public.distributors 
SET is_admin = true 
WHERE email = 'tu@email.com';
```

O usa el dashboard de Supabase para editar la fila.

### 6. Ejecutar localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Flujo de Uso

### Para Distribuidores

1. Regístrate con email, contraseña, nombre completo e ID distribuidor
2. Selecciona tu nivel (1 o 2)
3. Sube evidencia de compra (imagen)
4. Espera a que el admin apruebe
5. Acumula puntos hasta 90 para ganar el viaje

### Para Admin

1. Inicia sesión (tu cuenta debe tener `is_admin = true`)
2. Ve el panel de "Evidencias Pendientes"
3. Revisa la imagen de compra
4. Asigna puntos (3 por defecto, o más si lo deseas)
5. Aprueba o rechaza la evidencia

## Estructura de Base de Datos

### Tabla: distributors
- `id` (UUID, PK)
- `auth_id` (UUID, FK a auth.users)
- `email` (text)
- `full_name` (text) - Nombre completo del distribuidor
- `distributor_id` (text) - ID único del distribuidor (ej: SG-12345)
- `level` (integer) - 1 o 2
- `is_admin` (boolean)
- `created_at`, `updated_at`

### Tabla: campaigns
- `id` (UUID, PK)
- `name` (text)
- `start_date`, `end_date` (timestamp)
- `goal_points` (integer) - 90 por defecto
- `status` (text) - active/inactive
- `created_at`, `updated_at`

### Tabla: submissions
- `id` (UUID, PK)
- `distributor_id` (UUID, FK)
- `campaign_id` (UUID, FK)
- `image_url` (text)
- `status` (text) - pending/approved/rejected
- `level` (integer) - 1 o 2
- `points` (integer) - puntos asignados
- `notes` (text)
- `created_at`, `approved_at`, `updated_at`

## Deploy en Vercel

1. Pushea el repo a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático en cada push

## Seguridad

- Autenticación con Supabase Auth (email + password)
- Row Level Security (RLS) habilitado en tablas
- Distribuidores solo ven sus propios datos
- Admin tiene acceso total
- Imágenes almacenadas en Storage de Supabase

## Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL=<tu-url-supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```
