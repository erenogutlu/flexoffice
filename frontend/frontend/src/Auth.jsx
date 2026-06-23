import {useState} from 'react';

function Auth({onLogin}){
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isLoginMode
            ? 'http://localhost:8080/api/auth/login'
            : 'http://localhost:8080/api/auth/register';

        const payLoad = isLoginMode
            ?{ email, password}
            :{firstName, lastName, email, password};

        fetch(url, {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(payLoad)
        })
            .then(async response => {
                if (response.ok) {
                    if (isLoginMode) {
                        const userData = await response.json();
                        onLogin(userData);
                    } else {
                        setMessage('✅ Registration successful! Please log in.');
                        setIsLoginMode(true);
                    }
                }
                else
                    {
                        const errorText = await response.text();
                        setMessage(`❌ Error: ${errorText}`);
                    }
            })
            .catch(error => {
                setMessage('❌ Network Error. Is Java Backend running?');
            });
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', color: '#333' }}>
                    {isLoginMode ? '🏢 FlexOffice Login' : '🏢 Create Account'}
                </h2>

                {message && (
                    <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: message.includes('❌') ? '#f8d7da' : '#d4edda', color: message.includes('❌') ? '#721c24' : '#155724', borderRadius: '5px', fontSize: '14px', textAlign: 'center' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!isLoginMode && (
                        <>
                            <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </>
                    )}
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        {isLoginMode ? 'Login' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => { setIsLoginMode(!isLoginMode); setMessage(''); }}
                        style={{ color: '#007BFF', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        {isLoginMode ? 'Register here' : 'Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;