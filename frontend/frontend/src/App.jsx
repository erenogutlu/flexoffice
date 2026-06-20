import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [desks, setDesks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8080/api/desks/active')
        .then(response => response.json())
        .then(data => {
          setDesks(data)
          setLoading(false)
        })
        .catch(error => {
          console.error("API'ye bağlanılamadı!", error)
          setLoading(false)
        })
  }, [])

  if (loading) return <h2>Masalar Yükleniyor...</h2>

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🏢 FlexOffice Masa Rezervasyonu</h1>
        <p>Gerçek veritabanından (PostgreSQL) gelen masalar:</p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {desks.map((desk) => (
              <div key={desk.id} style={{
                border: '2px solid #4CAF50',
                borderRadius: '10px',
                padding: '20px',
                width: '250px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>{desk.deskCode}</h2>
                <p style={{ margin: '5px 0' }}>📍 <strong>Konum:</strong> {desk.location}</p>
                <p style={{ margin: '5px 0', color: 'green' }}>✅ Durum: Aktif</p>
                <button style={{
                  marginTop: '15px',
                  padding: '10px',
                  width: '100%',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  Rezerve Et
                </button>
              </div>
          ))}
        </div>
      </div>
  )
}

export default App