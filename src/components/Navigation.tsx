'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navigation() {
  const [currentUser] = useState('1'); // Simulated current user

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ArtSocial</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Feed
            </Link>
            <Link 
              href="/create" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Create
            </Link>
            <Link 
              href={`/profile/${currentUser}`} 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* Mobile Navigation & Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/create">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                Create Post
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <span className="sr-only">Open menu</span>
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Feed
            </Link>
            <Link 
              href="/create" 
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Create
            </Link>
            <Link 
              href={`/profile/${currentUser}`} 
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}