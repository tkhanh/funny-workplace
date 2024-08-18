import Phaser from 'phaser'
import { PlayerBehavior } from '../../../types/PlayerBehavior'
/**
 * shifting distance for sitting animation
 * format: direction: [xShift, yShift, depthShift]
 */
export const sittingShiftData = {
  up: [0, 3, -10],
  down: [0, 3, 1],
  left: [0, -8, 10],
  right: [0, -8, 10],
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  playerId: string
  playerTexture: string
  playerBehavior = PlayerBehavior.IDLE
  readyToConnect = false
  videoConnected = false
  playerName: Phaser.GameObjects.Text
  playerContainer: Phaser.GameObjects.Container
  private playerDialogBubble: Phaser.GameObjects.Container
  private timeoutID?: number
  isAnnouncer = false
  private notificationQueue: string[] = [] // Queue to hold notifications
  private isNotificationActive = false // Flag to track if a notification is currently active
  private notificationBubble: Phaser.GameObjects.Container

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    this.playerId = id
    this.playerTexture = texture
    this.setDepth(this.y)

    this.anims.play(`${this.playerTexture}_idle_down`, true)

    this.playerContainer = this.scene.add.container(this.x, this.y - 30).setDepth(5000)

    // add dialogBubble to playerContainer
    this.playerDialogBubble = this.scene.add.container(0, 0).setDepth(5000)
    this.playerContainer.add(this.playerDialogBubble)

    this.notificationBubble = this.scene.add.container(0, 0).setDepth(5000)
    this.playerContainer.add(this.notificationBubble)

    // add playerName to playerContainer
    this.playerName = this.scene.add
      .text(0, 0, '')
      .setFontFamily('Arial')
      .setFontSize(12)
      .setColor('#000000')
      .setOrigin(0.5)
    this.playerContainer.add(this.playerName)

    this.scene.physics.world.enable(this.playerContainer)
    const playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
    const collisionScale = [0.5, 0.2]
    playContainerBody
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(-8, this.height * (1 - collisionScale[1]) + 6)
  }

  updateDialogBubble(content: string) {
    this.clearDialogBubble()

    // preprocessing for dialog bubble text (maximum 70 characters)
    const dialogBubbleText = content.length <= 70 ? content : content.substring(0, 70).concat('...')

    const innerText = this.scene.add
      .text(0, 0, dialogBubbleText, { wordWrap: { width: 165, useAdvancedWrap: true } })
      .setFontFamily('Arial')
      .setFontSize(12)
      .setColor('#000000')
      .setOrigin(0.5)

    // set dialogBox slightly larger than the text in it
    const innerTextHeight = innerText.height
    const innerTextWidth = innerText.width

    innerText.setY(-innerTextHeight / 2 - this.playerName.height / 2)
    const dialogBoxWidth = innerTextWidth + 10
    const dialogBoxHeight = innerTextHeight + 3
    const dialogBoxX = innerText.x - innerTextWidth / 2 - 5
    const dialogBoxY = innerText.y - innerTextHeight / 2 - 2

    this.playerDialogBubble.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
        .lineStyle(1, 0x000000, 1)
        .strokeRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
    )
    this.playerDialogBubble.add(innerText)

    // After 6 seconds, clear the dialog bubble
    this.timeoutID = window.setTimeout(() => {
      this.clearDialogBubble()
    }, 6000)
  }

  addNotificationBubble(content: string) {
    // Add the new notification to the queue
    this.notificationQueue.push(content)

    // Process the queue if no notification is currently active
    if (!this.isNotificationActive) {
      this.processNotificationQueue()
    }
  }

  private processNotificationQueue() {
    console.log('processNotificationQueue')
    if (this.notificationQueue.length === 0) {
      return // No notifications to process
    }

    // Get the next notification from the queue
    const content = this.notificationQueue.shift()!

    this.isNotificationActive = true // Set the flag to indicate a notification is active

    // Create the notification text
    const notificationBubbleText =
      content.length <= 500 ? content : content.substring(0, 70).concat('...')

    const innerText = this.scene.add
      .text(0, 0, notificationBubbleText, {
        wordWrap: { width: 500, useAdvancedWrap: true },
        maxLines: 3,
      })
      .setFontFamily('Arial')
      .setFontSize(15)
      .setColor('#ffffff')
      .setOrigin(0.5)
      .setPadding(10)

    // Set notificationBox slightly larger than the text in it
    const innerTextHeight = innerText.height
    const innerTextWidth = innerText.width

    innerText.setX(this.scene.cameras.main.width / 2.25)
    innerText.setY(
      -innerTextHeight / 4 - this.playerName.height / 2 - this.scene.cameras.main.height / 4
    )

    const notificationBoxWidth = innerTextWidth + 10
    const notificationBoxHeight = innerTextHeight + 3
    const notificationBoxX = innerText.x - innerTextWidth / 2 - 2
    const notificationBoxY = innerText.y - innerTextHeight / 2 - 2

    console.log(notificationBoxX)
    const notificationBox = this.scene.add
      .graphics()
      .fillStyle(0x000000, 0.7)
      .fillRoundedRect(
        notificationBoxX,
        notificationBoxY,
        notificationBoxWidth,
        notificationBoxHeight,
        3
      )
      .lineStyle(1, 0x000000, 1)
      .strokeRoundedRect(
        notificationBoxX,
        notificationBoxY,
        notificationBoxWidth,
        notificationBoxHeight,
        3
      )

    // Initialize the notification bubble container
    this.notificationBubble = this.scene.add.container(0, 0)
    this.notificationBubble.add(notificationBox)
    this.notificationBubble.add(innerText)

    // Add the notification bubble to the player's container or scene
    this.playerContainer.add(this.notificationBubble)

    // Animate the notification to move from right to left
    this.scene.tweens.add({
      targets: this.notificationBubble,
      x: this.playerContainer.x - this.scene.cameras.main.width - innerTextWidth * 1.25, // Move off the screen
      ease: 'Linear',
      duration: 15000, // Adjust duration as needed
      onComplete: () => {
        // Clear the notification bubble and reset the flag
        if (this.notificationBubble) {
          this.notificationBubble.destroy()
        }
        this.isNotificationActive = false // Reset the flag
        // Continue processing any remaining notifications
        this.processNotificationQueue()
      },
    })
  }

  private clearDialogBubble() {
    clearTimeout(this.timeoutID)
    this.playerDialogBubble.removeAll(true)
  }
}
