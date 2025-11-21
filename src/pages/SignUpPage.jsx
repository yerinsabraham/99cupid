import AuthLayout from '../components/layout/AuthLayout';
import SignUpForm from '../components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Join 99cupid"
      subtitle="Start your journey to real connections"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
