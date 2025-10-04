import React from 'react'
import Header from './components/shared/Header'
import Sidebar from './components/shared/Sidebar'

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <div className='flex'>
                <div>
                    <Sidebar />
                </div>
                <div>
                    {children}
                </div>
            </div>
        </>
    )
}
