import React, { useEffect, useState } from 'react'
import toast, { LoaderIcon } from 'react-hot-toast'
import Swal from 'sweetalert2'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt, FaUserShield, FaUserTie, FaUser, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseUrl } from '../../baseUrl'

export default function Login() {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    const [userDataError, setUserDataError] = useState({
        emailErr: '',
        passErr: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [remember, setRemember] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    const navigate = useNavigate()

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

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    }

    useEffect(() => {
        let emailErr = ''
        let passErr = ''

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (userData.email === '') {
            emailErr = 'Email is required'
        } else if (!emailRegex.test(userData.email)) {
            emailErr = 'Please enter a valid email address'
        }

        if (userData.password === '') {
            passErr = 'Password is required'
        } else if (userData.password.length < 6) {
            passErr = 'Password must be at least 6 characters long'
        }

        setUserDataError({
            emailErr,
            passErr,
        })

        setIsFormValid(
            emailErr === '' &&
            passErr === '' &&
            userData.email !== '' &&
            userData.password !== ''
        )
    }, [userData])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setSubmitLoading(true)
        if (!isFormValid) {
            toast.error('Please fix the errors before submitting')
            setSubmitLoading(false)
            return
        }

        const data = {
            email: userData.email,
            password: userData.password,
            role: 'admin'
        }

        await axios.post(`${baseUrl}/api/auth/admin/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response);

                // Store token and admin data in session storage
                const { token, admin } = response.data;

                sessionStorage.setItem('token', token);
                sessionStorage.setItem('adminName', admin.name);
                sessionStorage.setItem('adminEmail', admin.email);
                sessionStorage.setItem('adminId', admin.id);
                sessionStorage.setItem('countryCode', admin.countryCode);
                sessionStorage.setItem('currencyCode', admin.currencyCode);

                let count = 2
                Swal.fire({
                    icon: 'success',
                    title: `Welcome back, ${admin.name}!`,
                    html: `Login successful. Redirecting to Dashboard in <strong>${count}</strong> seconds...`,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    customClass: {
                        popup: 'rounded-lg',
                        title: 'text-xl font-semibold'
                    },
                    didOpen: () => {
                        const timer = setInterval(() => {
                            count -= 1
                            if (count <= 0) {
                                clearInterval(timer)
                                Swal.close()
                            } else {
                                Swal.getHtmlContainer().innerHTML =
                                    `Login successful. Redirecting to Dashboard in <strong>${count}</strong> seconds...`
                            }
                        }, 1000)
                    }
                })
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2100)
            }).catch((err) => {
                setSubmitLoading(false)
                let errMessage = err.response.data.message;
                toast.error(errMessage)
                console.log(err.response.data);
            })
    }

    const getInputClassName = (hasError) =>
        `w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${hasError
            ? 'border-red-500 focus:ring-red-200 bg-red-50'
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
        }`

    return (
        <>
            <div className="min-h-screen flex justify-center p-2">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white"
                    >
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <FaSignInAlt className="text-2xl" />
                            <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                        </div>
                        <p className="text-blue-100 text-center text-sm">
                            Sign in to your account to continue
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className={`h-5 w-5 ${userDataError.emailErr ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="email"
                                    value={userData.email}
                                    onChange={e => setUserData({ ...userData, email: e.target.value })}
                                    className={getInputClassName(userDataError.emailErr)}
                                    placeholder="Enter your email address"
                                />
                            </div>
                            {userDataError.emailErr && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-sm text-red-600 flex items-center"
                                >
                                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                    {userDataError.emailErr}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className={`h-5 w-5 ${userDataError.passErr ? 'text-red-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={userData.password}
                                    onChange={e => setUserData({ ...userData, password: e.target.value })}
                                    className={getInputClassName(userDataError.passErr)}
                                    placeholder="Enter your password"
                                />
                                <motion.button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </motion.button>
                            </div>
                            {userDataError.passErr && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-sm text-red-600 flex items-center"
                                >
                                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                    {userDataError.passErr}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex items-center justify-between"
                        >
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    onClick={() => setRemember(!remember)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <motion.button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Forgot password?
                            </motion.button>
                        </motion.div>

                        {/* Submit Button */}
                        {
                            submitLoading ? <button
                                type="button"
                                disabled={true}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-500 transform hover:scale-[1.02]`}
                            >
                                <div className="flex items-center justify-center">
                                    <LoaderIcon className="h-5 w-5 animate-spin" />
                                </div>
                            </button>
                                : <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${isFormValid
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-500 transform hover:scale-[1.02]'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <FaCheckCircle className="h-5 w-5" />
                                        <span>Login</span>
                                    </div>
                                </button>
                        }
                    </form>

                </motion.div>
            </div>
        </>
    )
}