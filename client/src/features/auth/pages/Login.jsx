import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('') 

  
  const handleLogin = (e) => {
    e.preventDefault() 
    setError('')

    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields to sign in, Nilesh!')
      return
    }

    
    console.log('Payload secure. Passing data to login node route:', { email, password })
    alert(`Signing in with email: ${email}`)
  }

  return (
    <div>
      <div><h1>OmniMind AI</h1></div>

      <div>
        <form onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          
          <div>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>Toggle</button>
          </div>

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default Login