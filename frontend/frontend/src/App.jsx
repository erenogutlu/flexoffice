import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [desks, setDesks] = useState([])
    const [rooms, setRooms] = useState([])
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    // New State variables for the Time-Slot Picker
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    useEffect(() => {
        fetchDesks()
        fetchRooms()
        fetchReservations()
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

    const fetchRooms = () => {
        fetch('http://localhost:8080/api/rooms/active')
            .then(res => res.json())
            .then(data => {
                setRooms(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("API Error (Rooms):", err)
                setLoading(false)
            })
    }

    const fetchReservations = () => {
        fetch('http://localhost:8080/api/reservations')
            .then(res => res.json())
            .then(data => {
                setReservations(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("API Error (Reservations):", err)
                setLoading(false)
            })
    }

    const validateTimes = () => {
        if (!startTime || !endTime) {
            setMessage('Warning: Please select both a Start Time and End Time')
            return false
        }
        if (new Date(startTime) >= new Date(endTime)) {
            setMessage('Warning: End Time must be strictly after Start Time')
            return false
        }
        return true
    }
    const handleReserveDesk = (deskId) => {
        if (!validateTimes()) return

        const formattedStartTime = startTime.length === 16 ? startTime + ':00' : startTime;
        const formattedEndTime = endTime.length === 16 ? endTime + ':00' : endTime;

        const payLoad = {
            user: {id: 1},
            reservedDesk: {id: deskId},
            startTime: formattedStartTime,
            endTime: formattedEndTime
        }
        sendReservationRequest('http://localhost:8080/api/reservations/desk', payLoad, 'Desk')
    }

    const handleReserveRoom = (roomId) => {
        if (!validateTimes()) return

        const formattedStartTime = startTime.length === 16 ? startTime + ':00' : startTime;
        const formattedEndTime = endTime.length === 16 ? endTime + ':00' : endTime;

        const payLoad = {
            user: {id: 1},
            reservedMeetingRoom: {id: roomId},
            startTime: formattedStartTime,
            endTime: formattedEndTime
        }

        sendReservationRequest('http://localhost:8080/api/reservations/room', payLoad, 'Meeting Room')
    }

    const sendReservationRequest = (url, payload, type) => {
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })
            .then(async response => {
                if (response.ok) {
                    const data = await response.json()
                    setMessage(`Success! ${type} reserved successfully. Booking ID: ${data.id}`)

                    fetchReservations()
                } else {
                    const errorText = await response.text()
                    setMessage(`❌ Conflict Error: ${errorText || `The ${type.toLowerCase()} is already reserved for this time.`}`)
                }
            })
            .catch(error => {
                setMessage('❌ Network Error: Could not reach the Java Backend. Is it running?')
                console.error('Reservation error:', error)
            })
    }

    const handleCancelReservation = (reservationId) => {
        fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setMessage(`🗑️ Reservation #${reservationId} cancelled successfully.`);
                    fetchReservations();
                } else {
                    setMessage('❌ Error: Could not cancel the reservation.');
                }
            })
            .catch(error => console.error('Cancel Error:', error));
    }

    const handleDeleteAllReservations = () => {
        if (!window.confirm("Are you sure you want to delete ALL reservations? This cannot be undone!")) return;

        fetch('http://localhost:8080/api/reservations', {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setMessage('💥 All reservations have been deleted successfully.');
                    fetchReservations(); // Tabloyu anında temizle
                } else {
                    setMessage('❌ Error: Could not delete all reservations.');
                }
            })
            .catch(error => console.error('Delete All Error:', error));
    }

    if (loading) return <h2>Loading Workspace Data...</h2>
    return (
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto'}}>
            <h1>🏢 FlexOffice Workspace Dashboard</h1>

            {/* MY BOOKINGS PANEL */}
            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: '#856404' }}>📋 My Bookings</h2>

                    {reservations.length > 0 && (
                        <button
                            onClick={handleDeleteAllReservations}
                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            ⚠️ Delete All
                        </button>
                    )}
                </div>

                {reservations.length === 0 ? (
                    <p style={{ color: '#856404', margin: 0 }}>You don't have any active reservations yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#ffe8a1', textAlign: 'left' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Workspace</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Start Time</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>End Time</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservations.map((res) => (
                            <tr key={res.id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>#{res.id}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {res.reservedDesk ? `Desk: ${res.reservedDesk.deskCode}` : res.reservedMeetingRoom ? `Room: ${res.reservedMeetingRoom.roomName || res.reservedMeetingRoom.name}` : 'Unknown'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(res.startTime).toLocaleString()}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(res.endTime).toLocaleString()}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleCancelReservation(res.id)}
                                        style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

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
                    <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>🟢 Start Time:</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                    />
                </div>
                <div>
                    <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>🔴 End Time:</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
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
            <hr style={{margin: '30px 0', border: '1px solid #ddd'}}/>

            {/* DESKS SECTION */}
            <h2 style={{color: '#0056b3'}}>💻 Available Desks</h2>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px'}}>
                {desks.map((desk) => (
                    <div key={desk.id} style={{
                        border: '2px solid #007BFF',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '250px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{margin: '0 0 10px 0'}}>{desk.deskCode}</h3>
                        <p style={{margin: '5px 0'}}>📍 {desk.location}</p>
                        <button
                            onClick={() => handleReserveDesk(desk.id)}
                            style={{
                                marginTop: '15px',
                                padding: '10px',
                                width: '100%',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Book Desk
                        </button>
                    </div>
                ))}
            </div>

            {/* MEETING ROOMS SECTION */}
            <h2 style={{color: '#6f42c1'}}>🤝 Meeting Rooms</h2>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                {rooms.map((room) => (
                    <div key={room.id} style={{
                        border: '2px solid #6f42c1',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '250px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{margin: '0 0 10px 0'}}>{room.roomName || room.name || "Unknown Room"}</h3>                        <p style={{margin: '5px 0'}}>👥 Capacity: {room.capacity} people</p>
                        <button
                            onClick={() => handleReserveRoom(room.id)}
                            style={{
                                marginTop: '15px',
                                padding: '10px',
                                width: '100%',
                                backgroundColor: '#6f42c1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Book Room
                        </button>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default App