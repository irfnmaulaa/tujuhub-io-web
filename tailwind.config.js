import {heroui} from "@heroui/theme"
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        heroui({
            addCommonColors: true,
            // defaultTheme: 'dark',
            themes: {
                light: {
                    colors: {
                        background: '#FFFFFF',
                        foreground: '#252525',
                        primary: {
                            100: '#CCEAFD',
                            200: '#9BD2FB',
                            300: '#68B2F5',
                            400: '#4294EB',
                            500: '#0A67DE',
                            600: '#074FBE',
                            700: '#053B9F',
                            800: '#032980',
                            900: '#011D6A',
                            foreground: '#FFFFFF',
                            DEFAULT: '#0A67DE',
                        },
                        success: {
                            100: '#E2FAD1',
                            200: '#C0F6A6',
                            300: '#90E374',
                            400: '#62C94E',
                            500: '#2AA51F',
                            600: '#168D16',
                            700: '#0F7618',
                            800: '#095F17',
                            900: '#054F17',
                            foreground: '#FFFFFF',
                            DEFAULT: '#2AA51F',
                        },
                        info: {
                            100: '#CDEBFE',
                            200: '#9CD3FE',
                            300: '#6AB6FC',
                            400: '#459BFA',
                            500: '#0970F7',
                            600: '#168D16',
                            700: '#0440B1',
                            800: '#022D8F',
                            900: '#011F76',
                            foreground: '#FFFFFF',
                            DEFAULT: '#0970F7',
                        },
                        warning: {
                            100: '#FFF5CC',
                            200: '#FFE899',
                            300: '#FFD867',
                            400: '#FFC941',
                            500: '#FFAF02',
                            600: '#DB8F01',
                            700: '#B77101',
                            800: '#935600',
                            900: '#7A4300',
                            foreground: '#252525',
                            DEFAULT: '#FFAF02',
                        },
                        danger: {
                            100: '#FFE5D5',
                            200: '#FFC5AC',
                            300: '#FF9D82',
                            400: '#FF7863',
                            500: '#FF3A30',
                            600: '#DB2329',
                            700: '#B7182B',
                            800: '#930F2A',
                            900: '#7A0929',
                            foreground: '#FFFFFF',
                            DEFAULT: '#FF3A30',
                        }
                    }
                }
            }
        })
    ],
}
