export const typography = {
  // Header sizes
  h1: 'calc(2rem + 1vw)',
  h2: 'calc(3.5rem + 1vw)',
  h3: 'calc(3rem + 1vw)',
  h4: 'calc(2.4rem + 1vw)',
  text: 'calc(1.5rem + 1vw)',
  navText: 'calc(0.5rem + 1vw)',
  bigText: 'calc(6rem + 1vw)',

  primary: '"Times New Roman", Times, serif',
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
  },
} as const;
