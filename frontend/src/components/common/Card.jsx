import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white border border-[#EAECEF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-amber-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', actions }) => {
  return (
    <div className={`p-5 border-b border-[#EAECEF] flex items-center justify-between gap-4 ${className}`}>
      <div className="space-y-0.5">{children}</div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-base font-semibold text-[#172033] tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-xs text-[#64748B] ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-[#FFFDF7]/50 border-t border-[#EAECEF] rounded-b-xl flex items-center justify-between gap-3 text-xs text-[#64748B] ${className}`}>
      {children}
    </div>
  );
};

export default Card;

