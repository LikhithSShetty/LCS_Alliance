import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const DebugAuth = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing API connection...');
      const response = await fetch(`${API_BASE_URL}/api`, {
        method: 'GET',
      });
      const data = await response.json();
      setResult({ type: 'info', message: 'API Connection Test', data });
    } catch (error: any) {
      setResult({ type: 'error', message: 'Connection Failed', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔐 Testing login...');
      console.log('📍 URL:', `${API_BASE_URL}/api/auth/login`);
      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Status:', response.status);
      const data = await response.json();
      console.log('📦 Data:', data);

      if (response.ok) {
        setResult({ type: 'success', message: 'Login Successful', data });
      } else {
        setResult({ type: 'error', message: 'Login Failed', data });
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setResult({ type: 'error', message: 'Request Failed', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Debug Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm font-mono">API Base URL: {API_BASE_URL}</p>
            <p className="text-sm font-mono">Full Login URL: {API_BASE_URL}/api/auth/login</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={loading}>
              Test Connection
            </Button>
            <Button onClick={testLogin} disabled={loading}>
              Test Login
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded ${
                result.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : result.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <h3 className="font-bold mb-2">{result.message}</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
            <h4 className="font-bold mb-2">📝 Test Credentials</h4>
            <p className="text-sm">Admin: admin@test.com / admin123</p>
            <p className="text-sm">Student: student@test.com / student123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
