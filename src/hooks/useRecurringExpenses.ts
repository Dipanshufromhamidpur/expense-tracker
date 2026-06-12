import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { RecurringExpense, RecurringExpenseInput } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';

export function useRecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setRecurringExpenses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'recurringExpenses'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: RecurringExpense[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as RecurringExpense);
      });
      // Sort by start date down
      data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      
      setRecurringExpenses(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recurringExpenses');
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const addRecurringExpense = async (expense: RecurringExpenseInput) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      const data = {
        ...expense,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as Record<string, any>;

      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });

      await addDoc(collection(db, 'recurringExpenses'), data);
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'recurringExpenses');
    }
  };

  const updateRecurringExpense = async (id: string, expense: Partial<RecurringExpense>) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      const docRef = doc(db, 'recurringExpenses', id);
      const data = {
        ...expense,
        updatedAt: serverTimestamp(),
      } as Record<string, any>;

      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });

      await updateDoc(docRef, data);
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `recurringExpenses/${id}`);
    }
  };

  const deleteRecurringExpense = async (id: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      await deleteDoc(doc(db, 'recurringExpenses', id));
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `recurringExpenses/${id}`);
    }
  };

  return { recurringExpenses, loading, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense };
}
