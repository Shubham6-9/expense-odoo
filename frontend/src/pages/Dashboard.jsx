import React, { useEffect, useState } from 'react'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import Layout from '../Layout'

export default function Dashboard({ usertype }) {
    const [type, setType] = useState(usertype)

    useEffect(() => {

    })

    return (
        <>
            <Layout>
                <div>
                    <h1>Dashboard</h1>
                    <AdminDashboard />
                </div>
            </Layout>
        </>
    )
}
