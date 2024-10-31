import React from 'react';
import { Twitter, Facebook, Coffee, Wrench } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
             Powered by human creativity and AI magic from{' '}
              <a 
                href="https://x.com/RobRizk2020" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Rabih Rizk
              </a>
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Wrench className="w-4 h-4" />
                <span>My Tools</span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                <a href="https://mappacktoolbox.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  MapPackToolbox.com
                </a>
                <a href="https://blogstorm.ai" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  BlogStorm.ai
                </a>
                <a href="https://emailsneak.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Emailsneak.com
                </a>
                <span className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                  ...and more
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/RobRizk2020"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/rabihrizk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://buymeacoffee.com/robk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-gray-900 rounded-lg hover:bg-[#FFDD00]/90 transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span className="font-medium">Buy me a coffee</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}