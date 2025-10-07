# Juego del Gato con IA (Mini-Max)

Este proyecto fue desarrollado como parte de un curso de **Análisis de Algoritmos**.  
Consiste en el clásico **Juego Gato, pero con un toque especial:  
una **IA** implementada con el algoritmo **Mini-Max con poda alfa-beta**, capaz de analizar las jugadas y tomar decisiones óptimas.

Está hecho con **React + Next.js** en el frontend y **Node.js + Express** en el backend, todo integrado en un mismo proyecto y desplegado en **Vercel**.

---

## ¿Qué hace el proyecto?

- Permite jugar contra la computadora "IA" o reiniciar la partida.
- Tiene dos niveles de dificultad:  
   *Fácil:* la IA juega en modo aleatoreo.  
  *Difícil:* usa Mini-Max para no perder nunca.
- Muestra quién gana o si hay empate.
- Se puede probar en local o desde la web (deploy en Vercel).

---

##  Algoritmo Mini-Max

El Mini-Max analiza **todas las jugadas posibles** y elige la mejor opción para la computadora,  
suponiendo que el jugador humano también jugará perfectamente, el algoritmo ignora caminos innecesarios, haciendo el proceso más rápido.

---

## Tecnologías utilizadas

- **Frontend:** React + Next.js 14  
- **Backend:** Node.js + Express  
- **Lenguaje:** JavaScript (ES Modules)  
- **Despliegue:** Vercel  

---

## Estructura del proyecto

```
GATO/
│
├── app/                     → interfaz Next.js (frontend principal)
│   ├── globals.css          → estilos globales
│   ├── layout.tsx           → estructura base del sitio
│   └── page.jsx             → punto de entrada principal
│
├── api/
│   └── move.js              → conecta Next con el backend Express
│
├── backend/                 → lógica del servidor
│   └── src/
│       ├── controller/      → lógica del juego
│       ├── model/           → algoritmo Mini-Max
│       ├── routes/          → rutas del backend
│       └── app.js           → configuración Express
│
├── frontend/                → vista del juego
│   └── src/
│       ├── components/      → Board, Cell, Controls
│       ├── controller/      → reglas del juego
│       ├── services/        → conexión API
│       ├── styles/          → estilos del tablero
│       └── view/            → GameView.jsx
│
├── .env.local
├── next.config.cjs
├── package.json
└── README.md
```

---

## Cómo ejecutar el proyecto en **localhost**

### Clonar el repositorio

Abre una terminal o CMD y escribe:

```bash
git clone https://github.com/usuario/gato-minimax.git
cd gato-minimax
```

---

### Instalar dependencias

Ejecuta:

```bash
npm install
```

Esto descargará todas las librerías necesarias (React, Express, etc.).

---

###  Crear el archivo `.env.local`

En la raíz del proyecto, crea un archivo llamado `.env.local` con este contenido:

```
NEXT_PUBLIC_API_URL=/api

```

Esto le indica al frontend dónde encontrar el backend local.

---

### Ejecutar frontend y backend juntos

En la terminal, ejecuta:

```bash
npm run dev
```

Esto levantará dos servidores:

- **Frontend:** http://localhost:3000  
- **Backend:** http://localhost:3001

---

### Abrir el juego

Abrir el navegador y entra a:

**http://localhost:3000**  

O juega directamente en la versión desplegada en Vercel:

**https://gato-one.vercel.app**

Ahí podrás jugar, cambiar la dificultad, reiniciar y probar la IA.

---


Ingeniería en Sistemas — Universidad Nacional (UNA), Sede Brunca, Campus Coto.  
Proyecto para el curso de *Análisis de Algoritmos*.
