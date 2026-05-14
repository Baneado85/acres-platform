import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        acres: {
          black: '#020408',
          dark: '#080d14',
          navy: '#0a1628',
          blue: '#0052cc',
          cyan: '#00d4ff',
          neon: '#00f5ff',
          purple: '#7c3aed',
          violet: '#a855f7',
          gold: '#f59e0b',
          silver: '#94a3b8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontWeight: {
        800: '800',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'data-stream': 'dataStream 4s linear infinite',
        neural: 'neural 8s linear infinite',
        'grid-flow': 'gridFlow 20s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(0, 212, 255, 0.8), 0 0 100px rgba(0, 212, 255, 0.4)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        neural: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        gridFlow: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

export default config
