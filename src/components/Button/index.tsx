import React from 'react';

interface IButton {
  onClick: () => void;
}

const Button: React.FC<IButton> = ({ children, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
