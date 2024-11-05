import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export class CityScene extends Phaser.Scene {
    player: Phaser.Physics.Arcade.Sprite | undefined;
    rightKey: Phaser.Input.Keyboard.Key | undefined;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    constructor() {
        super({ key: 'CityScene' });
    }

    preload() {
        console.log('CityScene: preload');
        // Load background and player assets
        this.load.image('cityBackground', 'assets/city.png');
        this.load.image('player', 'assets/player.png');
    }

    create() {
        console.log('CityScene: create');
        
        // Set up the camera and background
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x028af8); // Optional: Customize background color

        this.background = this.add.image(0, 0, 'cityBackground').setOrigin(0).setScrollFactor(1);

        // Initialize the player sprite
        this.player = this.physics.add.sprite(100, 400, 'player');
        this.player.setCollideWorldBounds(true);

        // Set up keyboard input for player movement
        if (this.input.keyboard) {
            this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        }

        // Set the camera to follow the player
        this.camera.startFollow(this.player);

        // Emit the current scene as ready
        EventBus.emit('current-scene-ready', this);

        // Emit transition event when player reaches the right boundary
        this.physics.world.on('worldbounds', () => {
            console.log('Transitioning to DesertScene');
            EventBus.emit('transitionToDesert');
        });
    }

    update() {
        // Move the player to the right if the rightKey is down
        if (this.rightKey?.isDown && this.player) {
            this.player.x += 5;

            // Check if the player has reached the end of the scene (boundary transition)
            if (this.player.x >= this.scale.width - this.player.width) {
                console.log('CityScene boundary reached - transition to DesertScene');
                EventBus.emit('transitionToDesert');
            }
        }
    }
}
