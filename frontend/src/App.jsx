import { useEffect, useState } from 'react'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [habitToDelete, setHabitToDelete] = useState(null)
  const [editingHabitId, setEditingHabitId] = useState(null)
  const [editedHabitName, setEditedHabitName] = useState('')
  const [openMenuHabitId, setOpenMenuHabitId] = useState(null)
  const [showAddHabitModal, setShowAddHabitModal] = useState(false)

  const [selectedIcon, setSelectedIcon] = useState("📚")
  const icons = [
    "📚",
    "💪",
    "🏃",
    "💧",
    "🧘",
    "🎸",
    "🛌",
    "🧠",
    "📖",
    "🚀",
    "🎯",
    "🔥"
  ]


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
            icon: selectedIcon,
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

  const updateHabit = async (habitId) => {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:8080/api/habits/${habitId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: editedHabitName,
          }),
        }
      )



      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId
            ? { ...habit, name: editedHabitName }
            : habit
        )
      )

      setEditingHabitId(null)

      setEditedHabitName('')

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

          <div className="flex items-center justify-between mb-8">

            <h1 className="text-3xl font-bold">
              Habits
            </h1>

            <button
              onClick={() => setShowAddHabitModal(true)}
              className="border-2 bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 opacity-80 transition "
            >
              +
            </button>

          </div>

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




          <div className="flex flex-col gap-3">

            {habits.map((habit) => (


              <div
                key={habit.id}
                className="bg-zinc-900 p-5 rounded-2xl"
              >

                <div className="flex items-center justify-between mb-5">

                  {editingHabitId === habit.id ? (

                    <input
                      type="text"
                      value={editedHabitName}
                      onChange={(e) => setEditedHabitName(e.target.value)}
                      onBlur={() => updateHabit(habit.id)}
                      onKeyDown={(e) => {

                        if (e.key === 'Enter') {
                          updateHabit(habit.id)
                        }

                      }}
                      className="bg-transparent outline-none text-xl font-semibold"
                      autoFocus
                    />

                  ) : (

                    <div className="flex items-center gap-2">

                      <div className="text-1xl">
                        {habit.icon || "📚"}
                      </div>

                      <h2
                        onDoubleClick={() => {

                          setEditingHabitId(habit.id)

                          setEditedHabitName(habit.name)

                        }}
                        className="font-semibold text-xl cursor-pointer"
                      >
                        {habit.name}
                      </h2>

                    </div>

                  )}



                  <div className="flex items-center gap-2 relative">

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
                        className="border-2 border-zinc-600 text-zinc-300 px-4 py-2 rounded-xl text-sm font-semibold hover:border-green-400 hover:text-green-400 transition"
                      >
                        ✓
                      </button>

                    )}

                    <button
                      onClick={() => {

                        setOpenMenuHabitId(
                          openMenuHabitId === habit.id
                            ? null
                            : habit.id
                        )

                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition"
                    >
                      ⋯
                    </button>

                    {openMenuHabitId === habit.id && (

                      <div className="absolute top-12 right-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50 min-w-[140px]">

                        <button
                          onClick={() => {

                            setEditingHabitId(habit.id)

                            setEditedHabitName(habit.name)

                            setOpenMenuHabitId(null)

                          }}
                          className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            console.log("delete clicked")

                            setHabitToDelete(habit)

                            setOpenMenuHabitId(null)

                          }}
                          className="w-full text-left px-4 py-3 text-red-400 hover:bg-zinc-800 transition"
                        >
                          Delete
                        </button>

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
          {showAddHabitModal && (

            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md mx-4">

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-2xl font-bold">
                    New Habit
                  </h2>

                  <button
                    onClick={() => setShowAddHabitModal(false)}
                    className="text-zinc-500 hover:text-white transition"
                  >
                    ✕
                  </button>

                </div>

                <input
                  type="text"
                  placeholder="Habit name"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  className="w-full bg-zinc-800 p-4 rounded-2xl outline-none mb-6 text-lg"
                />

                <div className="grid grid-cols-4 gap-3 mb-6">

                  {icons.map((icon) => (

                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`h-16 rounded-2xl text-3xl flex items-center justify-center transition ${selectedIcon === icon
                        ? 'bg-white text-black scale-105'
                        : 'bg-zinc-800 hover:bg-zinc-700'
                        }`}
                    >
                      {icon}
                    </button>

                  ))}

                </div>

                <button
                  onClick={async () => {

                    await addHabit()

                    setShowAddHabitModal(false)

                    setSelectedIcon("📚")

                  }}
                  className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:scale-[1.02] transition"
                >
                  Create Habit
                </button>

              </div>

            </div>

          )}

          {habitToDelete && (

            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

              <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm mx-4 border border-zinc-800">

                <h2 className="text-2xl font-bold mb-3">
                  Delete Habit?
                </h2>

                <p className="text-zinc-400 mb-6">
                  This will permanently remove all streak history and completion data.
                </p>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() => setHabitToDelete(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {

                      await deleteHabit(habitToDelete.id)

                      setHabitToDelete(null)

                    }}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:opacity-90 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>


      )}

    </div>
  )
}

export default App