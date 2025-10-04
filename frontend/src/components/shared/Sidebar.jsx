import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    FaHome,
    FaUsers,
    FaClock,
    FaCheckCircle,
    FaPlus,
    FaEye,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
    FaUserCog,
    FaTasks,
    FaListAlt
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar() {
    const location = useLocation()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [activeSubmenu, setActiveSubmenu] = useState(null)
    const navigate = useNavigate()

    const menuItems = [
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: FaHome,
            submenu: null
        },
        {
            path: '/manageUsers',
            name: 'Manage Users',
            icon: FaUsers,
            submenu: null
        },
        {
            name: 'Approvals',
            icon: FaTasks,
            submenu: [
                { path: '/pending', name: 'Pending Approvals', icon: FaClock },
                { path: '/approved', name: 'Approved Requests', icon: FaCheckCircle },
                { path: '/rejected', name: 'Rejected Requests', icon: FaListAlt }
            ]
        },
        {
            name: 'Content',
            icon: FaPlus,
            submenu: [
                { path: '/add', name: 'Add New', icon: FaPlus },
                { path: '/view', name: 'View All', icon: FaEye }
            ]
        },
    ]

    const isActiveLink = (path) => {
        return location.pathname === path
    }

    const toggleSubmenu = (menuName) => {
        setActiveSubmenu(activeSubmenu === menuName ? null : menuName)
    }

    const sidebarVariants = {
        expanded: {
            width: "16rem",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        collapsed: {
            width: "5rem",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }

    const itemVariants = {
        expanded: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        collapsed: {
            opacity: 0,
            x: -20,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }

    const submenuVariants = {
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
            }
        },
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
            }
        }
    }

    return (
        <>
            <motion.div
                className={`bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-screen transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
                variants={sidebarVariants}
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FaUserCog className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                            Admin Panel
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            v2.1.0
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                        >
                            {isCollapsed ? (
                                <FaChevronRight className="w-4 h-4" />
                            ) : (
                                <FaChevronLeft className="w-4 h-4" />
                            )}
                        </motion.button>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => (
                        <div key={item.name || item.path}>
                            {item.submenu ? (
                                <div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleSubmenu(item.name)}
                                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeSubmenu === item.name
                                                ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span
                                                    variants={itemVariants}
                                                    initial="expanded"
                                                    animate="expanded"
                                                    exit="collapsed"
                                                    className="font-medium flex-1 text-left"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.div
                                                animate={{ rotate: activeSubmenu === item.name ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <FaChevronLeft className="w-3 h-3" />
                                            </motion.div>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {!isCollapsed && activeSubmenu === item.name && (
                                            <motion.div
                                                variants={submenuVariants}
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                className="ml-4 mt-1 space-y-1"
                                            >
                                                {item.submenu.map((subItem) => (
                                                    <motion.div
                                                        key={subItem.path}
                                                        whileHover={{ x: 5 }}
                                                        transition={{ type: "spring", stiffness: 400 }}
                                                    >
                                                        <Link
                                                            to={subItem.path}
                                                            className={`flex items-center p-2 rounded-lg transition-all duration-200 ${isActiveLink(subItem.path)
                                                                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            <subItem.icon className="w-4 h-4 mr-3" />
                                                            <span className="text-sm font-medium">
                                                                {subItem.name}
                                                            </span>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                /* Single Menu Item */
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActiveLink(item.path)
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span
                                                    variants={itemVariants}
                                                    initial="expanded"
                                                    animate="expanded"
                                                    exit="collapsed"
                                                    className="font-medium"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                                    onClick={() => navigate('/')}
                                >
                                    <FaSignOutAlt className="w-5 h-5 mr-3" />
                                    <span className="font-medium">Logout</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isCollapsed && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-full flex items-center justify-center p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                        >
                            <FaSignOutAlt className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </>
    )
}