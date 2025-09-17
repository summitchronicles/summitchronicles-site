'use client';

import { useState } from 'react';
import {
  Activity,
  Mail,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminPage() {
  const [stravaConnected, setStravaConnected] = useState(false);
  const [newsletterConnected, setNewsletterConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStravaConnect = async () => {
    if (stravaConnected) {
      // Handle disconnect - in real app, you'd revoke tokens
      setStravaConnected(false);
      return;
    }

    // Redirect to Strava OAuth
    window.location.href = '/api/strava/auth';
  };

  const handleNewsletterConnect = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNewsletterConnected(!newsletterConnected);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-peak py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Manage your personal integrations and data connections.
          </p>
        </div>

        {/* Integration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strava Integration */}
          <div className="mountain-card p-6 elevation-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stravaConnected ? 'bg-green-100' : 'bg-slate-100'
                  }`}
                >
                  <Activity
                    className={`w-5 h-5 ${
                      stravaConnected ? 'text-green-600' : 'text-slate-600'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Strava Integration
                  </h3>
                  <p className="text-sm text-slate-600">
                    Personal activity data
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {stravaConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stravaConnected ? 'text-green-600' : 'text-slate-500'
                  }`}
                >
                  {stravaConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Last sync</span>
                <span className="text-slate-900">
                  {stravaConnected ? '2 hours ago' : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Activities synced</span>
                <span className="text-slate-900">
                  {stravaConnected ? '156' : '0'}
                </span>
              </div>
            </div>

            <button
              onClick={handleStravaConnect}
              disabled={loading}
              className={`w-full btn-summit px-4 py-3 disabled:opacity-50 ${
                stravaConnected ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : stravaConnected ? (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Disconnect Strava</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Connect Strava</span>
                </>
              )}
            </button>
          </div>

          {/* Newsletter Integration */}
          <div className="mountain-card p-6 elevation-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    newsletterConnected ? 'bg-blue-100' : 'bg-slate-100'
                  }`}
                >
                  <Mail
                    className={`w-5 h-5 ${
                      newsletterConnected ? 'text-blue-600' : 'text-slate-600'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Newsletter (Buttondown)
                  </h3>
                  <p className="text-sm text-slate-600">
                    Email subscriber management
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {newsletterConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    newsletterConnected ? 'text-green-600' : 'text-slate-500'
                  }`}
                >
                  {newsletterConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subscribers</span>
                <span className="text-slate-900">
                  {newsletterConnected ? '1,247' : '0'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Last email sent</span>
                <span className="text-slate-900">
                  {newsletterConnected ? '5 days ago' : 'Never'}
                </span>
              </div>
            </div>

            <button
              onClick={handleNewsletterConnect}
              disabled={loading}
              className={`w-full btn-summit px-4 py-3 disabled:opacity-50 ${
                newsletterConnected ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : newsletterConnected ? (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Disconnect Buttondown</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Connect Buttondown</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* API Configuration */}
        <div className="mountain-card p-8 elevation-shadow mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            API Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Strava Client ID
              </label>
              <input
                type="text"
                placeholder="Your Strava app client ID"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Strava Client Secret
              </label>
              <input
                type="password"
                placeholder="Your Strava app client secret"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Buttondown API Key
              </label>
              <input
                type="password"
                placeholder="Your Buttondown API key"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button className="btn-summit px-6 py-3">
              <Settings className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mountain-card p-8 elevation-shadow">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Setup Instructions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Strava Setup</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>
                  Go to{' '}
                  <a
                    href="https://www.strava.com/settings/api"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Strava API Settings
                  </a>
                </li>
                <li>Create a new API application with your site details</li>
                <li>
                  Copy the Client ID and Client Secret to the fields above
                </li>
                <li>
                  Set your authorization callback URL to:{' '}
                  <code className="bg-slate-100 px-2 py-1 rounded">
                    your-domain.com/api/strava/callback
                  </code>
                </li>
                <li>
                  Click "Connect Strava" to authenticate your personal account
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-3">
                Buttondown Setup
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>
                  Sign up for a{' '}
                  <a
                    href="https://buttondown.email"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buttondown account
                  </a>
                </li>
                <li>Go to Settings → API and copy your API key</li>
                <li>Paste the API key in the field above</li>
                <li>
                  Click "Connect Buttondown" to enable newsletter functionality
                </li>
                <li>Your newsletter signup forms will now work on the site</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
