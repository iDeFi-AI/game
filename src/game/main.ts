import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Preloader } from './scenes/Preloader';
import { DesertScene } from './scenes/DesertScene';
import { BeachScene } from './scenes/BeachScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,  // Use a widescreen ratio for better scaling
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,  // Automatically resize the canvas
        autoCenter: Phaser.Scale.CENTER_BOTH,  // Center the game in the viewport
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [Boot, Preloader, MainMenu, Game, GameOver, DesertScene, BeachScene], // Add DesertScene here
};

const StartGame = (parent: string) => {
    config.parent = parent;
    return new Phaser.Game(config);
};

export default StartGame;
