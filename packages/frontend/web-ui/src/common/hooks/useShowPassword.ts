import { useState } from 'react';

export const useShowPassword = (initial: boolean) => {
  const [showPassword, setShowPassword] = useState<boolean>(initial);

  const handleClickShowPassword = () => {
    setShowPassword((show: boolean) => !show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  return {
    handleClickShowPassword,
    handleMouseDownPassword,
    showPassword,
  };
};
