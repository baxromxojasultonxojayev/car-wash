
export type ThemeColor = {
  name: string;
  value: string;
  label: string;
};

export const themeColors: ThemeColor[] = [
  { name: 'indigo', value: '#6366f1', label: 'Indigo' },
  { name: 'black', value: '#0f172a', label: 'Black' },
  { name: 'purple', value: '#a855f7', label: 'Purple' },
  { name: 'orange', value: '#f97316', label: 'Orange' },
  { name: 'teal', value: '#14b8a6', label: 'Teal' },
  { name: 'green', value: '#22c55e', label: 'Green' },
  { name: 'blue', value: '#3b82f6', label: 'Blue' },
];

export const getStoredHeaderColor = (): string => {
  if (typeof window === 'undefined') return 'transparent'; 
  return localStorage.getItem('header-color') || 'transparent';
};

export const applyHeaderColor = (color: string) => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty('--header-bg', color);
  
  // If color is transparent, use default background
  if (color === 'transparent') {
    document.documentElement.style.setProperty('--header-fg', 'inherit');
    document.documentElement.style.setProperty('--theme-color', 'var(--primary)');
  } else {
    // Basic contrast logic (simplified: most theme colors are dark except white)
    document.documentElement.style.setProperty('--header-fg', '#ffffff');
    document.documentElement.style.setProperty('--theme-color', color);
  }
  
  localStorage.setItem('header-color', color);
};

export const getStoredSidebarTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('sidebar-theme') as 'light' | 'dark') || 'light';
};

export const applySidebarTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('sidebar-dark');
    document.documentElement.classList.remove('sidebar-light');
  } else {
    document.documentElement.classList.remove('sidebar-dark');
    document.documentElement.classList.add('sidebar-light');
  }
  localStorage.setItem('sidebar-theme', theme);
};
