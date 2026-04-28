import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Alert from '../components/Alert';
import SocialButtons from '../components/SocialButtons';
import { register } from '../services/auth';
import './Auth.css';

/**
 * Registration Page
 * Route: /register
 */
function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
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

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const result = await register(email, password);
      console.log('Registration successful:', result.user);
      // Redirect to login on success
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <div className="auth-logo-icon">🚀</div>
      </div>

      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Join us and start shopping</p>

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

        <TextInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon="🔒"
          iconLeft
          disabled={loading}
        />

        <div className="auth-options" style={{ marginBottom: '1.5rem' }}>
          <Checkbox
            id="agreeTerms"
            label="I agree to the terms and conditions"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
        </div>

        <Button type="submit" variant="primary" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <SocialButtons />

      <p className="auth-footer">
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default Register;
