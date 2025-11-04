
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    const errorClasses = error 
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
        : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500';

    return (
        <div>
            <label htmlFor={props.name} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                {...props}
                id={props.name}
                className={`block w-full px-3 py-2 bg-white border rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition duration-150 ease-in-out ${errorClasses}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${props.name}-error` : undefined}
            />
            {error && <p id={`${props.name}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;
