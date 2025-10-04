import React from 'react'
import CreateUser from '../components/signOption/CreateUser'
import Login from '../components/signOption/Login'

export default function SignOptions() {
    const [signType, setSignType] = useState('login')
    return (
        <>
            {
                signType === 'login' ? <Login />
                : <CreateUser />
            }
            {
                // signType === 'login' ? 
            }
        </>
    )
}