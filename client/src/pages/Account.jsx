import { useState } from "react";
import Screen from "../components/Screen"

function Account() {
  return (
    <Screen>
      <LoginSignupForm/>
    </Screen>
  )
}

export default Account


function LoginSignupForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    if (isSignup && !formData.name.trim()) return 'Name is required';
    if (!formData.email.includes('@')) return 'Invalid email';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setError('');

    if (isSignup) {
      const resp = await fetch('http://localhost:3000/user', {
        method:'POST',
        headers : {
          'content-type' : 'application/json'
        },
        body : JSON.stringify(formData),
        credentials : 'include'
      })
      const data = await resp.json();
      console.log(data)
      //console.log('Sign up with', formData);
    } else {
      console.log('Login with', formData);
    }
  };

  return (
    <div className="flex md:justify-start  items-center h-full">
      <div className="w-[400px] mt-10 p-6 bg-black/60 shadow-3xl shadow-cyan-700 rounded-xl border">
        <h2 className="text-2xl font-bold mb-6 text-center">{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-cyan-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-cyan-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-md transition duration-200"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline ml-1"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

