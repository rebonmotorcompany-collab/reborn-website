import { SignupForm } from '../components/SignupForm';

export const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
      <div className="text-center mb-8 absolute top-8 left-8">
        <h1 className="text-4xl font-bold text-white">EV Showroom</h1>
        <p className="text-green-100">Distribution ERP System</p>
      </div>
      <SignupForm />
    </div>
  );
};
