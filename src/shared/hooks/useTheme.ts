import { create } from 'zustand'

type ThemeType = 'dark'|'light'

const useTheme = create<{
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}>((set) => ({
    theme: localStorage.getItem('default-theme') as ThemeType || 'light',
    setTheme: (theme) => {
        localStorage.setItem('default-theme', theme);
        set({theme})
    },
}))

export default useTheme