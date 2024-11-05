import { GameObjects, Scene, Physics } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    mainTitle: GameObjects.Text;
    startText: GameObjects.Text;
    character: Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    spacebar: Phaser.Input.Keyboard.Key | undefined;

    constructor() {
        super('MainMenu');
    }

    preload() {
        // Preload the background and character sprite sheets
        this.load.image('background', '/assets/utah.png');
        this.load.spritesheet('idle', '/assets/idle.png', { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('running', '/assets/running.png', { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('jumping', '/assets/jumping.png', { frameWidth: 56, frameHeight: 56 });
    }

    create() {
        // Add the background image and scale it to fit the viewport
        this.background = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDepth(-1);
        this.scaleBackground();

        // Adjust background size on resize
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

        // Add animations
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

        this.anims.create({
            key: 'jumpingAnim',
            frames: this.anims.generateFrameNumbers('jumping', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Add the character sprite with physics, gravity, and animations
        const playerStartY = this.scale.height - 100;
        this.character = this.physics.add.sprite(this.scale.width / 2, playerStartY, 'idle')
            .setOrigin(0.5, -0.67)
            .setScale(2)
            .setDepth(101)
            .setCollideWorldBounds(true)
            .play('idleAnim');

        // Ensure `character.body` is treated as `Arcade.Body`
        (this.character.body as Physics.Arcade.Body).setGravityY(500);

        // Capture keyboard input for arrow keys and spacebar
        this.cursors = this.input.keyboard?.createCursorKeys() || null;
        this.spacebar = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Scene transition event
        EventBus.on('transitionToDesert', () => {
            this.transitionToScene('DesertScene', 'leaving Salt Lake City, UT...');
        });

        // Emit scene-ready event
        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (!this.character || !this.cursors) return;

        // Ensure `character.body` is of type `Arcade.Body`
        const characterBody = this.character.body as Physics.Arcade.Body;

        // Player movement
        if (this.cursors.left?.isDown) {
            this.character.setFlipX(true);
            this.character.x -= 3;
            if (characterBody.blocked.down) {
                this.character.play('runningAnim', true); // Only play running animation if on the ground
            }
        } else if (this.cursors.right?.isDown) {
            this.character.setFlipX(false);
            this.character.x += 3;
            if (characterBody.blocked.down) {
                this.character.play('runningAnim', true);
            }
            // Transition to DesertScene when reaching the right edge
            if (this.character.x >= this.scale.width - this.character.width) {
                EventBus.emit('transitionToDesert');
            }
        } else if (characterBody.blocked.down) {
            this.character.play('idleAnim', true);
        }

        // Handle jumping with spacebar
        if (this.spacebar?.isDown && characterBody.blocked.down) {
            this.character.setVelocityY(-170); // Adjust jump height as needed
            this.character.play('jumpingAnim', true);
        }
    }

    scaleBackground() {
        const { width, height } = this.scale;
        this.background.setDisplaySize(width, height);
    }

    transitionToScene(nextScene: string, message: string) {
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
