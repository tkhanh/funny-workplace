import React, { useState, FormEvent } from 'react'

import logo from '../../public/assets/logo.png' // Import the image

import phaserGame from '../PhaserGame'
import { Player } from '../types'

import './Login.scss'
import { useAppDispatch } from '../hooks'
import Game from '../scenes/Game'
import { setLoggedIn } from '../stores/UserStore'
import Bootstrap from '../scenes/Bootstrap'

const AVATARS = {
  male: 'ash',
  female: 'lucy',
}

const Login = () => {
  const dispatch = useAppDispatch()
  const [formState, setFormState] = useState<Player & { error?: string }>({
    name: '',
    gender: '',
    team: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { name, gender, team } = formState

    if (!name || !gender || !team) {
      setFormState((prevState) => ({
        ...prevState,
        error: 'All fields are required',
      }))

      return
    }

    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    bootstrap.network
      .joinOrCreatePublic()
      .then(() => {
        bootstrap.launchGame(formState)

        setTimeout(() => {
          const game = phaserGame.scene.keys.game as Game
          var isAnnouncer = false
          game.registerKeys()
          game.myPlayer.setPlayerName(name)
          game.myPlayer.setPlayerTexture(AVATARS[gender])
          if (formState.team == 'hr') {
            isAnnouncer = true
          }
          console.log('isAnnouncer:' + isAnnouncer)
          game.myPlayer.setPlayerIsAnnouncer(isAnnouncer)
          game.network.readyToConnect()
          dispatch(setLoggedIn(true))
        }, 500)
      })
      .catch((error) => console.error(error))
  }

  return (
    <div className="backdrop">
      <div className="join-form">
        <div className="join-header">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="join-title">Fun Workplace</h2>
        </div>
        {formState.error && <p className="error">{formState.error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={formState.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="gender">Gender:</label>
            <select id="gender" value={formState.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="team">Team:</label>
            <select id="team" value={formState.team} onChange={handleChange} required>
              <option value="">Select Team</option>
              <option value="hr">HR</option>
              <option value="quizrr">Quizrr</option>
              <option value="cnh">CNH</option>
              <option value="asml">ASML</option>
            </select>
          </div>
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  )
}

export default Login
