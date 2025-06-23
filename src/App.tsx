import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

// Add a wrapper to apply the dark class to <html> based on theme
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  // Set the class on <html> tag
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <Router>
          <AuthProvider>
            <CartProvider>
              <AppRouter />
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default App;
