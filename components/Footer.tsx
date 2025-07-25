'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Movies', href: '/movies' },
        { name: 'TV Shows', href: '/tv' },
        { name: 'Trending', href: '/trending' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'DMCA', href: '/dmca' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    
  ];

  const socialLinks = [
    { icon: <FaFacebook className="h-5 w-5" />, href: 'https://facebook.com' },
    { icon: <FaTwitter className="h-5 w-5" />, href: 'https://twitter.com' },
    { icon: <FaInstagram className="h-5 w-5" />, href: 'https://instagram.com' },
    { icon: <FaYoutube className="h-5 w-5" />, href: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 lg:col-span-2">
            <img src="/123movies_icon.png" alt="Moviesflix" className='h-10 w-65' />
            <p className="mb-4">
              Watch the latest movies and TV shows online for free. Stream high-quality content on any device, anytime, anywhere.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label={`Visit our ${social.href.split('//')[1]}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-semibold mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              &copy; {currentYear} 123Moviesflix. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <p className="text-sm">
                <span className="text-red-600 font-semibold">Disclaimer:</span> We do not host any files on our server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
