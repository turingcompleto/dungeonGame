import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AIService from '../../services/aiService';

const GameInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: "SECUENCIA DE ARRANQUE DEL SISTEMA INICIADA...\nCARGANDO MAESTRO DE MAZMORRAS IA v2.1\nTERMINAL LISTA.",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      type: 'ai',
      content: "BIENVENIDO, AVENTURERO. TE ENCUENTRAS EN LA ENTRADA DE UNA MISTERIOSA MAZMORRA. LAS ANTORCHAS PARPADEAN PROYECTANDO SOMBRAS DANZANTES EN LAS PAREDES DE PIEDRA. ECOS DISTANTES SUGIEREN PELIGROS DESCONOCIDOS...",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    level: 1,
    experience: 0
  });

  const [aiService] = useState(() => new AIService());
  const [gameState, setGameState] = useState(null);
  const [isUsingOpenAI, setIsUsingOpenAI] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
    // Inicializar estado del juego
    setGameState(aiService.getGameState());
    
    // Verificar si OpenAI está configurado
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    setIsUsingOpenAI(apiKey && apiKey !== 'tu_clave_de_openai_aqui');
  }, [aiService]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentInput.trim() || isTyping) return;

    // Agregar mensaje del jugador
    const playerMessage = {
      id: Date.now(),
      type: 'player',
      content: `> ${currentInput.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, playerMessage]);
    const inputToProcess = currentInput;
    setCurrentInput('');
    setIsTyping(true);

    try {
      // Usar el nuevo servicio de IA
      const aiResponse = await aiService.processPlayerInput(inputToProcess);
      
      // Actualizar estado del juego
      setGameState(aiService.getGameState());
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.toUpperCase(),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: "ERROR: FALLO EN EL NUCLEO DEL MAESTRO DE MAZMORRAS. REINICIANDO SISTEMAS...",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Funciones para acciones rapidas
  const handleQuickAction = async (action) => {
    if (isTyping) return;
    
    const actionCommands = {
      inventory: 'INVENTARIO',
      examine: 'EXAMINAR ALREDEDORES',
      map: 'MOSTRAR MAPA',
      status: 'REPORTE DE ESTADO'
    };
    
    const command = actionCommands[action];
    if (command) {
      setCurrentInput(command.toLowerCase());
      await new Promise(resolve => setTimeout(resolve, 100));
      handleSendMessage({ preventDefault: () => {} });
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black p-4 retro-grid">
      <div className="terminal-bezel h-full">
        <div className="terminal-screen h-full flex crt-flicker">
          
          {/* Panel lateral izquierdo - Stats del jugador */}
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-80 p-4 border-r-2 border-terminal-green"
          >
            <div className="space-y-6">
              {/* Header del jugador */}
              <div className="ascii-border p-3">
                <div className="terminal-title text-lg phosphor-green mb-4">
                  JUGADOR.EXE
                </div>
                
                {/* Barras de estado estilo retro */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between terminal-text text-xs mb-1">
                      <span className="phosphor-green">SALUD:</span>
                      <span className="phosphor-white">
                        {playerStats.hp}/{playerStats.maxHp}
                      </span>
                    </div>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill bg-terminal-green phosphor-green"
                        style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between terminal-text text-xs mb-1">
                      <span className="phosphor-green">MANA:</span>
                      <span className="phosphor-white">
                        {playerStats.mana}/{playerStats.maxMana}
                      </span>
                    </div>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill bg-terminal-amber phosphor-amber"
                        style={{ width: `${(playerStats.mana / playerStats.maxMana) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats de texto */}
                <div className="mt-4 space-y-1 terminal-text text-xs">
                  <div className="flex justify-between">
                    <span className="phosphor-green">NIVEL:</span>
                    <span className="phosphor-white">{playerStats.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="phosphor-green">EXP:</span>
                    <span className="phosphor-white">{playerStats.experience}</span>
                  </div>
                </div>
              </div>

              {/* Estado de ubicación */}
              {gameState && (
                <div className="ascii-border p-3">
                  <div className="terminal-text text-xs">
                    <div className="phosphor-green mb-2">UBICACION.DAT:</div>
                    <div className="phosphor-white mb-2">
                      {gameState.locationInfo?.description?.substring(0, 60) || 'ENTRADA DE MAZMORRA'}...
                    </div>
                    {gameState.locationInfo?.exits && (
                      <div>
                        <span className="phosphor-green">SALIDAS: </span>
                        <span className="phosphor-amber">
                          {gameState.locationInfo.exits.join(' | ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comandos rápidos */}
              <div className="space-y-2">
                <div className="terminal-title text-sm phosphor-green mb-3">
                  RAPIDO.CMD
                </div>
                {[
                  { key: 'inventory', label: 'INVENTARIO' },
                  { key: 'examine', label: 'EXAMINAR' },
                  { key: 'map', label: 'MAPA' },
                  { key: 'status', label: 'ESTADO' }
                ].map((action) => (
                  <button 
                    key={action.key}
                    onClick={() => handleQuickAction(action.key)}
                    className="w-full p-2 terminal-button terminal-text text-xs transition-all disabled:opacity-50"
                    disabled={isTyping}
                  >
                    [{action.label}]
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Area principal del terminal */}
          <div className="flex-1 flex flex-col">
            {/* Header del terminal */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-4 border-b-2 border-terminal-green"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="terminal-title text-xl phosphor-green">
                    MAESTRO.MAZMORRAS.IA.EXE
                  </div>
                  <div className="terminal-text text-xs phosphor-amber mt-1">
                    {isUsingOpenAI ? 'OPENAI.GPT-3.5 - ACTIVO' : 'MODO.LOCAL - ACTIVO'} | LISTO PARA COMANDOS
                  </div>
                </div>
                <div className="terminal-text text-xs phosphor-white">
                  {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
                </div>
              </div>
            </motion.div>

            {/* Area de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.type === 'player' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`terminal-text text-sm ${
                    message.type === 'player' 
                      ? 'text-right' 
                      : 'text-left'
                  }`}
                >
                  <div className={`inline-block max-w-4xl p-3 border border-terminal-green ${
                    message.type === 'player' 
                      ? 'phosphor-amber bg-terminal-black' 
                      : message.type === 'system'
                      ? 'phosphor-white bg-terminal-black'
                      : message.type === 'error'
                      ? 'text-red-500 bg-terminal-black'
                      : 'phosphor-green bg-terminal-black message-glow'
                  }`}>
                    <div className="font-mono whitespace-pre-wrap">
                      {message.type === 'ai' && <span className="phosphor-green">[DM.IA]: </span>}
                      {message.type === 'system' && <span className="phosphor-white">[SIS]: </span>}
                      {message.type === 'error' && <span className="text-red-500">[ERR]: </span>}
                      {message.content}
                    </div>
                    <div className="text-xs phosphor-white opacity-70 mt-2">
                      {message.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-left"
                >
                  <div className="inline-block p-3 border border-terminal-green bg-terminal-black">
                    <div className="terminal-text text-sm phosphor-green">
                      [DM.IA]: PROCESANDO<span className="typing-cursor"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input del jugador */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-4 border-t-2 border-terminal-green"
            >
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div className="flex gap-3">
                  <div className="terminal-text phosphor-green text-sm self-center">
                    ENTRADA:
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="INGRESA COMANDO..."
                    className="flex-1 terminal-input p-3 terminal-text text-sm placeholder-terminal-green placeholder-opacity-50"
                    disabled={isTyping}
                    style={{ 
                      background: '#000000',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!currentInput.trim() || isTyping}
                    className="px-6 py-3 terminal-button terminal-text text-sm font-bold"
                  >
                    EJEC
                  </button>
                </div>
                
                {/* Sugerencias de comandos retro */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="terminal-text text-xs phosphor-green">RAPIDO.CMD:</span>
                  {[
                    { cmd: 'IR AL NORTE', display: 'N' },
                    { cmd: 'EXAMINAR PUERTA', display: 'EX' },
                    { cmd: 'ATACAR', display: 'ATK' },
                    { cmd: 'USAR POCION', display: 'USAR' },
                    { cmd: 'INVENTARIO', display: 'INV' }
                  ].map((suggestion) => (
                    <button
                      key={suggestion.cmd}
                      onClick={() => setCurrentInput(suggestion.cmd.toLowerCase())}
                      className="terminal-text text-xs bg-terminal-black border border-terminal-green px-2 py-1 hover:bg-terminal-green hover:text-terminal-black transition-colors phosphor-green"
                      disabled={isTyping}
                    >
                      [{suggestion.display}]
                    </button>
                  ))}
                </div>

                {/* Línea de estado del sistema */}
                <div className="flex justify-between terminal-text text-xs phosphor-white opacity-70">
                  <div>
                    ESTADO: {isTyping ? 'PROCESANDO...' : 'LISTO'} | 
                    MEM: {Math.floor(Math.random() * 1000 + 2000)}KB | 
                    PROC: {Math.floor(Math.random() * 30 + 70)}%
                  </div>
                  <div>
                    IA: {isUsingOpenAI ? 'OPENAI' : 'LOCAL'} | NUCLEO: ACTIVO
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;