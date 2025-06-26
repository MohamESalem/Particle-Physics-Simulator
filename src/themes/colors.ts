let _currentColors: Record<string, string> = {};

const styleCache = new Map<string, string>();
let lastThemeCheck: 'light' | 'dark' | '' = '';


function isDarkTheme(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false;
    }
    return document.documentElement.getAttribute('data-theme') === 'dark' ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
}


function getCSSVariableValue(varName: string): string {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return '';
    }

    const currentTheme = isDarkTheme() ? 'dark' : 'light';
    const cacheKey = `${currentTheme}-${varName}`;

    if (styleCache.has(cacheKey)) {
        return styleCache.get(cacheKey)!;
    }

    document.documentElement.offsetHeight;

    const computedStyle = getComputedStyle(document.documentElement);
    let value = computedStyle.getPropertyValue(varName).trim();

    styleCache.set(cacheKey, value);
    return value;
}

function updateColors(): void {
    const isDark = isDarkTheme();
    const currentTheme = isDark ? 'dark' : 'light';

    if (lastThemeCheck !== currentTheme) {
        styleCache.clear();
        lastThemeCheck = currentTheme;
    }

    _currentColors = {
        // Backgrounds
        bg1: getCSSVariableValue('--color-bg-primary'),
        bg2: getCSSVariableValue('--color-bg-secondary'),
        bg3: getCSSVariableValue('--color-bg-tertiary'),

        // Text
        text: getCSSVariableValue('--color-text-default'),
        textSecondary: getCSSVariableValue('--color-text-secondary'),

        // Interactive elements
        primary: getCSSVariableValue('--color-primary'),
        secondary: getCSSVariableValue('--color-secondary'),
        accent: getCSSVariableValue('--color-accent'),

        // State colors
        success: getCSSVariableValue('--color-success'),
        warning: getCSSVariableValue('--color-warning'),
        error: getCSSVariableValue('--color-error'),

        // Borders
        border: getCSSVariableValue('--color-border'),
        borderLight: getCSSVariableValue('--color-border-light'),

        // Particle
        particleSelected: getCSSVariableValue('--color-particle-selected'),
        particleDefault: getCSSVariableValue('--color-particle-default'),

        // Grid
        grid: getCSSVariableValue('--color-grid-lines'),

        // Shadows
        shadowLight: getCSSVariableValue('--color-shadow-light'),
        shadowDark: getCSSVariableValue('--color-shadow-dark'),
    };
    (_currentColors as any).isDark = isDark;
}

if (typeof window !== 'undefined') {
    updateColors();
}


export const COLORS: Readonly<Record<string, string> & { isDark: boolean }> = new Proxy({} as any, {
    get: (target, prop, receiver) => {
        return Reflect.get(_currentColors, prop, receiver);
    },
    set: (target, prop, value) => {
        console.warn(`Attempted to set read-only property COLORS.${String(prop)}. This operation is not allowed.`);
        return false;
    }
});


if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const newIsDark = isDarkTheme();
        if ((newIsDark ? 'dark' : 'light') !== lastThemeCheck) {
            updateColors(); 
        }
    });

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const newIsDark = isDarkTheme();
                if ((newIsDark ? 'dark' : 'light') !== lastThemeCheck) {
                    updateColors(); 
                }
                break;
            }
        }
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
}

