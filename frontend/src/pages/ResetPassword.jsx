import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { resetPassword } from '../services/auth';
import './Auth.css';

/**
 * Reset Password Page
 * Route: /reset-password?token=xxx
 */
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password, confirmPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✅</div>
        </div>
        <h1 className="auth-title">Password reset!</h1>
        <p className="auth-subtitle">
          Your password has been successfully reset.
        </p>
        <p className="auth-footer">
          <Link to="/login">Sign in with your new password</Link>
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚠️</div>
        </div>
        <h1 className="auth-title">Invalid link</h1>
        <p className="auth-subtitle">
          This password reset link has expired or is invalid.
        </p>
        <p className="auth-footer">
          <Link to="/forgot-password">Request a new reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <div className="auth-logo-icon">🔒</div>
      </div>

      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">
        Enter your new password below.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Alert type="error" message={error} visible={!!error} />

        <TextInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="🔒"
          iconLeft
          disabled={loading}
        />

        <TextInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon="🔒"
          iconLeft
          disabled={loading}
        />

        <Button type="submit" variant="primary" loading={loading}>
          Reset Password
        </Button>
      </form>

      <p className="auth-footer">
        Remember your password?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default ResetPassword;