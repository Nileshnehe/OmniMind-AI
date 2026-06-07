import React, { useState } from 'react'

const Register = () => {

    // Input Tracking States
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)


    // Live Avatar
    const avatarLetter = name.trim() ? name.trim().charAt(0).toUpperCase() : '?'
    return (
        <div>
            {/* Left Side */}
            <div>
                <h2>OmniMind AI</h2>
                <p>Description</p>
            </div>
           
            {/* Right Side */}
            <div>
                <form>
                    <h3>Create Your Account</h3>

                    {/* user */}
                    <div>
                        <div>{avatarLetter}</div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}

                            placeholder='Enter Your Name'
                        />
                    </div>

                    {/* email */}
                    <div>
                        <span></span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter Your Email'
                        />
                    </div>

                    {/* password */}
                    <div>
                        <span></span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter Password'
                        />
                        <button type="button">eye</button>
                    </div>
                    <button type="submit">Sign Up</button>

                    {/* already acc */}
                    <p>Already have an account? {' '}
                        <a
                            href="/login"
                        >
                            sign In
                        </a>
                    </p>
                </form>

            </div>

        </div>
    )
}

export default Register