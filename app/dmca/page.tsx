import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'DMCA - 123Moviesflix',
  description: 'Digital Millennium Copyright Act (DMCA) Compliance Notice',
};

export default function DMCAPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-gray-900/50 rounded-lg p-6 md:p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">DMCA Copyright Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="mb-6">
            123Moviesflix is in compliance with 17 U.S.C. § 512 and the Digital Millennium Copyright Act ("DMCA"). 
            It is our policy to respond to any infringement notices and take appropriate actions under the 
            Digital Millennium Copyright Act ("DMCA") and other applicable intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Copyright Infringement Notification</h2>
          <p className="mb-4">
            If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement 
            and is accessible on this site, you may notify our copyright agent, as set forth in the Digital Millennium 
            Copyright Act of 1998 (DMCA). For your complaint to be valid under the DMCA, you must provide the following 
            information when providing notice of the claimed copyright infringement:
          </p>
          
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of the infringing activity and that is to be removed</li>
            <li>Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address</li>
            <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Counter-Notification</h2>
          <p className="mb-4">
            If you believe that your content that was removed (or to which access was disabled) is not infringing, 
            or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant 
            to the law, to post and use the material in your content, you may send a counter-notice containing 
            the following information to our Copyright Agent:
          </p>
          
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Your physical or electronic signature</li>
            <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled</li>
            <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content</li>
            <li>Your name, address, telephone number, and e-mail address, and a statement that you consent to the jurisdiction of the federal court in [Your Jurisdiction] and a statement that you will accept service of process from the person who provided notification of the alleged infringement</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <p className="mb-6">
            If you have any questions or inquiries regarding this DMCA policy, please contact our designated 
            Copyright Agent at:
          </p>
          
          <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
            <p className="font-medium">Copyright Agent</p>
            <p>123Moviesflix</p>
            <p>Email: <a href="mailto:dmca@123moviesflix.com" className="text-red-400 hover:underline">dmca@123moviesflix.com</a></p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              <strong>Note:</strong> This information is provided for the purpose of notifying 123Moviesflix that 
              your copyrighted material may have been infringed. All other inquiries, such as requests for technical 
              assistance, reports of email abuse, and piracy reports, will not receive a response through this process.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
