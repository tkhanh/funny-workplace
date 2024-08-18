import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'
import { NotificationMessage } from '../schema/OfficeState'

type Payload = {
  client: Client
  content: string
}

export default class NotificationMessageUpdateCommand extends Command<IOfficeState, Payload> {
  execute(data: Payload) {
    const { client, content } = data
    const player = this.room.state.players.get(client.sessionId)
    const notificationMessages = this.room.state.notificationMessages
    if (!notificationMessages) return
    console.log('ehe')

    /**
     * Only allow server to store a maximum of 100 chat messages:
     * remove the first element before pushing a new one when array length is >= 100
     */
    if (notificationMessages.length >= 100) notificationMessages.shift()

    const newMessage = new NotificationMessage()
    newMessage.author = player.name
    newMessage.content = content
    notificationMessages.push(newMessage)
  }
}
