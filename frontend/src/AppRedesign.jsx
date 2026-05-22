import { useEffect, useState, useCallback } from 'react'

// ─── Theme ───────────────────────────────────────────────────────────────────
// Pastel blue-orange palette, easy on the eyes
const C = {
  bg: '#0c0d10',
  surface: '#13151a',
  surfaceAlt: '#1a1c23',
  border: '#22252e',
  borderHov: '#2e3240',

  accent: '#c4a882',   // pastel warm orange/sand — primary accent
  accentDim: '#8c6f52',   // darker accent for borders
  accentBg: '#1e1912',   // very dark tinted background

  blue: '#8ab4d4',   // pastel blue — secondary
  blueDim: '#4a7a9b',
  blueBg: '#10161e',

  text: '#d4cfc8',   // warm off-white
  textMid: '#7a7670',
  textDim: '#454340',

  danger: '#c47a7a',
  dangerBg: '#1e1212',
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', sym: '⊞' },
  { id: 'habits', label: 'Habits', sym: '◎' },
  { id: 'calendar', label: 'Calendar', sym: '▦' },
  { id: 'settings', label: 'Settings', sym: '⚙' },
]

const ICONS = ['📚', '💪', '🏃', '💧', '🧘', '🎸', '🛌', '🧠', '📖', '🚀', '🎯', '🔥']

// ─── Responsive hook ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 700)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 700)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, tint }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: '16px 18px',
      flex: 1,
      minWidth: 130,
      borderTop: `2px solid ${tint || C.accentDim}`,
    }}>
      <p style={{ color: C.textMid, fontSize: 10, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1.2 }}>{label}</p>
      <p style={{ color: C.text, fontSize: 26, fontWeight: 700, margin: '0 0 3px', fontFamily: 'monospace', letterSpacing: -1 }}>{value}</p>
      {sub && <p style={{ color: tint || C.accent, fontSize: 11, margin: 0 }}>{sub}</p>}
    </div>
  )
}

