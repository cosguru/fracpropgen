
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
                flex justify-center items-center px-6 py-3 border border-transparent 
                text-base font-medium rounded-full shadow-sm text-white 
                bg-gradient-to-r from-indigo-500 to-indigo-600 
                hover:from-indigo-600 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:bg-slate-400 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed
                transform transition-all duration-300 hover:scale-105
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