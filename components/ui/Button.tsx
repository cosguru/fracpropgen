
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, isLoading, icon, ...props }) => {
    const isDisabled = isLoading || props.disabled;

    return (
        <button
            {...props}
            disabled={isDisabled}
            className={`
                flex justify-center items-center px-5 py-3 border border-transparent 
                text-base font-medium rounded-lg shadow-sm text-white 
                bg-brandGreen-600 hover:bg-brandGreen-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-500
                disabled:bg-slate-400 disabled:cursor-not-allowed
                transition-all duration-200
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <Spinner />
                    <span>Generating...</span>
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;