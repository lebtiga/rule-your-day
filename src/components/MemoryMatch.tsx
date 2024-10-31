import React, { useState, useEffect } from 'react';
import { Brain, Timer, RotateCcw, Trophy, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const icons = [
  'circle', 'square', 'triangle', 'heart',
  'star', 'diamond', 'moon', 'sun',
  'cloud', 'flower', 'leaf', 'drop',
];

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memoryMatchBestScore');
    return saved ? parseInt(saved) : Infinity;
  });

  // Initialize or reset game
  const initializeGame = () => {
    const shuffledIcons = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledIcons);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (
      flippedCards.length === 2 || // Don't allow more than 2 cards flipped
      flippedCards.includes(id) || // Don't allow same card to be flipped
      cards[id].isMatched // Don't allow matched cards to be flipped
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (cards[firstId].icon === cards[secondId].icon) {
        // Match found
        setCards(cards.map(card =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        setMatches(m => m + 1);
        setFlippedCards([]);

        if (matches + 1 === icons.length) {
          handleGameComplete();
        }
      } else {
        // No match - reset after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameComplete = () => {
    setIsComplete(true);
    if (moves < bestScore) {
      setBestScore(moves);
      localStorage.setItem('memoryMatchBestScore', moves.toString());
    }
    
    // Celebration animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#818CF8', '#34D399', '#F472B6'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold">Memory Match</h2>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute left-0 w-64 p-2 mt-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                Take a mindful break with this memory game. Exercise your brain while reducing stress. Match all pairs with the fewest moves possible!
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Timer className="w-4 h-4" />
            <span>Moves: {moves}</span>
          </div>
          <button
            onClick={initializeGame}
            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg transition-all duration-300 transform ${
              card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                ? 'rotate-y-180 bg-indigo-100 dark:bg-indigo-900/30'
                : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700'
            } ${
              card.isMatched ? 'opacity-50' : ''
            }`}
            disabled={card.isMatched}
          >
            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
              card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                ? 'opacity-100'
                : 'opacity-0'
            }`}>
              <span className="text-2xl">{getIconForCard(card.icon)}</span>
            </div>
          </button>
        ))}
      </div>

      {bestScore < Infinity && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Best: {bestScore} moves</span>
        </div>
      )}

      {isComplete && (
        <div className="mt-4 text-center">
          <div className="text-lg font-medium text-green-500 dark:text-green-400">
            Congratulations! 🎉
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            You completed the game in {moves} moves
            {moves === bestScore && ' - New Best Score!'}
          </div>
        </div>
      )}
    </div>
  );
}

function getIconForCard(icon: string): string {
  const emojiMap: Record<string, string> = {
    circle: '⭕',
    square: '⬜',
    triangle: '🔺',
    heart: '❤️',
    star: '⭐',
    diamond: '💠',
    moon: '🌙',
    sun: '☀️',
    cloud: '☁️',
    flower: '🌸',
    leaf: '🍃',
    drop: '💧',
  };
  return emojiMap[icon] || '❓';
}