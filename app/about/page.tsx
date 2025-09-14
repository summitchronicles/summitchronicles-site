export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Summit Chronicles</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Journey</h2>
          <p className="text-gray-600 mb-4">
            Summit Chronicles documents the path toward climbing Mount Everest, 
            sharing insights from training, preparation, and the mental journey of pursuing 
            one of the world's most challenging adventures.
          </p>
          <p className="text-gray-600">
            This platform combines personal experience with practical advice for 
            aspiring mountaineers and adventure enthusiasts.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
          <div className="bg-orange-50 p-6 rounded-lg">
            <p className="text-orange-800 font-medium">🚧 Site Rebuilding in Progress</p>
            <p className="text-orange-600 text-sm mt-2">
              We're currently rebuilding the site with a streamlined approach. 
              Features are being added back incrementally to ensure stability and performance.
            </p>
            <div className="mt-4">
              <h3 className="font-medium text-orange-800 mb-2">Progress:</h3>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>✓ Basic site structure and navigation</li>
                <li>✓ Tailwind CSS styling system</li>
                <li>✓ Static page generation</li>
                <li>🚧 Blog system (coming next)</li>
                <li>🚧 Training tracking features</li>
                <li>🚧 API integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}