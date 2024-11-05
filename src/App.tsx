import { useRef, useState, useEffect } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import Layout from './layout';

function App() {
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (phaserRef.current?.game) {
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    phaserRef.current.game.scale.resize(window.innerWidth, gameContainer.clientHeight);
                }
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
    };

    return (
        <Layout>
            <div className="game-container">
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </div>
        </Layout>
    );
}

export default App;
