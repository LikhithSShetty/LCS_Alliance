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
            
            <Alert className="mt-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Demo Credentials</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Student Account:</strong>
                    <div>Email: student@example.com</div>
                    <div>Password: password</div>
                  </div>
                  <div>
                    <strong>Admin Account:</strong>
                    <div>Email: admin@example.com</div>
                    <div>Password: password</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;
