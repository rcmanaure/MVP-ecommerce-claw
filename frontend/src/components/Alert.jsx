import './Alert.css';

/**
 * Alert component
 * @param {'error' | 'success' | 'info'} props.type - Alert type
 * @param {string} props.message - Alert message
 * @param {boolean} props.visible - Visibility state
 */
function Alert({ type = 'error', message, visible }) {
  if (!visible || !message) return null;

  const icons = {
    error: '⚠️',
    success: '✓',
    info: 'ℹ️',
  };

  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">{icons[type]}</span>
      <span className="alert-message">{message}</span>
    </div>
  );
}

export default Alert;