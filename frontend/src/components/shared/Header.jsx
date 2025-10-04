import React, { useEffect, useState } from 'react'
import ToggleDarkMode from '../ToggleDarkMode'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    FaHome,
    FaUser,
    FaCog,
    FaChartBar,
    FaBell,
    FaEnvelope,
    FaSearch,
    FaBars,
    FaTimes
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const [naam, setNaam] = useState('')
    const [mail, setMail] = useState('')

    useEffect(()=>{
        const admin = sessionStorage.getItem('adminName')
        const mailC = sessionStorage.getItem('adminEmail')
        setNaam(admin)
        setMail(mailC)
    })

    // Function to get page title and icon based on route
    const getPageInfo = () => {
        const path = location.pathname.slice(1) || 'home'
        const pageTitles = {
            '': { title: 'Dashboard', icon: FaHome },
            'home': { title: 'Dashboard', icon: FaHome },
            'profile': { title: 'Profile', icon: FaUser },
            'settings': { title: 'Settings', icon: FaCog },
            'analytics': { title: 'Analytics', icon: FaChartBar },
            'users': { title: 'User Management', icon: FaUser },
            'reports': { title: 'Reports', icon: FaChartBar },
            'messages': { title: 'Messages', icon: FaEnvelope },
            'notifications': { title: 'Notifications', icon: FaBell }
        }

        const pageInfo = pageTitles[path] || {
            title: path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            icon: FaHome
        }

        return {
            title: pageInfo.title,
            icon: pageInfo.icon,
            path: path.toUpperCase()
        }
    }

    const pageInfo = getPageInfo()
    const PageIcon = pageInfo.icon

    return (
        <>
            <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <PageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {pageInfo.title}
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                                        {location.pathname === '/' ? 'Welcome to your dashboard' : `Currently viewing ${pageInfo.title.toLowerCase()}`}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                                    onClick={() => navigate('/pending')}
                                >
                                    <FaBell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        3
                                    </span>
                                </motion.button>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ToggleDarkMode />
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">U</span>
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {naam}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {mail}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}