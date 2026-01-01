import React, { useContext } from 'react';
import { User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.full_name || 'User'}</h2>
            <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <Button onClick={logout} variant="danger">
          <LogOut className="w-5 h-5" /> Logout
        </Button>
      </Card>
    </div>
  );
};