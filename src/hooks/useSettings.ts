import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { UserSettings } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setSettings(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'userSettings', auth.currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ userId: docSnap.id, ...docSnap.data() } as UserSettings);
      } else {
        setSettings(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'userSettings');
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const updateSettings = async (budget: number, defaultCurrency: string) => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'userSettings', auth.currentUser.uid);
    try {
      if (settings) {
        await updateDoc(docRef, {
          monthlyBudget: budget,
          defaultCurrency,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          userId: auth.currentUser.uid,
          monthlyBudget: budget,
          defaultCurrency,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
       handleFirestoreError(error, settings ? OperationType.UPDATE : OperationType.CREATE, `userSettings/${auth.currentUser.uid}`);
    }
  };

  return { settings, loading, updateSettings };
}
