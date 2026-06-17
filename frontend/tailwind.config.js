    /** @type {import('tailwindcss').Config} */
    export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            'kone-green': '#6A8E23',
            'kone-dark': '#1A1A1A',
        },
        fontFamily: {
            serif: ['Playfair Display', 'serif'],
        }
        },
    },
    plugins: [],
    }