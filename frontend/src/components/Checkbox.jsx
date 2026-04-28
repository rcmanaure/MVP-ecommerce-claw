import './Checkbox.css';

/**
 * Checkbox component
 * @param {Object} props
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Label text
 * @param {string} props.id - Input ID
 */
function Checkbox({
  checked,
  onChange,
  label,
  id,
  ...props
}) {
  return (
    <label className="checkbox-wrapper" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
        {...props}
      />
      <span className="checkbox-custom" />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

export default Checkbox;