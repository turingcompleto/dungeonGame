/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          terminal: {
            black: '#000000',
            green: '#00ff00',
            amber: '#ffaa00',
            white: '#ffffff',
            darkGreen: '#00cc00',
            dimGreen: '#008800',
            glow: 'rgba(0, 255, 0, 0.3)'
          },
          retro: {
            background: '#000000',
            primary: '#00ff00',
            secondary: '#ffaa00',
            accent: '#ffffff',
            bezel: '#333333',
            border: '#666666'
          }
        },
        fontFamily: {
          terminal: ['Share Tech Mono', 'Courier New', 'monospace'],
          retro: ['Orbitron', 'Share Tech Mono', 'monospace'],
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'glow': 'textGlow 2s ease-in-out infinite alternate',
          'flicker': 'crtFlicker 0.15s infinite linear alternate',
          'scanlines': 'scanlines 0.1s linear infinite',
          'bootup': 'bootup 2s ease-out',
          'blink': 'blink 1s infinite',
        },
        keyframes: {
          textGlow: {
            '0%': { textShadow: '0 0 3px #00ff00' },
            '100%': { textShadow: '0 0 8px #00ff00, 0 0 12px #00ff00' }
          },
          crtFlicker: {
            '0%': { opacity: '1' },
            '98%': { opacity: '1' },
            '99%': { opacity: '0.99' },
            '100%': { opacity: '1' }
          },
          scanlines: {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(4px)' }
          },
          bootup: {
            '0%': { 
              opacity: '0',
              transform: 'scale(0.95)',
              filter: 'blur(3px)'
            },
            '50%': {
              opacity: '0.7',
              filter: 'blur(1px)'
            },
            '100%': { 
              opacity: '1',
              transform: 'scale(1)',
              filter: 'blur(0)'
            }
          },
          blink: {
            '0%, 50%': { opacity: '1' },
            '51%, 100%': { opacity: '0' }
          }
        },
        boxShadow: {
          'terminal': '0 0 20px #00ff00, inset 0 0 20px rgba(0, 255, 0, 0.1)',
          'crt': '0 0 40px rgba(0, 255, 0, 0.3)',
          'bezel': 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 5px 15px rgba(0, 0, 0, 0.5)',
        }
      },
    },
    plugins: [],
  }