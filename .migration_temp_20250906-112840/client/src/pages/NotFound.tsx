import { Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist in our workforce development ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Hub
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Visit our <Link href="/connect" className="text-blue-600 hover:text-blue-700">Connect</Link> community for support.</p>
        </div>
      </div>
    </div>
  );
}