import { useState } from 'react'

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  required = true,
  minLength,
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <span className="auth-password-wrap">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
        />
        <button
          className="password-visibility"
          type="button"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </span>
    </label>
  )
}

export default PasswordField
