import React, { useEffect, useState } from 'react'

export default function Login() {
    const [userData, setUserDate] = useState({
        email: '',
        password: '',
        role: 'admin'
    })
    const [userDataError, setUserDataError] = useState({
        emailErr: '',
        passErr: '',
    })

    useEffect(() => {

    }, [userData])

    return (
        <>
            <div>
                <h1>Login</h1>
                <form>
                    <select value={userData.role} onChange={e => setUserDate(e.target.value)}>
                        <option value='admin'>Admin</option>
                        <option value='approver'>Manager/Approver</option>
                        <option value='employee'>Employee</option>
                    </select>
                    <input type='text' placeholder='Enter Email' />
                    <p>{userDataError.emailErr}</p>
                    <input type='text' placeholder='Enter Password' />
                    <p>{userDataError.passErr}</p>
                </form>
            </div>
        </>
    )
}