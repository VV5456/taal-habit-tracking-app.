import { useEffect, useState } from 'react'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [habitToDelete, setHabitToDelete] = useState(null)


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

  const deleteHabit = async (habitId) => {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:8080/api/habits/${habitId}`,
        {
          method: 'DELETE',

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
                className="bg-zinc-900 p-5 rounded-2xl"
              >

                <div className="flex items-center justify-between mb-5">

                  <h2 className="font-semibold text-xl">
                    {habit.name}
                  </h2>

                  <div className="flex items-center gap-2">

                    {habit.completedToday ? (

                      <button
                        onClick={() => completeHabit(habit.id)}
                        className="border-2 border-green-500 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition"
                      >
                        ✓
                      </button>

                    ) : (

                      <button
                        onClick={() => completeHabit(habit.id)}
                        className="border-2 border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm font-semibold hover:border-green-400 hover:text-green-400 transition"
                      >
                        ✓
                      </button>

                    )}

                    <button
                      onClick={() => setHabitToDelete(habit)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-zinc-800 text-zinc-500 hover:border-red-500 hover:text-red-500 transition"
                    >
                      ×
                    </button>

                    {habitToDelete && (

                      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                        <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm mx-4">

                          <h2 className="text-2xl font-bold mb-3">
                            Delete Habit?
                          </h2>

                          <p className="text-zinc-400 mb-6">
                            This will permanently remove all streak history and completion data.
                          </p>

                          <div className="flex justify-end gap-3">

                            <button
                              onClick={() => setHabitToDelete(null)}
                              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={async () => {

                                await deleteHabit(habitToDelete.id)

                                setHabitToDelete(null)

                              }}
                              className="px-4 py-2 rounded-xl bg-red-500 text-white"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

                <div className="grid grid-rows-7 grid-flow-col auto-cols-max gap-y-[3px] gap-x-[3px] overflow-x-auto">

                  {[...Array(175)].map((_, index) => {

                    const date = new Date()

                    date.setDate(date.getDate() - (174 - index))

                    const formattedDate =
                      date.toISOString().split('T')[0]

                    const completed =
                      habit.completedDates.includes(formattedDate)

                    return (

                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${completed
                          ? 'bg-green-400'
                          : 'bg-[#112418]'
                          }`}
                      />

                    )

                  })}

                </div>



              </div>





            ))}

          </div>

        </div>

      )}

    </div>
  )
}

export default App