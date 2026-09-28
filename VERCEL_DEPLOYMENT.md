# Guía de Deployment en Vercel

## Pasos para Deployar

### 1. Conectar GitHub a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz click en "New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `viaje-punta-cana-2027`
5. Click en "Import"

### 2. Configurar Variables de Entorno

En Vercel Dashboard → Project Settings → Environment Variables, agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://nrfdveqgurpgvnogqwiz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fwralFH3_YFcJi_bOugQWA_VieiXRcK
```

### 3. Deploy

1. Vercel deployará automáticamente en cada push a `main`
2. Espera a que termine el build (2-3 minutos)
3. Tu app estará en vivo en: `https://<proyecto>.vercel.app`

## Configuración de Supabase Storage para Producción

### 1. Habilitar CORS en Storage

En Supabase Dashboard → Settings → Storage:

```sql
-- Ejecuta en SQL Editor
ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
```

### 2. Policy para Uploads Públicos

```sql
-- Ya ejecutado - RLS está deshabilitado
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
```

### 3. Verificar Bucket

- ✅ Bucket `submissions` existe
- ✅ Es público (PUBLIC policy)
- ✅ RLS está deshabilitado

## URLs de Producción

```
Landing: https://<proyecto>.vercel.app/landing
Inicio de Sesión: https://<proyecto>.vercel.app/
Dashboard: https://<proyecto>.vercel.app/dashboard
```

## Variables de Entorno de Producción

Vercel usa automáticamente:
- `NEXT_PUBLIC_SUPABASE_URL` - URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave pública

No necesitas:
- `.env.local` (Vercel lo ignora)
- Variables privadas (no tenemos backend)

## Testing en Producción

1. Ve a `https://<proyecto>.vercel.app/landing`
2. Haz click en "Registrarse"
3. Crea una cuenta de test
4. Sube una evidencia
5. El admin aprueba los cambios
6. Verifica puntos en tiempo real

## Troubleshooting

### Error 400 en Upload
- Verifica que RLS esté deshabilitado en submissions
- Verifica que CORS esté habilitado en Storage

### Error de Autenticación
- Verifica variables de entorno en Vercel
- Recarga la página (Ctrl+Shift+R)

### Storage no funciona
- Usa URLs de placeholder por ahora
- Configura Storage correctamente después

## Monitoreo

- Vercel Analytics: https://vercel.com/dashboard
- Supabase Logs: Supabase Dashboard → Logs
- Network Requests: DevTools → Network tab

¡Listo para producción! 🚀
