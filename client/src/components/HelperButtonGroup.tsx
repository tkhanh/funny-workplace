import CloseIcon from '@mui/icons-material/Close'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../hooks'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { setRoomNotification } from '../stores/RoomStore'

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;

  .wrapper-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`

const Wrapper = styled.div`
  position: relative;
  font-size: 16px;
  color: #eee;
  background: #222639;
  box-shadow: 0px 0px 5px #0000006f;
  border-radius: 16px;
  padding: 15px 35px 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  .tip {
    margin-left: 12px;
  }
`

const FormWrapper = styled.form`
  position: relative;
  font-size: 16px;
  color: #eee;
  background: #222639;
  box-shadow: 0px 0px 5px #0000006f;
  border-radius: 16px;
  padding: 15px 35px 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  .tip {
    margin-left: 12px;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`

const Title = styled.h3`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const NotificationBox = styled.div`
  margin: 0 20px;
  max-width: 460px;
  max-height: 150px;
  overflow-wrap: anywhere;
  overflow-y: auto;
  font-size: 16px;
  color: #c2c2c2;
  display: flex;
  justify-content: center;
`

const StyledFab = styled(Fab)<{ target?: string }>`
  &:hover {
    color: #1ea2df;
  }
`

export default function HelperButtonGroup() {
  const [showNotification, setShowNotification] = useState(false)
  const isAnnouncer = useAppSelector((state) => state.user.isAnnouncer)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const roomNotification = useAppSelector((state) => state.room.roomNotification)
  const dispatch = useAppDispatch()

  const handleRoomNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRoomNotification(event.target.value))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Add new notification:', roomNotification)
    const game = phaserGame.scene.keys.game as Game
    game.network.addNotificationMessage(roomNotification)
  }

  return (
    <Backdrop>
      <div className="wrapper-group">
        {showNotification && (
          <FormWrapper onSubmit={handleSubmit}>
            <Title>Announcement</Title>
            <IconButton className="close" onClick={() => setShowNotification(false)} size="small">
              <CloseIcon />
            </IconButton>
            {isAnnouncer ? (
              <div>
                <TextField
                  autoFocus
                  label="Announcement"
                  variant="filled"
                  multiline
                  minRows={4}
                  size="small"
                  fullWidth
                  onChange={handleRoomNotificationChange}
                />
                <Button variant="contained" color="secondary" size="large" type="submit">
                  Send
                </Button>
              </div>
            ) : (
              <NotificationBox>Announcement: {roomNotification}</NotificationBox>
            )}
          </FormWrapper>
        )}
      </div>
      <ButtonGroup>
        {roomJoined && isAnnouncer && (
          <>
            <Tooltip title="Room Announcement">
              <StyledFab
                size="small"
                onClick={() => {
                  setShowNotification(!showNotification)
                }}
              >
                <NotificationsIcon />
              </StyledFab>
            </Tooltip>
          </>
        )}
      </ButtonGroup>
    </Backdrop>
  )
}
