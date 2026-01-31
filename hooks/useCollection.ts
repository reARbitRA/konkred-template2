
import { useState, useEffect } from 'react';
import { db } from '../services/firebase.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export const useCollection = <T extends { id: string }>(collectionName: string) => {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);
    const collectionPath = `users/${user.id}/${collectionName}`;
    const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: T[] = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(results);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Could not fetch data from enclave.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, user]);

  const add = async (newData: Omit<T, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    const collectionPath = `users/${user.id}/${collectionName}`;
    await addDoc(collection(db, collectionPath), {
      ...newData,
      createdAt: serverTimestamp(),
    });
  };

  return { data, loading, error, add };
};