'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon, FilmIcon } from '@heroicons/react/24/outline';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: number; title: string; media_type: string; poster_path: string | null}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const browseMenuRef = useRef<HTMLDivElement>(null);

  // Search functionality
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (browseMenuRef.current && !browseMenuRef.current.contains(event.target as Node)) {
        setIsBrowseOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      setShowSearchResults(false);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/tv' },
    { name: 'Trending', href: '/trending' },
    { name: 'Contact Us', href: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/90 backdrop-blur-md py-2' : 'bg-gray-900/90 backdrop-blur-md py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button - Moved to the left */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* Logo - Centered on mobile, left on desktop */}
          <div className="flex-shrink-0 md:mr-10">
            <Link href="/" className="text-2xl font-bold text-white">
              <img src="/123movies_icon.png" alt="Moviesflix" className='h-10 w-65' />
          
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${isActive ? 'text-red-500' : 'text-gray-300 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4 md:mx-6 relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm transition-all duration-200"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-gray-900 rounded-lg shadow-lg border border-gray-700 max-h-96 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      href={`/${item.media_type === 'movie' ? 'movie' : 'tv'}/${item.id}`}
                      className="flex items-center p-3 hover:bg-gray-800 transition-colors"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex-shrink-0 w-12 h-16 bg-gray-800 rounded overflow-hidden">
                        {item.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <FilmIcon className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{item.title}</div>
                        <div className="text-xs text-gray-400 capitalize">
                          {item.media_type}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-md transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          top: '4rem', // Height of the navbar
          height: 'calc(100vh - 4rem)',
          zIndex: 40
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {/* Main Navigation Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {isActive && (
                    <span className="ml-auto">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </Link>
              );
            })}
          
          
          </div>
          
          {/* Close Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <XMarkIcon className="h-5 w-5" />
              <span>Close Menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
