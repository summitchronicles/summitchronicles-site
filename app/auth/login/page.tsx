import React from 'react';
import { Header } from '../../components/organisms/Header';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      <Header />

      <main className="flex-1 pt-16 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-spa-soft p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-light text-spa-charcoal mb-6 text-center">
            Admin Login
          </h1>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-spa-charcoal mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-spa-stone/20 rounded-lg focus:ring-2 focus:ring-alpine-blue focus:border-transparent"
                placeholder="admin@summitchronicles.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-spa-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-spa-stone/20 rounded-lg focus:ring-2 focus:ring-alpine-blue focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-alpine-blue text-white py-2 px-4 rounded-lg hover:bg-alpine-blue/90 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-spa-charcoal/60">
            For development: The admin editor exists at <code>/admin/editor</code>
          </div>
        </div>
      </main>
    </div>
  );
}