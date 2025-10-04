import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CreateUser from '../components/signOption/CreateUser'
import Login from '../components/signOption/Login'
import { FaArrowRight, FaArrowLeft, FaUserPlus, FaSignInAlt, FaUser, FaUserTie, FaUserShield } from 'react-icons/fa'

export default function SignOptions() {
    const [signType, setSignType] = useState('login')

    const changeSignOption = () => {
        if (signType === 'login') {
            setSignType('create');
        } else {
            setSignType('login')
        }
    }

    // Animation variants
    const pageVariants = {
        initial: {
            opacity: 0,
            x: signType === 'login' ? -50 : 50,
            scale: 0.95
        },
        in: {
            opacity: 1,
            x: 0,
            scale: 1
        },
        out: {
            opacity: 0,
            x: signType === 'login' ? 50 : -50,
            scale: 0.95
        }
    }

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    }

    const buttonVariants = {
        initial: {
            scale: 1
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: {
            scale: 0.95
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center lg:p-4">
            <motion.div
                className="w-full max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Toggle Button */}
                <motion.div
                    className="text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <motion.button
                        onClick={changeSignOption}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="group inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 font-semibold"
                    >
                        {signType === 'login' ? (
                            <>
                                <span>Don't have an account?</span>
                                <motion.span
                                    className="ml-2 text-blue-600 font-bold flex items-center"
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    Create Account
                                    <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                </motion.span>
                            </>
                        ) : (
                            <>
                                <span>Already have an account?</span>
                                <motion.span
                                    className="ml-2 text-green-600 font-bold flex items-center"
                                    initial={{ x: 0 }}
                                    whileHover={{ x: -5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <FaArrowLeft className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                    Login
                                </motion.span>
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Main Content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={signType}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            {signType === 'login' ? <Login /> : <CreateUser loginRedirect={() => setSignType('login')} />}
                        </motion.div>
                    </AnimatePresence>

                </div>
            </motion.div>
        </div>
    )
}