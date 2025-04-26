import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { cn } from '@/lib/utils';

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setMessage('');
      return;
    }

    let score = 0;
    
    // Check password length
    if (password.length >= 8) score += 1;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) score += 1;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) score += 1;
    
    // Check for numbers
    if (/\d/.test(password)) score += 1;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength(score);

    // Set message based on score
    if (score === 0 || score === 1) {
      setMessage('Weak');
    } else if (score === 2 || score === 3) {
      setMessage('Medium');
    } else {
      setMessage('Strong');
    }
  }, [password]);

  // Get color based on strength
  const getColor = () => {
    if (strength === 0 || strength === 1) return 'bg-red-500';
    if (strength === 2 || strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-muted-foreground">{message}</div>
        <div className="text-xs text-muted-foreground">{strength}/5</div>
      </div>
      <div className="flex h-1 w-full space-x-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-full w-1/5 rounded-full transition-colors",
              i < strength ? getColor() : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const PasswordInput = React.forwardRef(({ className, onChange, showStrengthIndicator = false, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(props.value || '');

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10 hide-password-toggle', className)}
          ref={ref}
          {...props}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 "
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
        </Button>
      </div>
      {showStrengthIndicator && <PasswordStrengthIndicator password={value} />}
      
      {/* Hide browser's built-in password toggle */}
      <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput }; 