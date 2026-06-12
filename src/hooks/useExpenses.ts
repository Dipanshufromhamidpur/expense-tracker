import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Expense, ExpenseInput } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData: Expense[] = [];
      snapshot.forEach((doc) => {
        expensesData.push({ id: doc.id, ...doc.data() } as Expense);
      });
      // Sort in memory to avoid requiring a composite index in Firestore
      expensesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setExpenses(expensesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'expenses');
      setLoading(false);
      setError(error.message);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const addExpense = async (expense: ExpenseInput) => {
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

      await addDoc(collection(db, 'expenses'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  const updateExpense = async (id: string, expense: Partial<ExpenseInput>) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    try {
      const docRef = doc(db, 'expenses', id);
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
       handleFirestoreError(error, OperationType.UPDATE, `expenses/${id}`);
    }
  };

  const deleteExpense = async (id: string) => {
     if (!auth.currentUser) throw new Error("Not authenticated");
     try {
       await deleteDoc(doc(db, 'expenses', id));
     } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `expenses/${id}`);
     }
  };

  return { expenses, loading, error, addExpense, updateExpense, deleteExpense };
}
