import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
  onSuccess: () => void;
}

export function Login({ onBack, onRegister, onSuccess }: LoginProps) {
  const { login } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient' as UserRole
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Attempt login
    setTimeout(() => {
      const success = login(formData.email, formData.password, formData.role);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
      setIsLoading(false);
    }, 500);
  };

  const demoCredentials = [
    { role: 'Patient', email: 'jennifergambo@gmail.com', password: 'password123' },
    { role: 'Doctor', email: 'dr.mwangi@clinic.com', password: 'doctor123' },
    { role: 'MRO', email: 'mro.akinyi@clinic.com', password: 'mro123' },
    { role: 'Admin', email: 'admin@clinic.com', password: 'admin123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Sign In</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <Select
                label="User Type"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                options={[
                  { value: 'patient', label: 'Patient' },
                  { value: 'doctor', label: 'Doctor' },
                  { value: 'mro', label: 'Medical Record Officer' },
                  { value: 'admin', label: 'Administrator' }
                ]}
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button onClick={onRegister} className="text-blue-600 hover:underline font-medium">
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
          <div className="space-y-2 text-xs">
            {demoCredentials.map((cred, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                <span className="font-medium text-gray-700">{cred.role}:</span>
                <span className="text-gray-500">{cred.email} / {cred.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
