import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';

function ToggleDarkMode() {
    const getInitialTheme = () => {
        const storedPrefs = localStorage.getItem('theme');
        if (storedPrefs === 'dark') return true;
        else return false
    };
    const [isDark, setIsDark] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDark = () => {
        setIsDark(prev => !prev);
    };

    return (
        <motion.button
      onClick={toggleDark}
      className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
      whileHover={{ 
        scale: 1.1,
        rotate: 5 
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }
      }}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 360 : 0,
        }}
        transition={{ 
          duration: 0.6, 
          type: "spring",
          stiffness: 100 
        }}
      >
        {isDark ? (
          <HiMoon className="w-5 h-5 text-purple-500" />
        ) : (
          <HiSun className="w-5 h-5 text-orange-500" />
        )}
      </motion.div>
    </motion.button>
    );
}

export default ToggleDarkMode;