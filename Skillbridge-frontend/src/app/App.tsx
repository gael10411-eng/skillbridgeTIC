import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

import api from '../services/api';

export default function App() {

  useEffect(() => {

    const testConnection = async () => {

      try {

        const response = await api.get('/test');

        console.log(response.data);

      } catch(error){

        console.log(error);

      }

    };

    testConnection();

  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}