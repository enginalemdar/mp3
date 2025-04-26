import { useState } from 'react'

export default function App() {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('5')
  const [mode, setMode] = useState('Serbest zaman')
  const [ageGroup, setAgeGroup] = useState('19-65 yaş için')
  const [character, setCharacter] = useState('Ali')
  const [loading, setLoading] = useState(false)
  const [audioSrc, setAudioSrc] = useState(null)

  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL

  const handleSubmit = async () => {
    setLoading(true)
    setAudioSrc(null)
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration, mode, ageGroup, character })
      })
      const data = await res.json()
      // assume your n8n returns { audioUrl: "https://..." }
      setAudioSrc(data.audioUrl)
    } catch (err) {
      console.error(err)
      alert('Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Dinleme App</h1>

      <label>Konu:</label>
      <input
        type="text" value={topic}
        onChange={e => setTopic(e.target.value)}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <label>Süre:</label>
      <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', marginBottom: 12 }}>
        {['5','10','15','20','25','30'].map(d => <option key={d}>{d}</option>)}
      </select>

      <label>Mod:</label>
      <select value={mode} onChange={e => setMode(e.target.value)} style={{ width: '100%', marginBottom: 12 }}>
        {['Uyku öncesi','Yolculuk','Serbest zaman','Toplu dinleti'].map(m => <option key={m}>{m}</option>)}
      </select>

      <label>Yaş Grubu:</label>
      <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ width: '100%', marginBottom: 12 }}>
        {['0-3 yaş için','4-6 yaş için','7-10 yaş için','11-14 yaş için','15-18 yaş için','19-65 yaş için','65 yaş üstü'].map(a => <option key={a}>{a}</option>)}
      </select>

      <label>Karakter:</label>
      <select value={character} onChange={e => setCharacter(e.target.value)} style={{ width: '100%', marginBottom: 20 }}>
        {['Ali','Eylül','Altay','Alya','Artun'].map(c => <option key={c}>{c}</option>)}
      </select>

      <button onClick={handleSubmit} style={{ width: '100%', padding: '12px' }}>
        Hazırla
      </button>

      {loading && <p>Hazırlanıyor…</p>}

      {audioSrc && (
        <audio controls style={{ width: '100%', marginTop: 20 }}>
          <source src={audioSrc} type="audio/mpeg" />
          Tarayıcınız audio elementini desteklemiyor.
        </audio>
      )}
    </div>
  )
}
