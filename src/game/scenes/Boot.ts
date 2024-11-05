import { Scene } from 'phaser';

export class Boot extends Scene {
    background: Phaser.GameObjects.TileSprite;

    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('background', 'assets/utah.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0, 0);

        this.scale.on('resize', this.resizeBackground, this);
        this.scene.start('Preloader');
    }

    resizeBackground = (gameSize: Phaser.Structs.Size) => {
        const { width, height } = gameSize;
        this.cameras.resize(width, height);
        this.background.setSize(width, height);
    }

    update() {
        this.background.tilePositionX += 1;
    }
}
