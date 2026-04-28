import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { forgotPassword } from '../services/auth';
import './Auth.css';

/**
 * Forgot Password Page
 * Route: /forgot-password
 */
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">📧</div>
        </div>
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-subtitle">
          If an account exists with that email, we've sent a link to reset your password.
        </p>
        <p className="auth-footer">
          Remember your password?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <div className="auth-logo-icon">🔑</div>
      </div>

      <h1 className="auth-title">Forgot password?</h1>
      <p className="auth-subtitle">
        Enter your email and we'll send you a link to reset your password.
      </p>

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

        <Button type="submit" variant="primary" loading={loading}>
          Send Reset Link
        </Button>
      </form>

      <p className="auth-footer">
        Remember your password?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;