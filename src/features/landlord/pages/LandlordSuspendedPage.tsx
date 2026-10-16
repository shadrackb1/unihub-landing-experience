import { 
  Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, Users, Building2, AlertTriangle
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const LandlordSuspendedPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Account Temporarily Suspended
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Your landlord account has been temporarily suspended pending review.
          </p>
          
          <div className="space-y-4 text-left pl-5">
            <p className="font-medium text-gray-700">Possible reasons:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Multiple verified complaints from students</li>
              <li>Providing false or misleading property information</li>
              <li>Failure to respond to student inquiries in a timely manner</li>
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <p className="text-sm text-gray-500">
              To appeal this suspension or get specific details, please contact us via WhatsApp: {' '}
              <a 
                href="https://wa.me/254700000000?text=Hi%20UniHub%2C%20my%20landlord%20account%20was%20suspended%20and%20I%27d%20like%20to%20understand%20the%20reason%20and%20appeal%20if%20possible"
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