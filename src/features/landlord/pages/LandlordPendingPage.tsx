import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, Users, Building2, Clock
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const LandlordPendingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Application Under Review
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Our team is reviewing your application to ensure quality and safety 
            for students. This usually takes 24 hours.
          </p>
          
          <div className="space-y-4 text-left pl-5">
            <p className="font-medium text-gray-700">What happens next:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>We verify your identification documents</li>
              <li>We check your business credentials (if provided)</li>
              <li>We may contact you via WhatsApp for clarification</li>
              <li>Once approved, you'll get full access to list properties</li>
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <p className="text-sm text-gray-500">
              Need help? Message us on WhatsApp: {' '}
              <a 
                href="https://wa.me/254700000000?text=Hi%20UniHub%2C%20I%27d%20like%20help%20with%20my%20landlord%20application"
                className="text-indigo-600 hover:text-indigo-500"
              >
                +254 700 000 000
              </a>
            </p>
          </div>
          
          <Link 
            to="/" 
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-4"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};