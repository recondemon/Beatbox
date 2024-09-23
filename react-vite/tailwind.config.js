const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        shadow: 'var(--shadow)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        popover: 'var(--popover)',
        card: 'var(--card)',
        primaryForeground: 'var(--primary-foreground)',
        secondaryForeground: 'var(--secondary-foreground)',
        mutedForeground: 'var(--muted-foreground)',
        accentForeground: 'var(--accent-foreground)',
        popoverForeground: 'var(--popover-foreground)',
        cardForeground: 'var(--card-foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      fontSize: {
        '.2vw': '.2vw',
        '.4vw': '.4vw',
        '.6vw': '.6vw',
        '.8vw': '.8vw',
        '1vw': '1vw',
        '1.2vw': '1.2vw',
        '1.4vw': '1.4vw',
        '1.6vw': '1.6vw',
        '1.8vw': '1.8vw',
        '2vw': '2vw',
        '2.2vw': '2.2vw',
        '2.4vw': '2.4vw',
        '2.6vw': '2.6vw',
        '2.8vw': '2.8vw',
        '3vw': '3vw',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};

export default config;
