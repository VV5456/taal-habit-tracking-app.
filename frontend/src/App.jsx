import { useEffect, useState } from 'react'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')


  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  )
  const handleLogin = async () => {

    try {

      const response = await fetch(
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

      const token = await response.text()

      localStorage.setItem('token', token)
      setIsLoggedIn(true)

      fetchHabits()

      console.log('Logged in successfully')

    } catch (error) {

      console.error(error)
    }
  }

  const fetchHabits = async () => {

    try {

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:8080/api/habits',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      setHabits(data)

      console.log(data)

    } catch (error) {

      console.error(error)
    }
  }

  const addHabit = async () => {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        'http://localhost:8080/api/habits',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: newHabit,
          }),
        }
      )

      setNewHabit('')

      fetchHabits()

    } catch (error) {

      console.error(error)
    }
  }
  const completeHabit = async (habitId) => {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:8080/api/habits/${habitId}/complete`,
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      fetchHabits()

    } catch (error) {

      console.error(error)
    }
  }

  useEffect(() => {

    fetchHabits()

  }, [])

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">

      {!isLoggedIn ? (

        <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-sm shadow-2xl mx-4">

          <h1 className="text-4xl font-bold mb-2 text-center">
            TAAL
          </h1>

          <p className="text-zinc-400 text-center mb-8">
            Build consistency daily
          </p>

          <div className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-white"
            />

            <button
              onClick={handleLogin}
              className="bg-white text-black p-3 rounded-lg font-semibold hover:bg-zinc-300 transition"
            >
              Login
            </button>

          </div>

        </div>

      ) : (

        <div className="w-full max-w-md p-4">

          <h1 className="text-3xl font-bold mb-6">
            Habits
          </h1>

          <button
            onClick={() => {

              localStorage.removeItem('token')

              setIsLoggedIn(false)

              setHabits([])

            }}
            className="mb-6 bg-red-500 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

          <div className="flex gap-2 mb-6">

            <input
              type="text"
              placeholder="New Habit"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="flex-1 bg-zinc-800 p-3 rounded-lg outline-none"
            />

            <button
              onClick={addHabit}
              className="bg-white text-black px-4 rounded-lg font-semibold"
            >
              Add
            </button>

          </div>


          <div className="flex flex-col gap-3">

            {habits.map((habit) => (


              <div
                key={habit.id}
                className="bg-zinc-900 p-4 rounded-xl flex items-center justify-between"
              >

                <span className="font-medium">
                  {habit.name}
                </span>

                <button
                  onClick={() => completeHabit(habit.id)}
                  className="bg-green-500 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Complete
                </button>

              </div>





            ))}

          </div>

        </div>

      )}

    </div>
  )
}

export default App