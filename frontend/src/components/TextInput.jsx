import { forwardRef, useState } from 'react';
import './TextInput.css';

/**
 * TextInput component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, email, password)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message to display
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.iconLeft - Show input icon
 * @param {string} props.icon - Icon emoji
 */
const TextInput = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  iconLeft,
  icon,
  ...props
}, ref) => {
  const [valid, setValid] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    // Simple validation for demo
    if (type === 'email' && value) {
      setValid(value.includes('@'));
    } else if (type === 'password' && value) {
      setValid(value.length >= 8);
    }
  };

  return (
    <div className="text-input-wrapper">
      {label && (
        <label className="text-input-label">
          {label}
        </label>
      )}

      <div className={`text-input-container ${error ? 'has-error' : ''} ${valid && touched ? 'is-valid' : ''}`}>
        {iconLeft && icon && (
          <span className="text-input-icon">{icon}</span>
        )}

        <input
          ref={ref}
          type={type}
          className={`text-input ${error ? 'text-input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          {...props}
        />

        {valid && touched && !error && (
          <span className="text-input-checkmark">✓</span>
        )}
      </div>

      {error && (
        <span className="text-input-error-message">{error}</span>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;