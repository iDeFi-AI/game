import { Scene, GameObjects, Physics } from 'phaser';
import { EventBus } from '../EventBus';

export class BeachScene extends Scene {
    player: Physics.Arcade.Sprite | undefined;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    background: GameObjects.Image | undefined;

    constructor() {
        super('BeachScene');
    }

    preload() {
        console.log('BeachScene: preload');
        this.load.image('beachBackground', 'assets/beach.png');
        this.load.spritesheet('idle', '/assets/idle.png', { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('running', '/assets/running.png', { frameWidth: 56, frameHeight: 56 });
    }

    create() {
        console.log('BeachScene: create');

        // Set up the background to fill the viewport
        this.background = this.add.image(0, 0, 'beachBackground')
            .setOrigin(0)
            .setDepth(-1);
        this.scaleBackground();

        // Dynamically adjust background size on window resize
        this.scale.on('resize', () => this.scaleBackground());

        // Create animations for idle and running states
        this.anims.create({
            key: 'idleAnim',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'runningAnim',
            frames: this.anims.generateFrameNumbers('running', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Initialize the player sprite and set its position to align with the bottom of the screen
        const playerStartY = this.scale.height - 100; // Adjust this offset as needed
        this.player = this.physics.add.sprite(this.scale.width / 2, playerStartY, 'idle')
            .setOrigin(0.5, -0.75) // Align the bottom-center of the character
            .setScale(2)
            .setDepth(101)
            .setCollideWorldBounds(true);

        // Start with the idle animation
        this.player.play('idleAnim');

        // Capture keyboard input for arrow keys
        this.cursors = this.input.keyboard?.createCursorKeys() || null;

        // Emit scene-ready event
        EventBus.emit('current-scene-ready', this);

        // Event listener for transition to another scene
        EventBus.on('transitionToAnotherScene', () => {
            this.transitionToScene('NextScene', 'Leaving Beach Scene...');
        });
    }

    update() {
        if (!this.player || !this.cursors) return;

        // Handle player movement and animation
        if (this.cursors.right?.isDown) {
            this.player.setFlipX(false);
            this.player.x += 5;
            this.player.play('runningAnim', true);

            // Check if player has reached the right boundary to transition scenes
            if (this.player.x >= this.scale.width - this.player.width) {
                EventBus.emit('transitionToAnotherScene');
            }
        } else if (this.cursors.left?.isDown) {
            this.player.setFlipX(true);
            this.player.x -= 5;
            this.player.play('runningAnim', true);
        } else {
            this.player.play('idleAnim', true); // Play idle animation when not moving
        }
    }

    scaleBackground() {
        // Scale background to fill the viewport
        if (this.background) {
            const { width, height } = this.scale;
            this.background.setDisplaySize(width, height);
        }
    }

    transitionToScene(nextScene: string, message: string) {
        // Display transition message
        const transitionText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5).setDepth(200);

        // Fade out the message and transition to the next scene
        this.tweens.add({
            targets: transitionText,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            onComplete: () => {
                this.scene.start(nextScene);
            }
        });
    }
}
