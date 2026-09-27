import React, { useState, useEffect } from 'react';

interface NumericInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  fallback?: number;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  allowDecimal?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  fallback,
  className = '',
  placeholder,
  ariaLabel,
  allowDecimal = true
}) => {
  // Keep local string state to allow full clearing, typing trailing zeros, decimals
  const [localStr, setLocalStr] = useState<string>(() => (value !== undefined && !isNaN(value) ? String(value) : ''));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Synchronize when external value changes while not focused
  useEffect(() => {
    if (!isFocused) {
      setLocalStr(value !== undefined && !isNaN(value) ? String(value) : '');
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty string while typing
    if (raw === '') {
      setLocalStr('');
      return;
    }

    // Only allow valid numeric characters (digits and optional one dot)
    const regex = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
    if (!regex.test(raw)) return;

    setLocalStr(raw);

    // If it's a valid complete number, propagate up to parent
    const parsed = allowDecimal ? parseFloat(raw) : parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    let parsed = allowDecimal ? parseFloat(localStr) : parseInt(localStr, 10);

    if (isNaN(parsed) || localStr.trim() === '') {
      parsed = fallback !== undefined ? fallback : min;
    } else {
      if (min !== undefined && parsed < min) parsed = min;
      if (max !== undefined && parsed > max) parsed = max;
    }

    setLocalStr(String(parsed));
    onChange(parsed);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <input
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      value={localStr}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={className}
    />
  );
};
