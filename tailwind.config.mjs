/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary green
                primary: {
                    DEFAULT: 'hsl(142, 76%, 36%)',
                    light: 'hsl(142, 76%, 46%)',
                    dark: 'hsl(142, 76%, 26%)',
                },
                // Secondary yellow
                secondary: {
                    DEFAULT: 'hsl(45, 93%, 47%)',
                },
                // Accent cyan
                accent: 'hsl(197, 71%, 52%)',
                // Severity colors
                severity: {
                    high: 'hsl(0, 84%, 60%)',
                    medium: 'hsl(45, 93%, 47%)',
                    low: 'hsl(142, 76%, 36%)',
                    none: 'hsl(197, 71%, 52%)',
                },
                // Semantic colors
                success: 'hsl(142, 76%, 36%)',
                warning: 'hsl(45, 93%, 47%)',
                error: 'hsl(0, 84%, 60%)',
                info: 'hsl(197, 71%, 52%)',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                heading: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(166, 73%, 42%) 100%)',
                'gradient-secondary': 'linear-gradient(135deg, hsl(45, 93%, 47%) 0%, hsl(32, 95%, 54%) 100%)',
                'gradient-hero': 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(166, 73%, 42%) 50%, hsl(197, 71%, 52%) 100%)',
                'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            },
            boxShadow: {
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-left': 'slideInFromLeft 0.5s ease-out',
                'slide-right': 'slideInFromRight 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideInFromLeft: {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                slideInFromRight: {
                    from: { opacity: '0', transform: 'translateX(20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
};
