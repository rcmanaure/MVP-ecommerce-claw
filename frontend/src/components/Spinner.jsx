import './Spinner.css';

/**
 * Spinner component
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 */
function Spinner({ size = 'md' }) {
  return (
    <div className={`spinner spinner-${size}`} role="status" aria-label="Loading">
      <span className="spinner-visually-hidden">Loading...</span>
    </div>
  );
}

export default Spinner;