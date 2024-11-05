import { GameObjects, Scene, Physics } from 'phaser';
import { EventBus } from '../EventBus';

export class BeachScene extends Scene {
    background: GameObjects.Image | undefined;
    player: Physics.Arcade.Sprite | undefined;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

    constructor() {
        super('BeachScene');
    }

    preload() {
        this.load.image('beachBackground', '/assets/beach.png');
        this.load.spritesheet('idle', '/assets/idle.png', { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('running', '/assets/running.png', { frameWidth: 56, frameHeight: 56 });
    }

    create() {
        // Set up the background
        this.background = this.add.image(0, 0, 'beachBackground')
            .setOrigin(0)
            .setDepth(-1);
        this.scaleBackground();

        // Adjust background on window resize
        this.scale.on('resize', () => this.scaleBackground());

        // Animations
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

        // Initialize the player sprite
        const playerStartY = this.scale.height - 100;
        this.player = this.physics.add.sprite(this.scale.width / 2, playerStartY, 'idle')
            .setOrigin(0.5, -0.67)
            .setScale(2)
            .setDepth(101)
            .setCollideWorldBounds(true)
            .play('idleAnim');

        // Capture keyboard input for arrow keys
        this.cursors = this.input.keyboard?.createCursorKeys() || null;

        // Event listener for transitioning back to MainMenu
        EventBus.on('transitionToMain', () => {
            this.transitionToScene('MainMenu', 'Returning to Salt Lake City, UT...');
        });
    }

    update() {
        if (!this.player || !this.cursors) return;

        // Handle player movement
        if (this.cursors.right?.isDown) {
            this.player.setFlipX(false);
            this.player.x += 5;
            this.player.play('runningAnim', true);

            // Check if player has reached the right boundary to transition back to MainMenu
            if (this.player.x >= this.scale.width - this.player.width) {
                EventBus.emit('transitionToMain');
            }
        } else if (this.cursors.left?.isDown) {
            this.player.setFlipX(true);
            this.player.x -= 5;
            this.player.play('runningAnim', true);
        } else {
            this.player.play('idleAnim', true); // Idle animation when not moving
        }
    }

    scaleBackground() {
        const { width, height } = this.scale;
        if (this.background) {
            this.background.setDisplaySize(width, height);
        }
    }

    transitionToScene(nextScene: string, message: string) {
        const transitionText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5).setDepth(200);

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
