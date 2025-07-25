import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4 text-gray-300">
            By accessing or using our service, you agree to be bound by these Terms of Service and our Privacy Policy. 
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p className="mb-4 text-gray-300">
            You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
            <li>Use our service in any way that violates any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to any portion of our service</li>
            <li>Interfere with or disrupt the integrity or performance of our service</li>
            <li>Use any automated means to access our service without our permission</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
          <p className="text-gray-300">
            The service and its original content, features, and functionality are and will remain the exclusive property 
            of our company and its licensors. Our service is protected by copyright, trademark, and other laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about these Terms of Service, please contact us at terms@example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
