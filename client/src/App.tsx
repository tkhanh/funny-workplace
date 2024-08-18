import React from 'react'
import styled from 'styled-components'

import { useAppSelector } from './hooks'

import VideoConnectionDialog from './components/VideoConnectionDialog'
import Login from './components/Login'
import HelperButtonGroup from './components/HelperButtonGroup'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)

  return (
    <Backdrop>
      {loggedIn ? !videoConnected && <VideoConnectionDialog /> && <HelperButtonGroup /> : <Login />}
    </Backdrop>
  )
}

export default App
