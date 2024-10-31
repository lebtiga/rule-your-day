import React, { useState, useEffect } from 'react';
import { Twitter, Facebook, Coffee, Quote } from 'lucide-react';

const quotes = [
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    text: "Time management is life management.",
    author: "Robin Sharma"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  }
];

export function Footer() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <footer className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Quote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="italic">"{quote.text}"</span>
            <span>—</span>
            <span className="font-medium">{quote.author}</span>
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Fueled by human creativity and AI magic by{' '}
            <a
              href="https://x.com/RobRizk2020"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Rabih Rizk
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/RobRizk2020"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com/rabihrizk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <a
            href="https://buymeacoffee.com/robk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Coffee className="w-4 h-4" />
            <span>Buy me a coffee</span>
          </a>
        </div>
      </div>
    </footer>
  );
}