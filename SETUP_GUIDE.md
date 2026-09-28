# Guía Paso a Paso - Setup Completo

## 🎯 Objetivo

Configurar un sistema web para controlar evidencias de compra y puntos acumulados para ganar el viaje a Punta Cana 2027.

## 📋 Requisitos Previos

- Cuenta en [supabase.com](https://supabase.com)
- Cuenta en [vercel.com](https://vercel.com)
- GitHub account (opcional, pero recomendado)
- Node.js 18+ instalado

---

## Paso 1: Crear Proyecto Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Haz click en "New Project"
3. Ingresa detalles:
   - **Project name**: `viaje-punta-cana-2027`
   - **Database Password**: Genera una fuerte (guárdala)
   - **Region**: La más cercana a tu zona
4. Espera a que se cree el proyecto (2-3 minutos)

---

## Paso 2: Obtener Credenciales Supabase

1. En el dashboard de Supabase, ve a **Settings > API**
2. Copia estos valores:
   - `Project URL` → Pégalo en `NEXT_PUBLIC_SUPABASE_URL`
   - `Anon public key` → Pégalo en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Paso 3: Crear Tablas en Supabase

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz click en "New Query"
3. Copia TODO el contenido de `SQL_SETUP.sql`
4. Pégalo en el editor
5. Haz click en "RUN"
6. Espera a que se ejecute (deberías ver "Success")

---

## Paso 4: Crear Bucket de Storage

1. En el dashboard de Supabase, ve a **Storage**
2. Haz click en "New bucket"
3. Ingresa:
   - **Name**: `submissions`
   - **Public bucket**: ✅ SÍ (marca este checkbox)
4. Haz click en "Create bucket"

---

## Paso 5: Configurar Variables de Entorno

1. En la carpeta del proyecto, abre (o crea) `.env.local`
2. Agrega estas líneas:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

3. Reemplaza los valores con los que copiaste en Paso 2

---

## Paso 6: Instalar Dependencias

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

---

## Paso 7: Ejecutar Localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Paso 8: Crear tu Cuenta de Admin

1. En la app web, haz click en "¿No tienes cuenta? Registrate"
2. Ingresa tu email y contraseña (éste será tu cuenta de admin)
3. Selecciona **Nivel 1** (o 2, no importa)
4. Haz click en "Registrarse"

### Convertir tu cuenta en Admin:

1. Ve al dashboard de Supabase
2. En **Table Editor**, abre la tabla `distributors`
3. Busca la fila con tu email
4. Haz click en la celda `is_admin` y cámbiala a `true`
5. Guarda

Ahora cuando inicies sesión, verás el panel de Admin.

---

## Paso 9: Deploy en Vercel (Opcional pero Recomendado)

### Opción A: Usando GitHub (Recomendado)

1. Pushea tu proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/viaje-punta-cana-2027.git
   git push -u origin main
   ```

2. Ve a [vercel.com](https://vercel.com)
3. Haz click en "New Project"
4. Selecciona tu repositorio de GitHub
5. En "Environment Variables", agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Haz click en "Deploy"

### Opción B: Deploy Manual

1. En la terminal:
   ```bash
   npm install -g vercel
   vercel
   ```
2. Sigue las instrucciones
3. Agrega variables de entorno cuando se pida
4. ¡Listo!

---

## 🧪 Probar el Sistema

### 1. Como Distribuidor:

1. Crea una nueva cuenta (email diferente)
2. Ingresa:
   - **Nombre Completo**: ej. "Juan Pérez"
   - **ID Distribuidor**: ej. "SG-12345"
   - **Nivel**: Selecciona 1 o 2
3. Haz click en "Registrarse"
4. Sube una imagen de prueba
5. Observa el status "Pendiente"

### 2. Como Admin:

1. Cierra sesión
2. Inicia sesión con tu cuenta de admin
3. Deberías ver el panel de admin
4. Busca la evidencia que acabas de crear
5. Haz click en "Aprobar"
6. Ingresa puntos (ej: 3)
7. Haz click en "Guardar"

### 3. Vuelve como Distribuidor:

1. Cierra sesión
2. Inicia sesión con la cuenta de distribuidor
3. Verifica que los puntos aparezcan (3/90)

---

## 📊 Monitoreo y Mantenimiento

### Ver distribuidores y sus puntos:

1. Dashboard de Supabase → Table Editor
2. Abre tabla `distributors`
3. Puedes ver todos los distribuidores

### Ver evidencias:

1. Dashboard de Supabase → Table Editor
2. Abre tabla `submissions`
3. Filtra por `status` para ver pendientes/aprobadas/rechazadas

### Ver puntos acumulados:

Desde el panel de Admin en la app, ves un resumen de:
- Total de distribuidores
- Evidencias pendientes
- Ganadores del viaje (90+ pts)
- Lista con puntos de cada distribuidor

---

## 🆘 Solucionar Problemas

### "Error de autenticación" o "No puedo iniciar sesión"

- Verifica que las credenciales de Supabase estén correctas en `.env.local`
- Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### "No puedo subir imágenes"

- Verifica que el bucket `submissions` existe y es público
- Checa que la URL de Supabase sea correcta

### "No veo el panel de admin"

- Verifica que `is_admin = true` en la tabla `distributors`
- Cierra sesión y vuelve a iniciar sesión

### "La base de datos está vacía"

- Ejecuta nuevamente el SQL de `SQL_SETUP.sql`
- Verifica que no hay errores en la ejecución

---

## 📞 Contacto y Soporte

Si necesitas ayuda, contacta con el equipo de desarrollo.

---

## ✅ Checklist Final

- [ ] Proyecto Supabase creado
- [ ] Credenciales copiadas en `.env.local`
- [ ] Tablas creadas (SQL ejecutado)
- [ ] Bucket `submissions` creado
- [ ] `npm install` ejecutado
- [ ] `npm run dev` funciona
- [ ] Puedo registrarme como distribuidor
- [ ] Puedo loguearme como admin
- [ ] Puedo subir imágenes
- [ ] Puedo aprobar evidencias
- [ ] Puedo ver puntos en el dashboard

¡Si todo funciona, estás listo para lanzar el sistema!
