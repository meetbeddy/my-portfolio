export const theme = {
    colors: {

        primary: '#e04848',
        primaryLight: '#f26e6e',
        primaryDark: '#c04040',
        secondary: '#4880e0',
        secondaryLight: '#6e9ef2',
        secondaryDark: '#3a68b8',
        accent: '#48e080',

        // Text colors - optimized for dark background
        text: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.8)',
        textMuted: 'rgba(255, 255, 255, 0.6)',
        textInverted: '#121212',

        // Background colors - dark mode as default
        background: '#121212',
        backgroundAlt: '#1a1a1a',
        backgroundElevated: '#222222',
        backgroundHighlight: '#2a2a2a',

        // UI elements for dark mode
        surface: 'rgba(255, 255, 255, 0.1)',
        surfaceHover: 'rgba(255, 255, 255, 0.15)',
        surfaceActive: 'rgba(255, 255, 255, 0.2)',
        border: 'rgba(255, 255, 255, 0.12)',
        borderFocus: 'rgba(224, 72, 72, 0.5)', // Based on primary color
        divider: 'rgba(255, 255, 255, 0.06)',
        shadow: 'rgba(0, 0, 0, 0.5)',

        // Status colors with better contrast for dark mode
        success: '#5cff5c',
        warning: '#ffb74d',
        error: '#ff5252',
        info: '#40c4ff'
    },

    typography: {
        fontFamily: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            secondary: "'Manrope', sans-serif",
            monospace: "'Fira Code', monospace"
        },
        fontWeight: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        },
        fontSizes: {
            xs: '0.75rem',     // 12px
            sm: '0.875rem',    // 14px
            base: '1rem',      // 16px
            md: '1.125rem',    // 18px
            lg: '1.25rem',     // 20px
            xl: '1.5rem',      // 24px
            '2xl': '2rem',     // 32px
            '3xl': '3rem',     // 48px
            '4xl': '4rem'      // 64px
        },
        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.8
        },
        letterSpacing: {
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
            wider: '0.05em'
        }
    },

    spacing: {
        '2xs': '0.125rem',   // 2px
        xs: '0.25rem',       // 4px
        sm: '0.5rem',        // 8px
        md: '1rem',          // 16px
        lg: '1.5rem',        // 24px
        xl: '2rem',          // 32px
        '2xl': '3rem',       // 48px
        '3xl': '4rem',       // 64px
        '4xl': '6rem'        // 96px
    },

    borders: {
        radius: {
            none: '0',
            sm: '0.125rem',    // 2px
            md: '0.25rem',     // 4px
            lg: '0.5rem',      // 8px
            xl: '1rem',        // 16px
            full: '9999px'     // Circle/Pill
        },
        width: {
            thin: '1px',
            regular: '2px',
            thick: '4px'
        }
    },

    shadows: {
        // Dark mode optimized shadows
        sm: '0 2px 8px rgba(0, 0, 0, 0.5)',
        md: '0 4px 12px rgba(0, 0, 0, 0.6)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.7)',
        xl: '0 12px 36px rgba(0, 0, 0, 0.8)',
        glow: '0 0 15px rgba(224, 72, 72, 0.4)', // Subtle glow for primary elements
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
    },

    animation: {
        durations: {
            fast: '150ms',
            medium: '300ms',
            slow: '500ms'
        },
        easings: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
        }
    },

    breakpoints: {
        mobileS: '320px',
        mobileM: '375px',
        mobileL: '414px',
        tablet: '768px',
        laptop: '1024px',
        laptopL: '1366px',
        desktop: '1440px',
        desktopL: '1920px'
    },

    zIndex: {
        base: 0,
        dropdown: 10,
        sticky: 20,
        fixed: 30,
        modal: 40,
        popover: 50,
        toast: 60,
        tooltip: 70
    },

    // Optional light mode - keep this for future flexibility
    light: {
        colors: {
            background: '#f8f8f8',
            backgroundAlt: '#ffffff',
            backgroundElevated: '#ffffff',
            backgroundHighlight: '#f0f0f0',
            surface: 'rgba(0, 0, 0, 0.05)',
            surfaceHover: 'rgba(0, 0, 0, 0.08)',
            surfaceActive: 'rgba(0, 0, 0, 0.12)',
            text: '#212121',
            textSecondary: 'rgba(0, 0, 0, 0.7)',
            textMuted: 'rgba(0, 0, 0, 0.5)',
            border: 'rgba(0, 0, 0, 0.1)',
            divider: 'rgba(0, 0, 0, 0.05)',
            shadow: 'rgba(0, 0, 0, 0.1)'
        }
    },

    // Dark mode enhancements for components
    components: {
        card: {
            background: '#1a1a1a',
            hover: '#222222',
            shadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        },
        button: {
            primary: {
                background: '#e04848',
                hover: '#f26e6e',
                active: '#c04040',
                text: '#ffffff'
            },
            secondary: {
                background: 'rgba(255, 255, 255, 0.1)',
                hover: 'rgba(255, 255, 255, 0.15)',
                active: 'rgba(255, 255, 255, 0.2)',
                text: '#ffffff'
            }
        },
        input: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.1)',
            focusBorder: '#e04848',
            text: '#ffffff',
            placeholder: 'rgba(255, 255, 255, 0.4)'
        },
        navigation: {
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            activeItem: '#e04848',
            item: 'rgba(255, 255, 255, 0.7)'
        }
    },

    // Common mixins for component styling
    mixins: {
        truncateText: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        },
        flexCenter: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        coverImage: {
            objectFit: 'cover',
            width: '100%',
            height: '100%'
        },
        // Dark mode specific glassmorphism effect
        glassEffect: {
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
        },
        smoothTransition: property => ({
            transition: `${property} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
        })
    }
};