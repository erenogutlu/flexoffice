import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [desks, setDesks] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    // New State variables for the Time-Slot Picker
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    useEffect(() => {
        fetchDesks()
    }, [])

    const fetchDesks = () => {
        fetch('http://localhost:8080/api/desks/active')
            .then(response => response.json())
            .then(data => {
                setDesks(data)
                setLoading(false)
            })
            .catch(error => {
                console.error("Failed to connect to API:", error)
                setLoading(false)
            })
    }

    const handleReserve = (deskId) => {
        // Validation: Check if user selected both times
        if (!startTime || !endTime) {
            setMessage('⚠️ Warning: Please select both a Start Time and an End Time.')
            return
        }

        // Validation: Check if End Time is actually AFTER Start Time
        if (new Date(startTime) >= new Date(endTime)) {
            setMessage('⚠️ Warning: End Time must be strictly after Start Time.')
            return
        }

        // Append ':00' to match Java's expected LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
        const formattedStartTime = startTime + ':00'
        const formattedEndTime = endTime + ':00'

        const reservationPayload = {
            user: { id: 1 },
            reservedDesk: { id: deskId },
            startTime: formattedStartTime,
            endTime: formattedEndTime
        }

        fetch('http://localhost:8080/api/reservations/desk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationPayload)
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json()
                    setMessage(`Success! Desk reserved successfully. Booking ID: ${data.id}`)
                } else {
                    const errorText = await response.text()
                    setMessage(`❌ Conflict Error: ${errorText || 'The desk is already reserved for this time.'}`)
                }
            })
            .catch(error => {
                setMessage('❌ Network Error: Could not reach the Java Backend. Is it running?')
                console.error('Reservation error:', error)
            })
    }

    if (loading) return <h2>Loading Workspace Data...</h2>

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
            <h1>🏢 FlexOffice Workspace Dashboard</h1>

            {/* TIME-SLOT PICKER PANEL */}
            <div style={{
                backgroundColor: '#e9ecef',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
            }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>🟢 Start Time:</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>🔴 End Time:</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            {message && (
                <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontWeight: 'bold',
                    backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
                    color: message.includes('Success') ? '#155724' : '#721c24'
                }}>
                    {message}
                </div>
            )}

            {/* DESK GRID */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {desks.map((desk) => (
                    <div key={desk.id} style={{
                        border: '2px solid #007BFF',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '250px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>{desk.deskCode}</h2>
                        <p style={{ margin: '5px 0' }}>📍 <strong>Location:</strong> {desk.location}</p>
                        <p style={{ margin: '5px 0', color: 'green' }}>✅ Status: Available</p>
                        <button
                            onClick={() => handleReserve(desk.id)}
                            style={{
                                marginTop: '15px',
                                padding: '10px',
                                width: '100%',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
                        >
                            Book Desk Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App