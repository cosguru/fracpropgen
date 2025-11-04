
import React, { useState, useEffect } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface LeadCaptureFormProps {
    onSubmit: (name: string, email: string) => Promise<boolean>;
    onSuccessComplete: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

// Simple regex for email validation
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit, onSuccessComplete }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'success') {
            timer = setTimeout(() => {
                onSuccessComplete();
            }, 1500); // Wait 1.5 seconds on the success message before downloading/closing
        }
        return () => clearTimeout(timer);
    }, [status, onSuccessComplete]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        
        setStatus('loading');
        
        const success = await onSubmit(name, email);

        if (success) {
            setStatus('success');
        } else {
            setError('Could not save contact. Please try again.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-4">
                <SuccessIcon />
                <h3 className="text-lg font-semibold text-slate-800 mt-2">Thank You!</h3>
                <p className="text-sm text-slate-600">Your download will begin shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
                Enter your name and email to download the proposal as a Word document.
            </p>
            <Input
                label="Name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
                required
                aria-required="true"
                disabled={status === 'loading'}
            />
            <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., jane.doe@example.com"
                required
                aria-required="true"
                disabled={status === 'loading'}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={status === 'loading'} 
                    icon={status !== 'loading' ? <DownloadIcon /> : undefined} 
                    className="w-full"
                >
                   {status === 'loading' ? (
                       <>
                        <Spinner />
                        <span>Processing...</span>
                       </>
                   ) : (
                    'Download Now'
                   )}
                </Button>
                 <p className="text-xs text-slate-500 text-center mt-3">
                    We hate spam. By downloading this proposal, you agree to opt in to our marketing emails for the latest updates. Unsubscribe anytime.
                </p>
            </div>
        </form>
    );
};

export default LeadCaptureForm;