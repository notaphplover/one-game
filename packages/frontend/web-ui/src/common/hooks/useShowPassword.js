import { useState } from 'react';

export const useShowPassword = (initial) => {
  const [showPassword, setShowPassword] = useState(initial);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
  };
};
