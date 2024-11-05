import React, { ReactNode, useState, useEffect } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [health, setHealth] = useState(5); // Representing health with 5 hearts
    const [mana, setMana] = useState(100);   // Mana as percentage

    useEffect(() => {
        // Example: gradually decrease health and mana to show dynamic change (for demo)
        const interval = setInterval(() => {
            setMana(prev => (prev > 0 ? prev - 1 : 100));
            setHealth(prev => (prev > 1 ? prev - 1 : 5));
        }, 2000); // Adjust the interval speed as needed

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    const renderHealth = () => {
        const hearts = [];
        for (let i = 0; i < 5; i++) {
            hearts.push(
                <img
                    key={i}
                    src={i < health ? '/assets/filled.png' : '/assets/unfilled.png'}
                    alt="heart"
                    className="w-5 h-5 mx-1"
                />
            );
        }
        return hearts;
    };

    return (
        <div id="app" className="flex flex-col h-screen w-screen overflow-hidden bg-black">
            <header className="bg-black text-white text-center py-2 sm:py-3 md:py-4 flex flex-col items-center">
                <h1 className="text-lg md:text-xl">Welcome Explorer to</h1>
                <div className="flex mt-2">
                    {renderHealth()} {/* Display hearts as health bar */}
                </div>
            </header>

            <main id="game-container" className="flex-grow relative bg-black overflow-hidden">
                {children}
            </main>

            <footer className="bg-black text-white text-center py-2 sm:py-3 md:py-4 flex flex-col items-center">
                <p className="text-sm md:text-base">&copy; 2024 iDEFi.AI - All rights reserved.</p>
                <div className="relative w-full bg-gray-700 h-6 rounded-md overflow-hidden mt-2">
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${mana}%` }}
                    ></div>
                    <p className="absolute top-0 left-0 w-full h-full text-center text-xs text-white font-bold leading-6">
                        Mana: {mana}%
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
