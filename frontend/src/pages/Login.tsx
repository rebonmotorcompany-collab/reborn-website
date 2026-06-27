import { LoginForm } from '../components/LoginForm';

export const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="text-center mb-8 absolute top-8 left-8">
        <h1 className="text-4xl font-bold text-white">EV Showroom</h1>
        <p className="text-blue-100">Distribution ERP System</p>
      </div>
      <LoginForm />
    </div>
  );
};
