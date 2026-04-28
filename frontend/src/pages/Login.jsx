import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Alert from '../components/Alert';
import SocialButtons from '../components/SocialButtons';
import { login } from '../services/auth';
import './Auth.css';

/**
 * Login Page
 * Route: /login
 */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      triggerShake();
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login successful:', result.user);
      // Redirect to dashboard/home on success
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  return (
    <div className={`auth-card ${shake ? 'shake' : ''}`}>
      <div className="auth-logo">
        <div className="auth-logo-icon">🚀</div>
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your account</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Alert type="error" message={error} visible={!!error} />

        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="📧"
          iconLeft
          disabled={loading}
        />

        <TextInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="🔒"
          iconLeft
          disabled={loading}
        />

        <div className="auth-options">
          <Checkbox
            id="rememberMe"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link to="/forgot-password" className="forgot-link">
            Forgot?
          </Link>
        </div>

        <Button type="submit" variant="primary" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <SocialButtons />

      <p className="auth-footer">
        Don't have an account?{' '}
        <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default Login;