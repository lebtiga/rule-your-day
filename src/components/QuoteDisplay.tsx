import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

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
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  }
];

export function QuoteDisplay() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Change quote every 24 hours or on page refresh
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Quote className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold">Daily Inspiration</h2>
      </div>
      <blockquote className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2">
        <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-2">
          "{quote.text}"
        </p>
        <footer className="text-sm text-gray-600 dark:text-gray-400">
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  );
}