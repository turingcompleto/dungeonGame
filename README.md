# 🏰 AI Chat Dungeon

Un juego de aventuras por texto con inteligencia artificial, diseñado con el estilo retro de las terminales de los años 80.

![Terminal Retro](https://img.shields.io/badge/Terminal-Retro_80s-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange)
![Español](https://img.shields.io/badge/Idioma-Español-red)

## 🎮 Características

- **🧠 IA Avanzada**: Integración con OpenAI GPT-3.5 para narrativa dinámica
- **🎨 Estilo Retro**: Diseño auténtico de terminal de los 80s con efectos CRT
- **🇪🇸 Completamente en Español**: Interfaz y respuestas en español
- **⚔️ Sistema de Combate**: Batallas por turnos con estadísticas del jugador
- **🗺️ Exploración**: Múltiples ubicaciones interconectadas
- **📦 Inventario**: Sistema de objetos y artefactos mágicos
- **💾 Fallback Inteligente**: Funciona sin OpenAI con IA local

## 🚀 Demo

```
MAESTRO.MAZMORRAS.IA.EXE
OPENAI.GPT-3.5 - ACTIVO | LISTO PARA COMANDOS

[DM.IA]: BIENVENIDO, AVENTURERO. TE ENCUENTRAS EN LA ENTRADA DE UNA 
MISTERIOSA MAZMORRA...

ENTRADA: ir al norte
> IR AL NORTE

[DM.IA]: AVANZAS HACIA EL NORTE. UN LARGO PASILLO SE EXTIENDE ANTE TI,
ILUMINADO POR ANTORCHAS PARPADEANTES. EL ECO DE TUS PASOS RESUENA EN
LA OSCURIDAD...
```

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Clave API de OpenAI (opcional pero recomendado)

## 🛠️ Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/ai-chat-dungeon.git
cd ai-chat-dungeon
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
```bash
cp .env.example .env.local
```

4. **Edita `.env.local` y agrega tu clave de OpenAI:**
```env
VITE_OPENAI_API_KEY=sk-tu-clave-real-aqui
```

5. **Inicia el servidor de desarrollo:**
```bash
npm run dev
```

6. **¡Abre tu navegador en `http://localhost:5173` y comienza tu aventura!**

## 🔑 Configuración de OpenAI

1. Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Genera una nueva clave API
4. Cópiala en tu archivo `.env.local`

**Nota**: El juego funciona sin OpenAI, pero las respuestas serán menos dinámicas.

## 🎯 Comandos de Juego

### Movimiento
- `ir al norte/sur/este/oeste`
- `avanzar`
- `mover hacia [dirección]`

### Exploración
- `examinar alrededores`
- `mirar [objeto]`
- `observar`

### Combate
- `atacar [enemigo]`
- `luchar con [arma]`
- `usar hechizo`

### Inventario
- `inventario`
- `usar [objeto]`
- `tomar [objeto]`

### Interacción
- `hablar con [personaje]`
- `preguntar sobre [tema]`

## 🏗️ Tecnologías Utilizadas

- **Frontend**: React 18, Vite
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **IA**: OpenAI GPT-3.5 Turbo
- **Iconos**: Lucide React
- **Matemáticas**: TensorFlow.js (preparado para futuras funciones)

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── game/
│   │   ├── GameInterface.jsx    # Interfaz principal del juego
│   │   └── BootScreen.jsx       # Pantalla de arranque retro
│   └── ui/                      # Componentes de interfaz
├── services/
│   └── aiService.js             # Lógica de IA y OpenAI
├── hooks/                       # Custom hooks de React
├── utils/                       # Utilidades y helpers
└── data/                        # Datos del juego
```

## 🎨 Personalización

### Colores de Terminal
Edita `tailwind.config.js` para cambiar los colores:

```javascript
colors: {
  terminal: {
    green: '#00ff00',    // Verde fosforescente
    amber: '#ffaa00',    // Ámbar retro
    white: '#ffffff',    // Blanco
  }
}
```

### Escenarios del Juego
Modifica `src/services/aiService.js` en la función `loadScenarios()` para agregar nuevas ubicaciones.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📜 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter de código
npm run lint:fix     # Arreglar errores de lint automáticamente
```

## 🐛 Troubleshooting

### Error de OpenAI API
- Verifica que tu clave API sea válida
- Asegúrate de tener saldo en tu cuenta OpenAI
- El juego funcionará en modo local si hay problemas

### Errores de Build
```bash
rm -rf node_modules/.vite
npm run clean
npm install
```

### Problemas de Estilo
Verifica que Tailwind esté compilando correctamente:
```bash
npx tailwindcss init --force
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👏 Créditos

- Inspirado en los clásicos juegos de texto de los años 80
- Powered by OpenAI GPT-3.5
- Diseño retro inspirado en terminales CRT vintage

## 🌟 Roadmap

- [ ] Modo multijugador
- [ ] Más escenarios y aventuras
- [ ] Sistema de guardado en la nube  
- [ ] Efectos de sonido retro
- [ ] Música chiptune
- [ ] Sistema de logros
- [ ] Editor de aventuras personalizado

---

**¿Listo para la aventura? ¡Que comience la mazmorra! ⚔️**
