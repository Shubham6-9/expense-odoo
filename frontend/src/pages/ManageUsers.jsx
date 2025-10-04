import React, { useState, useEffect } from 'react'
import Layout from '../Layout'
import { 
    FaSearch, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaUserPlus,
    FaUserCog,
    FaUserTie,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { baseUrl } from '../baseUrl'

export default function ManageUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [usersLoading, setUsersLoading] = useState(true)
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: ''
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setUsersLoading(true)
            const response = await fetch(`${baseUrl}/api/dashboard/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            
            if (!response.ok) {
                throw new Error('Failed to fetch users')
            }
            
            const data = await response.json()
            setUsers(data.users || data.data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load users')
        } finally {
            setUsersLoading(false)
        }
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        
        if (!newUser.name || !newUser.email || !newUser.role) {
            toast.error('Please fill all fields')
            return
        }

        try {
            setLoading(true)
            const response = await fetch(`${baseUrl}/api/users/admin-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(newUser)
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create user')
            }
            
            toast.success('User created successfully')
            setNewUser({ name: '', email: '', role: '' })
            fetchUsers() // Refresh the users list
        } catch (error) {
            console.error('Error creating user:', error)
            toast.error(error.message || 'Failed to create user')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return
        }

        try {
            // Note: You'll need to implement a delete API endpoint
            const response = await fetch(`${baseUrl}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            
            // For now, we'll just update the local state
            // setUsers(users.filter(user => user.id !== userId))
            toast.success('User deleted successfully')
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Failed to delete user')
        }
    }

    const handleStatusToggle = async (userId) => {
        try {
            // Note: You'll need to implement a status update API endpoint
            const response = await fetch(`${baseUrl}/api/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            })
            
            // For now, we'll just update the local state
            // setUsers(users.map(user => 
            //     user.id === userId 
            //         ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
            //         : user
            // ))
            toast.success('User status updated successfully')
        } catch (error) {
            console.error('Error updating user status:', error)
            toast.error('Failed to update user status')
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        
        return matchesSearch && matchesRole
    })

    const getRoleIcon = (role) => {
        switch (role) {
            case 'manager': return FaUserTie
            case 'employee': return FaUser
            default: return FaUserCog
        }
    }

    const getStatusBadge = (status) => {
        return status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    return (
        <Layout>
            <div className="p-6 space-y-6 dark:bg-gray-800 min-h-screen">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <FaUserCog className="mr-3 text-blue-600" />
                            Manage Users
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Create and manage user accounts
                        </p>
                    </div>
                    <div className="mt-4 lg:mt-0">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {filteredUsers.length} users found
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add User Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FaUserPlus className="mr-2 text-green-600" />
                                Add New User
                            </h2>
                            
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input 
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <input 
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role
                                    </label>
                                    <select 
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="manager">Manager</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed text-white' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    {loading ? (
                                        'Creating...'
                                    ) : (
                                        <>
                                            <FaPlus className="mr-2" />
                                            Add User
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            {/* Filters and Search */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="manager">Manager</option>
                                            <option value="employee">Employee</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                {usersLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading users...</p>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <FaExclamationTriangle className="text-yellow-500 text-2xl mx-auto mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                            {filteredUsers.map((user) => {
                                                const RoleIcon = getRoleIcon(user.role)
                                                return (
                                                    <tr key={user.id || user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                                    {user.name?.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {user.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                                <RoleIcon className="mr-2 text-gray-400" />
                                                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                                                                {user.status === 'active' ? (
                                                                    <FaCheckCircle className="mr-1" />
                                                                ) : (
                                                                    <FaTimesCircle className="mr-1" />
                                                                )}
                                                                {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => handleStatusToggle(user.id || user._id)}
                                                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                                                        user.status === 'active'
                                                                            ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900'
                                                                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900'
                                                                    }`}
                                                                >
                                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                                <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200">
                                                                    <FaEdit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id || user._id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                                                                >
                                                                    <FaTrash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}