// ─── Input style helper ───────────────────────────────────────────────────────
const inputStyle = {
  display: 'block', width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid ${C.border}`,
  borderRadius: 10, padding: '11px 13px', color: C.text,
  fontSize: 14, outline: 'none', marginTop: 6,
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [habitToDelete, setHabitToDelete] = useState(null)
  const [editingHabitId, setEditingHabitId] = useState(null)
  const [editedHabitName, setEditedHabitName] = useState('')
  const [openMenuHabitId, setOpenMenuHabitId] = useState(null)
  const [showAddHabitModal, setShowAddHabitModal] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState('📚')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

  // ── API calls ───────────────────────────────────────────────────────────────
  const fetchHabits = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8080/api/habits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setHabits(await res.json())
    } catch (e) { console.error(e) }
  }, [])

  const handleLogin = async () => {

    try {

      const res = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      if (!res.ok) {

        alert('Invalid email or password')

        return
      }

      const token = await res.text()

      if (!token || token.trim() === '') {

        alert('Login failed')

        return
      }

      localStorage.setItem('token', token)

      setIsLoggedIn(true)

      fetchHabits()

    } catch (e) {

      console.error(e)

      alert('Server error')

    }
  }

  const handleRegister = async () => {

    try {

      const res = await fetch(
        'http://localhost:8080/api/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: email.split('@')[0],
            email,
            password,
          }),
        }
      )

      if (!res.ok) {

        alert('Registration failed')

        return
      }

      alert('Account created successfully')

      setIsSignup(false)

    } catch (e) {

      console.error(e)

      alert('Server error')

    }
  }


  const addHabit = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch('http://localhost:8080/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newHabit, icon: selectedIcon }),
      })
      setNewHabit('')
      fetchHabits()
    } catch (e) { console.error(e) }
  }

  const completeHabit = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:8080/api/habits/${id}/complete`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      })
      fetchHabits()
    } catch (e) { console.error(e) }
  }

  const deleteHabit = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:8080/api/habits/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      fetchHabits()
    } catch (e) { console.error(e) }
  }

  const updateHabit = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:8080/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editedHabitName }),
      })
      setHabits(prev => prev.map(h => h.id === id ? { ...h, name: editedHabitName } : h))
      setEditingHabitId(null)
      setEditedHabitName('')
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchHabits() }, [fetchHabits])

  // ── Derived stats ───────────────────────────────────────────────────────────
  const completedToday = habits.filter(h => h.completedToday).length
  const pct = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0
  const totalStreak = habits.reduce((acc, h) => {
    if (!h.completedDates?.length) return acc
    let s = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (h.completedDates.includes(d.toISOString().split('T')[0])) s++
      else break
    }
    return acc + s
  }, 0)

  // ── Login page ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', background: C.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '-apple-system, "Segoe UI", sans-serif', padding: '0 16px',
      }}>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 22, padding: isMobile ? '36px 24px' : '48px 40px',
          width: '100%', maxWidth: 380,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 34, height: 34, background: C.accentBg,
              border: `1px solid ${C.accentDim}`,
              borderRadius: 9, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16,
            }}>◈</div>
            <span style={{ color: C.text, fontSize: 21, fontWeight: 700, letterSpacing: 1 }}>TAAL</span>
          </div>
          <p style={{ color: C.textMid, fontSize: 13, marginBottom: 32 }}>Build consistency, daily.</p>

          <label style={{ color: C.textMid, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" style={{ ...inputStyle, marginBottom: 14 }} />

          <label style={{ color: C.textMid, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" style={{ ...inputStyle, marginBottom: 26 }} />

          <button
            onClick={isSignup ? handleRegister : handleLogin}
            style={{
              width: '100%',
              padding: '13px',
              background: C.accentBg,
              border: `1px solid ${C.accentDim}`,
              borderRadius: 11,
              color: C.accent,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              letterSpacing: 0.5,
            }}
          >
            {isSignup ? 'Create Account →' : 'Sign In →'}
          </button>
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{
              marginTop: 14,
              width: '100%',
              background: 'none',
              border: 'none',
              color: C.textMid,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {isSignup
              ? 'Already have an account? Sign In'
              : 'Create a new account'}
          </button>
        </div>
      </div>
    )
  }

  // ── Shared topbar ───────────────────────────────────────────────────────────
  const Topbar = (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '14px 16px' : '14px 24px',
      borderBottom: `1px solid ${C.border}`,
      background: C.surface, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isMobile && (
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: 'none', border: 'none', color: C.textMid,
            cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1,
          }}>☰</button>
        )}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, background: C.accentBg,
              border: `1px solid ${C.accentDim}`, borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
            }}>◈</div>
            <span style={{ color: C.text, fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>TAAL</span>
          </div>
        )}
        {!isMobile && (
          <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text }}>Habit Dashboard</h1>
        )}
      </div>
      <button onClick={() => setShowAddHabitModal(true)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: C.accentBg, border: `1px solid ${C.accentDim}`,
        color: C.accent, padding: '8px 14px',
        borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: 'pointer',
      }}>
        + New Habit
      </button>
    </div>
  )

  // ── Habit card ──────────────────────────────────────────────────────────────
  const HabitCard = ({ habit }) => (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 14, padding: '16px 18px',
      borderLeft: `3px solid ${habit.completedToday ? C.accentDim : C.border}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {editingHabitId === habit.id ? (
          <input
            type="text" value={editedHabitName}
            onChange={e => setEditedHabitName(e.target.value)}
            onBlur={() => updateHabit(habit.id)}
            onKeyDown={e => e.key === 'Enter' && updateHabit(habit.id)}
            autoFocus
            style={{
              background: 'transparent', border: 'none',
              borderBottom: `1px solid ${C.accent}`,
              color: C.text, fontSize: 15, fontWeight: 600,
              outline: 'none', flex: 1,
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 38, height: 38, background: C.accentBg,
              borderRadius: 9, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 19,
            }}>{habit.icon || '📚'}</div>
            <div>
              <h3
                onDoubleClick={() => { setEditingHabitId(habit.id); setEditedHabitName(habit.name) }}
                style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text, cursor: 'pointer' }}
              >{habit.name}</h3>
              <p style={{ margin: 0, color: C.textDim, fontSize: 11 }}>
                {habit.completedDates?.length || 0} completions total
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
          <button onClick={() => completeHabit(habit.id)} style={{
            padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.15s',
            background: habit.completedToday ? C.accentBg : 'transparent',
            border: `1px solid ${habit.completedToday ? C.accentDim : C.border}`,
            color: habit.completedToday ? C.accent : C.textMid,
          }}>
            {habit.completedToday ? '✓ Done' : 'Mark Done'}
          </button>

          <button onClick={() => setOpenMenuHabitId(openMenuHabitId === habit.id ? null : habit.id)} style={{
            width: 32, height: 32, borderRadius: 7,
            background: C.surfaceAlt, border: `1px solid ${C.border}`,
            color: C.textMid, cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>⋯</button>

          {openMenuHabitId === habit.id && (
            <div style={{
              position: 'absolute', top: 38, right: 0,
              background: C.surfaceAlt, border: `1px solid ${C.border}`,
              borderRadius: 10, overflow: 'hidden', zIndex: 50, minWidth: 140,
            }}>
              <button onClick={() => { setEditingHabitId(habit.id); setEditedHabitName(habit.name); setOpenMenuHabitId(null) }}
                style={{
                  display: 'block', width: '100%', padding: '11px 14px',
                  background: 'none', border: 'none', color: C.text,
                  textAlign: 'left', cursor: 'pointer', fontSize: 13,
                }}>✏ Edit name</button>
              <button onClick={() => { setHabitToDelete(habit); setOpenMenuHabitId(null) }}
                style={{
                  display: 'block', width: '100%', padding: '11px 14px',
                  background: 'none', border: 'none', color: C.danger,
                  textAlign: 'left', cursor: 'pointer', fontSize: 13,
                  borderTop: `1px solid ${C.border}`,
                }}>🗑 Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Activity grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{
          display: 'grid', gridTemplateRows: 'repeat(7, 10px)',
          gridAutoFlow: 'column', gap: 3, width: 'max-content',
        }}>
          {[...Array(175)].map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (174 - i))
            const fmt = d.toISOString().split('T')[0]
            const done = habit.completedDates?.includes(fmt)
            return (
              <div key={i} title={fmt} style={{
                width: 10, height: 10, borderRadius: 2,
                background: done ? C.accent : C.surfaceAlt,
                opacity: done ? 0.85 : 0.6,
              }} />
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ color: C.textDim, fontSize: 10 }}>25 weeks ago</span>
        <span style={{ color: C.textDim, fontSize: 10 }}>Today</span>
      </div>
    </div>
  )

  // ── Body content (shared between desktop/mobile) ─────────────────────────────
  const BodyContent = (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '22px 28px' }}>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: 10, marginBottom: 24,
      }}>
        <StatCard label="Total Habits" value={habits.length} sub={`${completedToday} done today`} tint={C.accentDim} />
        <StatCard label="Done Today" value={`${completedToday}/${habits.length}`} sub={`${pct}% completion`} tint={C.blueDim} />
        <StatCard label="Streak Points" value={totalStreak} sub="consecutive days" tint={C.accentDim} />
        <StatCard label="Active Since" value="175d" sub="tracking window" tint={C.blueDim} />
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: C.textMid, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
          Your Habits
        </span>
        <span style={{ color: C.textDim, fontSize: 11 }}>{habits.length} total</span>
      </div>

      {/* Cards */}
      {activeNav === 'dashboard' && (

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {habits.map(h => <HabitCard key={h.id} habit={h} />)}
        </div>

      )}

      {activeNav === 'habits' && (

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 24,
        }}>
          <h2 style={{ marginTop: 0 }}>All Habits</h2>
          <p style={{ color: C.textMid }}>
            Habit management view coming soon.
          </p>
        </div>

      )}

      {activeNav === 'calendar' && (

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 24,
        }}>
          <h2 style={{ marginTop: 0 }}>Calendar</h2>
          <p style={{ color: C.textMid }}>
            Calendar analytics view coming soon.
          </p>
        </div>

      )}

      {activeNav === 'settings' && (

        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 24,
        }}>
          <h2 style={{ marginTop: 0 }}>Settings</h2>
          <p style={{ color: C.textMid }}>
            Theme and profile settings coming soon.
          </p>
        </div>

      )}

      {/* Spacer for mobile bottom nav */}
      {isMobile && <div style={{ height: 72 }} />}
    </div>
  )

  // ── Desktop layout ──────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div style={{
        minHeight: '100vh', background: C.bg,
        display: 'flex', fontFamily: '-apple-system, "Segoe UI", sans-serif', color: C.text,
      }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? 210 : 58, background: C.surface,
          borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
          padding: '20px 0', transition: 'width 0.22s ease', overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Brand */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: sidebarOpen ? '0 18px 26px' : '0 14px 26px',
          }}>
            <div style={{
              width: 30, height: 30, background: C.accentBg,
              border: `1px solid ${C.accentDim}`, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>◈</div>
            {sidebarOpen && <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1, color: C.text }}>TAAL</span>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1 }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                width: '100%', padding: sidebarOpen ? '11px 18px' : '11px 14px',
                background: activeNav === item.id ? C.accentBg : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${activeNav === item.id ? C.accentDim : 'transparent'}`,
                color: activeNav === item.id ? C.accent : C.textMid,
                cursor: 'pointer', fontSize: 13,
                fontWeight: activeNav === item.id ? 600 : 400,
                textAlign: 'left', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.sym}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); setHabits([]) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              width: '100%', padding: sidebarOpen ? '11px 18px' : '11px 14px',
              background: 'transparent', border: 'none',
              color: C.danger, cursor: 'pointer', fontSize: 13, textAlign: 'left',
            }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⏏</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {Topbar}
          {BodyContent}
        </div>

        {Modals()}
      </div>
    )
  }

  // ── Mobile layout ───────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, "Segoe UI", sans-serif', color: C.text,
      position: 'relative',
    }}>
      {Topbar}
      {BodyContent}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', background: C.surface,
        borderTop: `1px solid ${C.border}`, zIndex: 80,
      }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '10px 0 12px',
            background: 'none', border: 'none',
            color: activeNav === item.id ? C.accent : C.textMid,
            cursor: 'pointer', fontSize: 9, fontWeight: activeNav === item.id ? 700 : 400,
          }}>
            <span style={{ fontSize: 20 }}>{item.sym}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {Modals()}
    </div>
  )

  // ── Modals (shared) ─────────────────────────────────────────────────────────
  function Modals() {
    return (
      <>
        {/* Add Habit */}
        {showAddHabitModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 18, padding: '26px 24px',
              width: '100%', maxWidth: 420, margin: '0 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>New Habit</h2>
                <button onClick={() => setShowAddHabitModal(false)}
                  style={{ background: 'none', border: 'none', color: C.textMid, cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>

              <label style={{ color: C.textMid, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>Habit Name</label>
              <input type="text" value={newHabit} onChange={e => setNewHabit(e.target.value)}
                placeholder="e.g. Read 20 pages"
                style={{ ...inputStyle, marginBottom: 22 }} />

              <label style={{ color: C.textMid, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>Choose Icon</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: 10, marginBottom: 26 }}>
                {ICONS.map(icon => (
                  <button key={icon} onClick={() => setSelectedIcon(icon)} style={{
                    height: 46, borderRadius: 9, fontSize: 21,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.1s',
                    background: selectedIcon === icon ? C.accentBg : C.bg,
                    border: `1px solid ${selectedIcon === icon ? C.accentDim : C.border}`,
                    transform: selectedIcon === icon ? 'scale(1.08)' : 'scale(1)',
                  }}>{icon}</button>
                ))}
              </div>

              <button onClick={async () => { await addHabit(); setShowAddHabitModal(false); setSelectedIcon('📚') }}
                style={{
                  width: '100%', padding: '13px',
                  background: C.accentBg, border: `1px solid ${C.accentDim}`,
                  borderRadius: 11, color: C.accent,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}>
                Create Habit
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {habitToDelete && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 18, padding: '26px 24px',
              width: '100%', maxWidth: 360, margin: '0 16px',
            }}>
              <div style={{
                width: 44, height: 44, background: C.dangerBg, borderRadius: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 14,
              }}>🗑</div>
              <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: C.text }}>
                Delete "{habitToDelete.name}"?
              </h2>
              <p style={{ margin: '0 0 26px', color: C.textMid, fontSize: 13, lineHeight: 1.6 }}>
                This will permanently remove all streak history and completion data.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setHabitToDelete(null)} style={{
                  flex: 1, padding: '11px', borderRadius: 9,
                  background: C.surfaceAlt, border: `1px solid ${C.border}`,
                  color: C.text, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                }}>Cancel</button>
                <button onClick={async () => { await deleteHabit(habitToDelete.id); setHabitToDelete(null) }}
                  style={{
                    flex: 1, padding: '11px', borderRadius: 9,
                    background: C.dangerBg, border: `1px solid ${C.danger}`,
                    color: C.danger, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}
