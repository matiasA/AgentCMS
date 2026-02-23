<div align="center">
  <img src="https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.jpg" width="100%" alt="Banner CMS" style="border-radius: 12px; margin-bottom: 20px" />

  # 🚀 Mi CMS — El Clon Moderno de WordPress
  
  **WordPress reinventado usando Next.js 15, React, Prisma y Superpoderes de Inteligencia Artificial.**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-GPT4o--mini-412991?style=flat-square&logo=openai)](https://openai.com/)
</div>

---

<p align="center">
  <b>Mi CMS</b> es una plataforma de gestión de contenido completa construida desde cero. Copia la amada (y odiada) interfaz de administración de WordPress, pero debajo del capó está reescrita con las tecnologías web más rápidas y modernas disponibles, inyectando herramientas impulsadas por IA que cambian las reglas del juego.
</p>

---

## ✨ Características Principales

### 🧠 Superpoderes de IA (Fase 4 Completada)
Despídete de los bloqueos creativos y de las tareas repetitivas de SEO:
* **Generación Automática de SEO:** Un solo clic lee todo tu bloque de texto y genera Title y meta-descriptions ganadoras usando GPT-4o-mini.
* **Mini-Agente de Escritura:** Integrado directamente en el editor BlockNote. Selecciona texto y pídele a la IA que lo _Expanda_, _Acorte_, o lo haga más _Profesional/Casual_.
* **Generador de Portadas DALL-E 3:** ¿No tienes imagen destacada para tu entrada? Créala al instante con un prompt inteligente basado en tu artículo.
* **Búsqueda Semántica:** No busques más por coincidencia de palabras. Cada post genera Embeddings matemáticos almacenados en PostgreSQL (`pgvector`) para buscar por el "significado" de las palabras.
* **Moderador de Comentarios Anti-Spam:** Analiza el texto de los comentarios de usuarios y arroja puntuaciones de Toxicidad y Spam. Los envía a la basura automáticamente si sobrepasan el margen.

### 💻 Interfaz de Administración Moderna
* **Diseño Familiar:** Navegación por la izquierda inspirada en `wp-admin`, hiper-suave y sin recargas de página.
* **Editor BlockNote:** Un editor basado en bloques impulsado por Notion style. `cmd+/` para añadir imágenes, listas y headings.
* **Modo Zen & Accesibilidad:** Totalmente *responsive* y optimizado gracias a los componentes UI de **shadcn**.

### 🛠️ Herramientas de Productividad
* **Command Palette (Cmd+K / Ctrl+K):** Presiona `Cmd+K` en cualquier parte del panel de control para buscar, saltar a ajustes o crear nuevas páginas en milisegundos.
* **Historial de Revisiones:** Compara y restaura versiones antiguas de tus entradas en milisegundos sin perder el contenido presente.
* **Importador WXR (XML WordPress):** Sube el `.xml` de exportación crudo de tu viejo WordPress y la app migrará tus entradas a la nueva DB local.
* **Gestor de Taxonomías:** Categorías infinitas y sistema de etiquetas simple.

---

## 📸 Capturas de Pantalla (Ejemplos)

| Escritorio Administrativo | Editor basado en Bloques con IA |
| :---: | :---: |
| <img src="./public/dashboard.png" alt="Dashboard" width="100%"/> | <img src="./public/editor.png" alt="Editor" width="100%"/> |
| *Diseño familiar y responsivo para el administrador.* | *Integración con GPT-4o-mini y BlockNote.* |

| Sitio Público Rápido (SSR) | Panel de ajustes globales |
| :---: | :---: |
| <img src="./public/frontend.png" alt="Frontend" width="100%"/> | <img src="./public/settings.png" alt="Ajustes" width="100%"/> |
| *Homepage optimizada construida en layout dinámico.* | *Personalización rápida.* |

> *Nota: Sustituye estas imágenes temporales con capturas reales cuando tu sitio esté desplegado.*

---

## 🚀 Despliegue Rápido y Guía de Instalación

Sigue estos pasos para arrancar el entorno de desarrollo local y empezar a publicar.

### 1. Clonar e Instalar
```bash
git clone https://github.com/tu-usuario/mi-cms.git
cd mi-cms
npm install
```

### 2. Variables de Entorno
Renombra el archivo `.env.example` a `.env` y rellena las siguientes credenciales vitales:

```env
# Conexión principal de BDD (Asegúrate de tener la extensión pgvector soportada)
DATABASE_URL="postgresql://user:password@localhost:5432/micms?schema=public"

# Auth.js / NextAuth
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="cualquier-string-fuerte-generado-por-openssl"

# El corazón de la IA de este CMS
OPENAI_API_KEY="sk-proj-tu-clave-aqui"

# UploadThing (Para la biblioteca de medios)
UPLOADTHING_SECRET="tu-secreto"
UPLOADTHING_APP_ID="tu-app-id"
```

### 3. Sincronización de Base de Datos
Prepara las tablas de tu Postgres presionando el Prisma Push.

```bash
npx prisma generate
npx prisma db push
```

### 4. Semilla Base del Administrador
Una vez corriendo, necesitas un administrador para entrar.

```bash
npm run dev
# Accede a http://localhost:3000/api/seed en tu navegador
```

El usuario por defecto que acabas de habilitar será:
* **Email:** `admin@ejemplo.com`
* **Contraseña:** `admin123`

### 5. ¡Listo! 🥳
Visita [http://localhost:3000/wp-admin](http://localhost:3000/wp-admin) e inicia sesión para empezar a poblar de contenido la aplicación.

---

## 🧩 Arquitectura

Este proyecto sigue una arquitectura férrea delimitada en fases para el stack de **App Router** de Next.js:

- **Rutas `@/app/(admin)`:** Protegidas bajo Auth.js. Implementan el clon del panel de control de WordPress enteramente, utilizando `dynamic rendering` para evitar copiado en caché. 
- **Rutas `@/app/(public)`:** Manejan la experiencia de usuario (Frontend), blog individual, archivos de categoría y menús con Server Actions que recuperan de Prisma los posts publicables.
- **Server Actions (`@/lib/actions/*`)**: Lógica pura del servidor apartada de la UI. Controlan el borrado lógico de páginas, algoritmos de IA y la indexación de OpenAI Vectorial.
- **Prisma Schema:** Diseñado con relaciones fuertes emulando el comportamiento "PostMeta" en atributos estrictos y enum (`PostCategory`, `Comment`, `PostRevision`).

---

## 🤝 Contribuciones

Si te gusta lo que acabas de ver y deseas que tenga algo más extravagante, sientete libre de proponer una *Pull Request*:

1. Haz un fork del repositorio
2. Crea tu rama: `git checkout -b feature/MiNuevaIdeaMagica`
3. Commitea tus cambios y da push: `git commit -m 'feat: Add magic' && git push origin feature/MiNuevaIdeaMagica`
4. ¡Crea el Pull Request!

---

<div align="center">
  Hecho con 🩵 y muchísima IA durante largas noches para ti.<br>
  <b><a href="#top">Subir al principio ⬆️</a></b>
</div>
