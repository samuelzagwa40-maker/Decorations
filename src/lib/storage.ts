import { QuoteRequest, ContactMessage } from '../types';

// Utility for managing local storage persistence for the admin dashboard mock
const QUOTES_KEY = 'asantex_quotes';
const CONTACTS_KEY = 'asantex_contacts';

export const storage = {
  getQuotes: (): QuoteRequest[] => {
    const data = localStorage.getItem(QUOTES_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveQuote: (quote: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => {
    const quotes = storage.getQuotes();
    const newQuote: QuoteRequest = {
      ...quote,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(QUOTES_KEY, JSON.stringify([newQuote, ...quotes]));
    return newQuote;
  },
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => {
    const quotes = storage.getQuotes();
    const updated = quotes.map(q => q.id === id ? { ...q, status } : q);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
  },
  
  getContacts: (): ContactMessage[] => {
    const data = localStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveContact: (contact: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => {
    const contacts = storage.getContacts();
    const newContact: ContactMessage = {
      ...contact,
      id: crypto.randomUUID(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(CONTACTS_KEY, JSON.stringify([newContact, ...contacts]));
    return newContact;
  },
  updateContactStatus: (id: string, status: ContactMessage['status']) => {
    const contacts = storage.getContacts();
    const updated = contacts.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
  }
};
