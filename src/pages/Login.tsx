import React, { useEffect } from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { LoginForm } from '@/components/Auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <PageLayout>
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-sm text-muted-foreground">
              <div>Student: <code>student@demo.com</code> / <code>student</code></div>
              <div>Admin: <code>admin@demo.com</code> / <code>admin</code></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
