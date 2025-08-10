import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootScreen = ({ onBootComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const bootSequence = [
    "SISTEMA MAESTRO DE MAZMORRAS IA v2.1",
    "COPYRIGHT (c) 1985 RETRO COMPUTING CORP.",
    "",
    "REALIZANDO AUTODIAGNOSTICO...",
    "RAM: 64K OK",
    "ROM: 32K OK", 
    "GPU: CGA OK",
    "SONIDO: ADLIB OK",
    "",
    "CARGANDO SISTEMA OPERATIVO...",
    "KERNEL CARGADO",
    "CONTROLADORES CARGADOS",
    "SISTEMA DE ARCHIVOS MONTADO",
    "",
    "INICIALIZANDO RED NEURONAL IA...",
    "CARGANDO BASE DE DATOS DE AVENTURAS...",
    "CONECTANDO AL GENERADOR DE MAZMORRAS...",
    "CALIBRANDO SEMILLA ALEATORIA...",
    "",
    "TODOS LOS SISTEMAS OPERATIVOS",
    "LISTO PARA LA AVENTURA",
    "",
    "PRESIONA CUALQUIER TECLA PARA CONTINUAR..."
  ];

  useEffect(() => {
    if (currentLine < bootSequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, bootSequence[currentLine] === "" ? 200 : 400);
      
      return () => clearTimeout(timer);
    } else {
      const handleKeyPress = () => {
        onBootComplete();
      };
      
      window.addEventListener('keydown', handleKeyPress);
      window.addEventListener('click', handleKeyPress);
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('click', handleKeyPress);
      };
    }
  }, [currentLine, bootSequence, onBootComplete]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="min-h-screen bg-terminal-black flex items-center justify-center p-4">
      <div className="terminal-bezel">
        <div className="terminal-screen p-8 w-full max-w-4xl">
          <div className="terminal-text phosphor-green space-y-1">
            {bootSequence.slice(0, currentLine + 1).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="font-mono"
              >
                {line}
                {index === currentLine && showCursor && (
                  <span className="phosphor-green">█</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootScreen;