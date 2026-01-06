// styles/design-tokens.ts
/**
 * [N-D] Brand Design Tokens
 * Neural Link & Editorial Logic
 */

// ============================================
// Colors
// ============================================

export const colors = {
    // Brand Colors
    neuralBlack: '#121212',
    pureWhite: '#FFFFFF',
    techSilver: '#8E8E8E',
    logicBlue: '#2F54EB',

    // Semantic Colors
    primary: '#121212',      // Neural Black
    secondary: '#FFFFFF',    // Pure White
    accent: '#2F54EB',       // Logic Blue
    neutral: '#8E8E8E',      // Tech Silver

    // Grays
    gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#8E8E8E',  // Tech Silver
        600: '#737373',
        700: '#525252',
        800: '#404040',
        900: '#262626',
    },

    // Interactive States
    hover: '#2F54EB',
    active: '#1E40AF',
    disabled: '#D4D4D4',

    // Backgrounds
    background: {
        primary: '#FFFFFF',
        secondary: '#FAFAFA',
        dark: '#121212',
    },

    // Borders
    border: {
        light: '#E5E5E5',
        medium: '#8E8E8E',
        dark: '#121212',
    }
} as const;

// ============================================
// Typography
// ============================================

export const typography = {
    // Font Families
    fontFamily: {
        serif: 'var(--font-playfair), Playfair Display, Georgia, serif',
        sans: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        mono: 'var(--font-ibm-mono), IBM Plex Mono, "Courier New", monospace',
    },

    // Font Sizes
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
    },

    // Font Weights
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    // Line Heights
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },

    // Letter Spacing
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
} as const;

// ============================================
// Spacing (8px grid system)
// ============================================

export const spacing = {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
} as const;

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
} as const;

// ============================================
// Shadows
// ============================================

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    none: 'none',

    // [N-D] Specific shadows
    node: '0 0 8px rgba(47, 84, 235, 0.5)',  // Logic Blue glow
    dash: '0 2px 0 0 rgba(18, 18, 18, 0.1)', // Subtle underline
} as const;

// ============================================
// Transitions
// ============================================

export const transitions = {
    // Duration
    duration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
    },

    // Easing
    easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // [N-D] Neural easing
        neural: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Common transitions
    common: {
        all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        colors: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
} as const;

// ============================================
// Breakpoints
// ============================================

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// ============================================
// Z-Index Scale
// ============================================

export const zIndex = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    popover: 40,
    tooltip: 50,
} as const;

// ============================================
// [N-D] Specific Design Tokens
// ============================================

export const ndTokens = {
    // Bracket dimensions
    bracket: {
        width: '2px',
        spacing: '8px',
    },

    // Dash dimensions
    dash: {
        height: '1px',
        width: '100%',
        opacity: 0.1,
    },

    // Node dimensions
    node: {
        size: {
            sm: '6px',
            md: '8px',
            lg: '12px',
        },
        glow: {
            sm: '4px',
            md: '8px',
            lg: '12px',
        },
    },

    // Animation timings for Neural Loading
    neuralLoading: {
        duration: '800ms',
        dashExpand: '0.4s',
        nodeMove: '0.6s',
    },

    // Infinite Dash scroll effect
    infiniteDash: {
        lineSpacing: '80px',
        opacity: 0.03,
        speed: '1.5s',
    },
} as const;

// ============================================
// Type exports for TypeScript
// ============================================

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Transitions = typeof transitions;
export type Breakpoints = typeof breakpoints;
export type ZIndex = typeof zIndex;
export type NDTokens = typeof ndTokens;
