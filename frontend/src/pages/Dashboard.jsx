import React, { useEffect, useState } from 'react'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import Layout from '../Layout'
import axios from 'axios'
import { baseUrl } from '../baseUrl'

export default function Dashboard({ usertype }) {
    const [type, setType] = useState(usertype)

    useEffect(() => {
        axios.get(`${baseUrl}/api/dashboard/`)
            .then(data => {
                console.log(data);
                
            })
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
