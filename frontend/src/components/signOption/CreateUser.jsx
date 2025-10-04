import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding, FaCheckCircle, FaGlobe, FaChevronDown } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function CreateUser() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        country: '',
        countryCode: '',
        currencyCode: '',
        currencySign: '',
        role: 'admin'
    })
    const [userDataError, setUserDataError] = useState({
        nameErr: '',
        emailErr: '',
        passErr: '',
        passMatch: '',
        countryErr: ''
    })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [countries, setCountries] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,cca2')
                const data = await response.json()
                
                const transformedCountries = data
                    .map(country => {
                        const currencyKey = Object.keys(country.currencies || {})[0]
                        const currency = currencyKey ? country.currencies[currencyKey] : null
                        
                        return {
                            name: country.name.common,
                            countryCode: country.cca2,
                            currencyCode: currencyKey || '',
                            currencyName: currency?.name || '',
                            currencySign: currency?.symbol || ''
                        }
                    })
                    .filter(country => country.currencyCode && country.currencySign)
                    .sort((a, b) => a.name.localeCompare(b.name))
                
                setCountries(transformedCountries)
            } catch (error) {
                console.error('Error fetching countries:', error)
                toast.error('Failed to load countries data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCountries()
    }, [])

    // for validation
    useEffect(() => {
        let nameErr = ''
        let emailErr = ''
        let passErr = ''
        let passMatch = ''
        let countryErr = ''

        if (userData.name.trim() === '') {
            nameErr = 'Enter Name'
        } else if (userData.name.trim().length < 2) {
            nameErr = 'Name must be at least 2 characters long'
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (userData.email === '') {
            emailErr = 'Email is required'
        } else if (!emailRegex.test(userData.email)) {
            emailErr = 'Please enter a valid email address'
        }

        const passRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
        if (userData.password === '') {
            passErr = 'Password is required'
        } else if (!passRegex.test(userData.password)) {
            passErr = 'Password must be at least 8 characters long and contain both letters and numbers'
        }

        if (confirmPassword === '') {
            passMatch = 'Please confirm your password'
        } else if (userData.password !== confirmPassword) {
            passMatch = "Passwords don't match"
        }

        if (userData.country === '') {
            countryErr = 'Please select a country'
        }

        setUserDataError({
            nameErr,
            emailErr,
            passErr,
            passMatch,
            countryErr,
        })

        setIsFormValid(
            nameErr === '' && 
            emailErr === '' && 
            passErr === '' && 
            passMatch === '' &&
            countryErr === '' &&
            userData.name.trim() !== '' &&
            userData.email !== '' &&
            userData.password !== '' &&
            confirmPassword !== '' &&
            userData.country !== ''
        )
    }, [userData, confirmPassword])

    const handleCountrySelect = (country) => {
        setUserData({
            ...userData,
            country: country.name,
            countryCode: country.countryCode,
            currencyCode: country.currencyCode,
            currencySign: country.currencySign
        })
        setIsDropdownOpen(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!isFormValid) {
            toast.error('Please fix the errors before submitting')
            return
        }

        console.log('User data submitted:', {
            ...userData,
            password: '***',
            confirmPassword: '***',
        })

        let count = 3
        Swal.fire({
            icon: 'success',
            title: 'Account Created Successfully!',
            html: `Account Created for ${userData.name} in ${userData.country}. Redirecting to Dashboard in <strong>${count}</strong> seconds...`,
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
                            `Account Created for ${userData.name} in ${userData.country}. Redirecting to Dashboard in <strong>${count}</strong> seconds...`
                    }
                }, 1000)
            }
        })
        setTimeout(()=>{
            navigate('/dashboard')
        }, 3100)
    }

    const getInputClassName = (hasError) => 
        `w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            hasError 
                ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
        }`

    const getDropdownClassName = (hasError) => 
        `w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-left cursor-pointer ${
            hasError 
                ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
        }`

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <FaBuilding className="text-2xl" />
                        <h1 className="text-2xl font-bold text-center">Register Your Company</h1>
                    </div>
                    <p className="text-blue-100 text-center text-sm">
                        Create your company account and get started
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className={`h-5 w-5 ${userDataError.nameErr ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <input 
                                type="text"
                                value={userData.name}
                                onChange={e => setUserData({ ...userData, name: e.target.value })}
                                className={getInputClassName(userDataError.nameErr)}
                                placeholder="Enter your full name"
                            />
                        </div>
                        {userDataError.nameErr && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                {userDataError.nameErr}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
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
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                {userDataError.emailErr}
                            </p>
                        )}
                    </div>

                    {/* Country Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaGlobe className={`h-5 w-5 ${userDataError.countryErr ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={getDropdownClassName(userDataError.countryErr)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={userData.country ? 'text-gray-900' : 'text-gray-500'}>
                                        {userData.country || 'Select your country'}
                                    </span>
                                    <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            
                            {/* Country Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Loading countries...
                                        </div>
                                    ) : (
                                        countries.map((country) => (
                                            <button
                                                key={country.countryCode}
                                                type="button"
                                                onClick={() => handleCountrySelect(country)}
                                                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{country.name}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {country.currencyCode} ({country.currencySign})
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Code: {country.countryCode}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        {userDataError.countryErr && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                {userDataError.countryErr}
                            </p>
                        )}
                        
                        {/* Selected Country Info */}
                        {userData.country && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-sm text-blue-800">
                                    <div className="flex justify-between">
                                        <span>Country:</span>
                                        <span className="font-medium">{userData.country}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Country Code:</span>
                                        <span className="font-medium">{userData.countryCode}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Currency:</span>
                                        <span className="font-medium">
                                            {userData.currencyCode} ({userData.currencySign})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
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
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {userDataError.passErr && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                {userDataError.passErr}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className={`h-5 w-5 ${userDataError.passMatch ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className={getInputClassName(userDataError.passMatch)}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {userDataError.passMatch && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                {userDataError.passMatch}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                            isFormValid
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-500 transform hover:scale-[1.02]'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <FaCheckCircle className="h-5 w-5" />
                            <span>Create Account</span>
                        </div>
                    </button>
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-600">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}