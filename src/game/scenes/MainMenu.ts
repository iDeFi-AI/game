import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    mainTitle: GameObjects.Text;
    startText: GameObjects.Text;
    character: GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

    constructor() {
        super('MainMenu');
    }

    preload() {
        // Preload the background and character sprite sheets
        this.load.image('background', '/assets/utah.png');
        this.load.spritesheet('idle', '/assets/idle.png', {
            frameWidth: 56,
            frameHeight: 56
        });
        this.load.spritesheet('running', '/assets/running.png', {
            frameWidth: 56,
            frameHeight: 56
        });
    }

    create() {
        // Add the background image and scale it to fit the viewport
        this.background = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDepth(-1);

        this.scaleBackground();

        // Adjust background size and position on resize
        this.scale.on('resize', () => this.scaleBackground());

        // Main title: iDEFi.AI
        this.mainTitle = this.add.text(this.scale.width / 2, this.scale.height * 0.3, 'iDEFi.AI', {
            fontFamily: 'PressStart2P',
            fontSize: '6vw',
            color: '#FF9F66',
            stroke: '#ffffff',
            strokeThickness: 8,
            align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(100);

        // Subtitle: Press Start
        this.startText = this.add.text(this.scale.width / 2, this.scale.height * 0.6, 'Press Start', {
            fontFamily: 'Arial Black',
            fontSize: '2.5vw',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(100);

        // Add idle animation
        this.anims.create({
            key: 'idleAnim',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Add running animation
        this.anims.create({
            key: 'runningAnim',
            frames: this.anims.generateFrameNumbers('running', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Add the character sprite and play the idle animation
        this.character = this.add.sprite(this.scale.width / 2, this.scale.height * 0.75, 'idle')
            .setOrigin(0.5, -0.63)
            .setScale(2)
            .setDepth(101)
            .play('idleAnim');

        // Capture keyboard input for arrow keys
        this.cursors = this.input?.keyboard?.createCursorKeys() || null;

        // Listen for scene transition event
        EventBus.on('transitionToDesert', () => {
            this.transitionToScene('DesertScene', 'leaving Salt Lake City, UT...');
        });

        // Emit scene-ready event
        EventBus.emit('current-scene-ready', this);
    }

    update() {
        // Check if cursors are defined to avoid null errors
        if (!this.cursors) return;

        // Check for arrow key presses and move the character accordingly
        if (this.cursors.left?.isDown) {
            this.character.setFlipX(true); // Flip the sprite to face left
            this.character.x -= 3; // Move left
            this.character.play('runningAnim', true); // Play running animation
        } else if (this.cursors.right?.isDown) {
            this.character.setFlipX(false); // Face right
            this.character.x += 3; // Move right
            this.character.play('runningAnim', true);

            // Transition to DesertScene when reaching the right edge
            if (this.character.x >= this.scale.width - this.character.width) {
                EventBus.emit('transitionToDesert');
            }
        } else {
            this.character.play('idleAnim', true); // If no key is pressed, play idle animation
        }
    }

    scaleBackground() {
        // Set background dimensions to fit the viewport exactly
        const { width, height } = this.scale;
        this.background.setDisplaySize(width, height);
    }

    transitionToScene(nextScene: string, message: string) {
        // Display the transition message
        const transitionText = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(200);

        // Animate the message to fade out, then start the next scene
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
