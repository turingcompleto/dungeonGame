// Sistema de IA avanzado con OpenAI para el Maestro de Mazmorras
import OpenAI from 'openai';

class AIService {
  constructor() {
    this.gameContext = {
      location: 'entrance',
      inventory: ['espada_hierro', 'antorcha', 'pocion_curacion'],
      playerStats: { hp: 100, maxHp: 100, mana: 50, maxMana: 50, level: 1, experience: 0 },
      gameState: 'exploring',
      history: [],
      conversationHistory: [],
      playerPreferences: {
        combatStyle: 'balanced',
        explorationStyle: 'cautious',
        riskTolerance: 'medium'
      }
    };
    
    this.scenarios = this.loadScenarios();
    this.openai = null;
    this.initializeOpenAI();
    
    // Fallback responses para cuando OpenAI no esté disponible
    this.fallbackResponses = this.loadFallbackResponses();
  }

  // Inicializar OpenAI
  async initializeOpenAI() {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey || apiKey === 'tu_clave_de_openai_aqui') {
        console.warn('OpenAI API key no configurada. Usando respuestas fallback.');
        return;
      }

      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Solo para desarrollo
      });

      console.log('OpenAI inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando OpenAI:', error);
      this.openai = null;
    }
  }

  // Cargar escenarios predefinidos
  loadScenarios() {
    return {
      entrance: {
        description: "Te encuentras en la entrada de una misteriosa mazmorra ancient. Las paredes de piedra están cubiertas de musgo y extraños símbolos. Antorchas mágicas iluminan débilmente el área.",
        exits: ['norte', 'este'],
        items: ['palanca_oxidada', 'pergamino_misterioso'],
        npcs: [],
        enemies: [],
        mood: 'mysterious',
        dangerLevel: 'low'
      },
      hallway_north: {
        description: "Un largo pasillo se extiende ante ti. Las antorchas proyectan sombras danzantes en las paredes. Escuchas el eco de gotas de agua en la distancia.",
        exits: ['sur', 'norte', 'puerta_este'],
        items: ['llave_antigua'],
        npcs: [],
        enemies: ['esqueleto_guardian'],
        mood: 'ominous',
        dangerLevel: 'medium'
      },
      treasure_room: {
        description: "Una habitación deslumbrante llena de oro y artefactos mágicos. El aire vibra con energía arcana y el sonido de monedas que caen.",
        exits: ['oeste'],
        items: ['cofre_oro', 'espada_magica', 'pergamino_hechizo', 'gemas_preciosas'],
        npcs: [],
        enemies: ['dragon_menor'],
        mood: 'exciting',
        dangerLevel: 'high'
      },
      crystal_chamber: {
        description: "Una cámara mística iluminada por cristales flotantes que pulsan con luz azul. El aire está cargado de magia ancestral.",
        exits: ['oeste', 'escaleras_abajo'],
        items: ['cristal_poder', 'vara_magica'],
        npcs: ['mago_anciano'],
        enemies: [],
        mood: 'mystical',
        dangerLevel: 'low'
      }
    };
  }

  // Respuestas fallback para cuando OpenAI no esté disponible
  loadFallbackResponses() {
    return {
      movement: [
        "Te mueves hacia {direction}. {description}",
        "Avanzas cuidadosamente. {description}",
        "Tus pasos resuenan mientras te diriges {direction}. {description}"
      ],
      examination: [
        "Examinas cuidadosamente el área. {details}",
        "Observas con atención. {details}",
        "Tu mirada escudriña cada detalle. {details}"
      ],
      combat: [
        "¡El combate es intenso! Tu {weapon} choca contra {enemy}.",
        "¡Lucha épica! {enemy} ruge mientras atacas con {weapon}.",
        "¡Batalla feroz! Tu {weapon} brilla en el combate."
      ],
      general: [
        "La mazmorra reacciona a tu presencia de manera misteriosa.",
        "Las sombras parecen moverse en respuesta a tus acciones.",
        "El aire se espesa con magia antigua mientras actúas."
      ]
    };
  }

  // Crear prompt del sistema para OpenAI
  createSystemPrompt() {
    return `Eres un Maestro de Mazmorras (DM) experto en un juego de rol de fantasía medieval. Tu personalidad es dramática, descriptiva y inmersiva, como los clásicos juegos de texto de los años 80.

REGLAS IMPORTANTES:
- Responde SIEMPRE en español
- Mantén un tono dramático y descriptivo
- Usa MÁXIMO 2-3 oraciones por respuesta
- Describe vívidamente los escenarios, sonidos, olores y sensaciones
- Haz que cada acción tenga consecuencias interesantes
- Mantén un balance entre peligro y recompensa
- Nunca rompas la inmersión del juego

ESTADO ACTUAL DEL JUEGO:
- Ubicación: ${this.gameContext.location}
- Descripción del lugar: ${this.scenarios[this.gameContext.location]?.description}
- Inventario del jugador: ${this.gameContext.inventory.join(', ')}
- Nivel de peligro: ${this.scenarios[this.gameContext.location]?.dangerLevel}
- Ambiente: ${this.scenarios[this.gameContext.location]?.mood}

ESTILO DE RESPUESTA:
- Usa mayúsculas para enfatizar momentos dramáticos
- Incluye efectos de sonido en el texto (ej: *CRASH*, *susurro*, *rugido*)
- Describe las emociones y sensaciones físicas del aventurero
- Mantén el misterio y la tensión`;
  }

  // Generar respuesta usando OpenAI
  async generateOpenAIResponse(playerInput) {
    if (!this.openai) {
      return this.generateFallbackResponse(playerInput);
    }

    try {
      // Mantener historial de conversación limitado (últimas 10 interacciones)
      const recentHistory = this.gameContext.conversationHistory.slice(-10);
      
      const messages = [
        {
          role: "system",
          content: this.createSystemPrompt()
        },
        ...recentHistory,
        {
          role: "user", 
          content: `El aventurero dice: "${playerInput}"`
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200,
        temperature: 0.8, // Más creatividad
        presence_penalty: 0.6, // Evita repeticiones
        frequency_penalty: 0.4 // Evita repeticiones
      });

      const response = completion.choices[0].message.content;
      
      // Agregar al historial
      this.gameContext.conversationHistory.push(
        { role: "user", content: playerInput },
        { role: "assistant", content: response }
      );

      // Procesar cambios de estado basados en la respuesta
      this.processStateChanges(playerInput, response);

      return response;

    } catch (error) {
      console.error('Error con OpenAI:', error);
      
      // Si hay error con la API, usar respuesta fallback
      if (error.status === 429) {
        return "El oráculo mágico está sobrecargado... *susurro* Intenta de nuevo en un momento.";
      } else if (error.status === 401) {
        return "Las energías arcanas se han desvanecido... Verifica tu conexión mágica.";
      }
      
      return this.generateFallbackResponse(playerInput);
    }
  }

  // Procesar cambios de estado basados en respuestas
  processStateChanges(input, response) {
    const inputLower = input.toLowerCase();
    const responseLower = response.toLowerCase();

    // Detectar movimiento
    if (inputLower.includes('ir') || inputLower.includes('mover')) {
      ['norte', 'sur', 'este', 'oeste'].forEach(direction => {
        if (inputLower.includes(direction)) {
          const newLocation = this.getNewLocation(direction);
          if (newLocation !== this.gameContext.location) {
            this.gameContext.location = newLocation;
          }
        }
      });
    }

    // Detectar combate
    if (inputLower.includes('atacar') || inputLower.includes('luchar')) {
      // Posibilidad de perder HP
      if (Math.random() < 0.3) {
        this.gameContext.playerStats.hp = Math.max(0, this.gameContext.playerStats.hp - 10);
      }
      // Ganar experiencia
      this.gameContext.playerStats.experience += 5;
    }

    // Detectar uso de magia
    if (inputLower.includes('hechizo') || inputLower.includes('magia')) {
      this.gameContext.playerStats.mana = Math.max(0, this.gameContext.playerStats.mana - 5);
    }

    // Detectar curación
    if (inputLower.includes('pocion') || responseLower.includes('cura')) {
      this.gameContext.playerStats.hp = Math.min(
        this.gameContext.playerStats.maxHp, 
        this.gameContext.playerStats.hp + 25
      );
    }

    // Detectar obtención de objetos
    if (responseLower.includes('encuentra') || responseLower.includes('obtienes')) {
      // Lógica para agregar objetos al inventario
    }

    // Actualizar nivel
    if (this.gameContext.playerStats.experience >= 100) {
      this.gameContext.playerStats.level++;
      this.gameContext.playerStats.experience = 0;
      this.gameContext.playerStats.maxHp += 20;
      this.gameContext.playerStats.maxMana += 10;
    }
  }

  // Generar respuesta fallback cuando OpenAI no está disponible
  generateFallbackResponse(playerInput) {
    const input = playerInput.toLowerCase();
    const currentLocation = this.scenarios[this.gameContext.location];

    // Detectar tipo de acción
    if (input.includes('ir') || input.includes('norte') || input.includes('sur') || input.includes('este') || input.includes('oeste')) {
      const direction = ['norte', 'sur', 'este', 'oeste'].find(d => input.includes(d)) || 'adelante';
      
      if (currentLocation.exits.includes(direction)) {
        const newLocationKey = this.getNewLocation(direction);
        const newLocation = this.scenarios[newLocationKey];
        this.gameContext.location = newLocationKey;
        
        return `Te diriges hacia el ${direction}. ${newLocation.description} El aire cambia sutilmente mientras exploras.`;
      } else {
        return `No puedes ir hacia el ${direction}. Una barrera mística te impide avanzar en esa dirección.`;
      }
    }

    if (input.includes('examinar') || input.includes('mirar') || input.includes('observar')) {
      const details = currentLocation.items.length > 0 
        ? `Observas: ${currentLocation.items.join(', ')}. ` 
        : 'No ves objetos particulares. ';
      
      const exits = `Las salidas disponibles son: ${currentLocation.exits.join(', ')}.`;
      
      return `${currentLocation.description} ${details}${exits}`;
    }

    if (input.includes('inventario')) {
      const items = this.gameContext.inventory.map(item => {
        const itemNames = {
          'espada_hierro': 'Espada de hierro',
          'antorcha': 'Antorcha',
          'pocion_curacion': 'Poción de curación'
        };
        return itemNames[item] || item;
      }).join(', ');

      return `Revisas tu inventario: ${items}. Tus pertenencias brillan débilmente con magia residual.`;
    }

    if (input.includes('atacar') || input.includes('luchar')) {
      if (currentLocation.enemies.length > 0) {
        const enemy = currentLocation.enemies[0];
        this.gameContext.playerStats.experience += 5;
        
        return `¡COMBATE! Tu espada choca contra ${enemy}. *¡CLANG!* Las chispas vuelan mientras luchas ferozmente.`;
      } else {
        return 'No hay enemigos visibles. Solo tu sombra danza en las paredes iluminadas por antorchas.';
      }
    }

    // Respuesta general
    const generalResponses = [
      `Interesante... La mazmorra reacciona a "${input}" de manera misteriosa. Las piedras susurran secretos antiguos.`,
      `Tu acción provoca ecos extraños en las profundidades. *susurro* Algo se agita en las sombras.`,
      `Las energías mágicas fluctúan en respuesta a tus movimientos. El aire se espesa con anticipación.`
    ];

    return this.randomChoice(generalResponses);
  }

  // Funciones auxiliares
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getNewLocation(direction) {
    const locationMap = {
      'entrance': { 'norte': 'hallway_north', 'este': 'crystal_chamber' },
      'hallway_north': { 'sur': 'entrance', 'norte': 'treasure_room' },
      'crystal_chamber': { 'oeste': 'entrance', 'escaleras_abajo': 'treasure_room' },
      'treasure_room': { 'oeste': 'hallway_north', 'sur': 'crystal_chamber' }
    };
    
    return locationMap[this.gameContext.location]?.[direction] || this.gameContext.location;
  }

  // Método público principal
  async processPlayerInput(input) {
    try {
      // Usar OpenAI para generar respuestas más inteligentes
      const response = await this.generateOpenAIResponse(input);
      
      // Actualizar historial del juego
      this.gameContext.history.push({
        input: input,
        response: response,
        timestamp: Date.now(),
        location: this.gameContext.location,
        playerStats: { ...this.gameContext.playerStats }
      });

      return response;

    } catch (error) {
      console.error('Error processing player input:', error);
      return "Las energías arcanas se alteran... *interferencia mágica* Algo no va bien en el plano astral.";
    }
  }

  // Obtener estado actual del juego
  getGameState() {
    return {
      location: this.gameContext.location,
      locationInfo: this.scenarios[this.gameContext.location],
      inventory: this.gameContext.inventory,
      stats: this.gameContext.playerStats,
      history: this.gameContext.history.slice(-5) // Últimas 5 acciones
    };
  }

  // Método para obtener sugerencias contextuales
  getContextualSuggestions() {
    const currentLocation = this.scenarios[this.gameContext.location];
    const suggestions = [];

    // Sugerencias basadas en la ubicación
    if (currentLocation.exits.length > 0) {
      suggestions.push(`ir al ${currentLocation.exits[0]}`);
    }

    if (currentLocation.items.length > 0) {
      suggestions.push(`examinar ${currentLocation.items[0]}`);
    }

    if (currentLocation.enemies.length > 0) {
      suggestions.push('atacar enemigo');
    }

    if (currentLocation.npcs.length > 0) {
      suggestions.push(`hablar con ${currentLocation.npcs[0]}`);
    }

    // Sugerencias basadas en inventario
    if (this.gameContext.inventory.includes('pocion_curacion') && 
        this.gameContext.playerStats.hp < this.gameContext.playerStats.maxHp * 0.5) {
      suggestions.push('usar poción');
    }

    return suggestions.slice(0, 4); // Máximo 4 sugerencias
  }

  // Método para resetear el juego
  resetGame() {
    this.gameContext = {
      location: 'entrance',
      inventory: ['espada_hierro', 'antorcha', 'pocion_curacion'],
      playerStats: { hp: 100, maxHp: 100, mana: 50, maxMana: 50, level: 1, experience: 0 },
      gameState: 'exploring',
      history: [],
      conversationHistory: [],
      playerPreferences: {
        combatStyle: 'balanced',
        explorationStyle: 'cautious',
        riskTolerance: 'medium'
      }
    };
  }
}

export default AIService;