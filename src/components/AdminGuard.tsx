
// components/AdminGuard.tsx
import { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';

type MeResponse = {
  success: boolean;
  data: {
    name: string;
    role: string;
  };
};

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data, ok } = await apiCall<MeResponse>('/auth/me');
      if (!ok || !data.success || data.data.role !== 'admin') {
        navigate('/auth', { replace: true });
        return;
      }
      setAllowed(true);
    };

    check();
  }, [navigate]);

  if (!allowed) return null; // ⬅️ TIDAK RENDER APA-APA
  return children;
}
