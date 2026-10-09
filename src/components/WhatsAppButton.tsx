import { MessageCircle } from 'lucide-react';
import { useSettings } from '../lib/SettingsContext';

export function WhatsAppButton() {
  const { settings } = useSettings();
  
  // Use user-provided whatsapp number, defaulting to standard if not provided
  const waNumber = settings?.whatsapp || '2348000000000';
  const waMessage = encodeURIComponent("Hello Asantex Decor, I would like to make an inquiry about your services.");

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${waMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>
    </a>
  );
}
