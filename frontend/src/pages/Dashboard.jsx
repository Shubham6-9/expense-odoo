import React, { useEffect, useState } from 'react'
import AdminDashboard from '../components/dashboard/AdminDashboard'

export default function Dashboard({ usertype }) {
    const [type, setType] = useState(usertype)

    useEffect(() => {

    })

    return (
        <>
            <h1>Dashboard</h1>
            <AdminDashboard />
        </>
    )
}
