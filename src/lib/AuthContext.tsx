import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminRole: string;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  adminRole: '',
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  refreshAdminStatus: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [loading, setLoading] = useState(true);

  const checkUserAdminStatus = async (currentUser: User): Promise<{ isAdmin: boolean; role: string }> => {
    const userEmail = currentUser.email?.toLowerCase().trim() || '';

    // Master Super Admin check
    if (userEmail === 'samuelzagwa40@gmail.com') {
      try {
        // Ensure master admin doc exists in Firestore
        await setDoc(doc(db, 'admins', userEmail), {
          email: userEmail,
          name: currentUser.displayName || 'Samuel Zagwa',
          role: 'Owner & Super Administrator',
          status: 'Active',
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
        
        await setDoc(doc(db, 'admins', currentUser.uid), {
          email: userEmail,
          name: currentUser.displayName || 'Samuel Zagwa',
          role: 'Owner & Super Administrator',
          status: 'Active',
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not sync master admin record to Firestore', e);
      }
      return { isAdmin: true, role: 'Owner & Super Administrator' };
    }

    try {
      // 1. Check by UID document
      const uidDoc = await getDoc(doc(db, 'admins', currentUser.uid));
      if (uidDoc.exists()) {
        const data = uidDoc.data();
        return { isAdmin: true, role: data.role || 'Administrator' };
      }

      // 2. Check by Email document (when an admin was invited/added by email)
      if (userEmail) {
        const emailDoc = await getDoc(doc(db, 'admins', userEmail));
        if (emailDoc.exists()) {
          const data = emailDoc.data();
          const role = data.role || 'Administrator';
          
          // Link UID for faster subsequent queries and security rule consistency
          try {
            await setDoc(doc(db, 'admins', currentUser.uid), {
              email: userEmail,
              name: currentUser.displayName || data.name || '',
              role,
              status: 'Active',
              linkedFromEmailDoc: userEmail,
              lastLoginAt: new Date().toISOString()
            }, { merge: true });
          } catch (syncErr) {
            console.warn('Could not auto-link admin UID', syncErr);
          }

          return { isAdmin: true, role };
        }
      }

      return { isAdmin: false, role: '' };
    } catch (e) {
      console.error('Error checking admin status', e);
      return { isAdmin: false, role: '' };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const { isAdmin: verifiedAdmin, role } = await checkUserAdminStatus(currentUser);
        setIsAdmin(verifiedAdmin);
        setAdminRole(role);
      } else {
        setIsAdmin(false);
        setAdminRole('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshAdminStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    const res = await checkUserAdminStatus(auth.currentUser);
    setIsAdmin(res.isAdmin);
    setAdminRole(res.role);
    return res.isAdmin;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, adminRole, loading, signInWithGoogle, logout, refreshAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

