export const theme = {
  colors: {
    primary: '#FF9500',
    secondary: '#4DA6FF',
    accent: '#FF69B4',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    background: '#F9F9F9',
    card: '#FFFFFF',
    text: '#222222',
    textSecondary: '#757575',
    border: '#E0E0E0',
    
    // Sticky note colors
    sticky: {
      yellow: {
        background: '#FFEB3B',
        shadow: '#D6C22E',
        text: '#5D4037'
      },
      blue: {
        background: '#90CAF9',
        shadow: '#5C9FD6',
        text: '#1A237E'
      },
      green: {
        background: '#A5D6A7',
        shadow: '#75A478',
        text: '#1B5E20'
      },
      pink: {
        background: '#F8BBD0',
        shadow: '#C48B9F',
        text: '#880E4F'
      }
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      bold: 'Inter-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

// Helper function to create derived themes
export const createTheme = (overrides = {}) => {
  return {
    ...theme,
    ...overrides,
    colors: {
      ...theme.colors,
      ...(overrides.colors || {}),
    },
  };
};