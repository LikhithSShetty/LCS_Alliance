
import React, { useEffect } from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <PageLayout className="flex justify-center items-center bg-gray-50 py-12">
      <div className="w-full max-w-md px-4">
        <RegisterForm />
      </div>
    </PageLayout>
  );
};

export default Register;
