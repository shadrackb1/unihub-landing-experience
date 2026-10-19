// @ts-nocheck
import { 
  Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, Users, Building2, AlertTriangle
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { waLink, formatWhatsAppNumber } from '@/shared/contact';

export const LandlordRejectedPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Application Not Approved
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Our review team has determined that your application doesn't meet 
            our current requirements for verified landlords.
          </p>
          
          <div className="space-y-4 text-left pl-5">
            <p className="font-medium text-gray-700">Common reasons:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Incomplete or unclear identification documents</li>
              <li>Business verification couldn't be completed</li>
              <li>Property details need clarification</li>
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <p className="text-sm text-gray-500">
              To reapply or get specific feedback, please contact us via WhatsApp: {' '}
              <a 
                href={waLink("Hi UniHub, I received a rejection notice for my landlord application and would like specific feedback")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {formatWhatsAppNumber()}
              </a>
            </p>
          </div>
          
          <Link 
            to="/register/landlord" 
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium mt-4"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};