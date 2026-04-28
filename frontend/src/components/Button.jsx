import './Button.css';

/**
 * Button component
 * @param {Object} props
 * @param {'primary' | 'secondary'} props.variant - Button style
 * @param {'submit' | 'button'} props.type - Button type
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${loading ? 'btn-loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      <span className={loading ? 'btn-text-loading' : ''}>{children}</span>
    </button>
  );
}

export default Button;