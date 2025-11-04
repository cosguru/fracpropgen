import React, { useState, useEffect } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface LeadCaptureFormProps {
    onSubmit: (name: string, email: string) => Promise<boolean>;
    onSuccessComplete: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brandGreen-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

            <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                <h4 className="font-semibold text-slate-700 mb-2">What's Inside: 90-Day Plan</h4>
                <ul className="space-y-1 text-slate-600">
                    <li><strong>Month 1: Discovery &amp; Planning</strong> &ndash; We'll align on goals, audit current efforts, and build the strategic roadmap.</li>
                    <li><strong>Month 2: Execution &amp; Implementation</strong> &ndash; We'll launch key initiatives and establish a rhythm of progress.</li>
                    <li><strong>Month 3: Optimization &amp; Reporting</strong> &ndash; We'll analyze data, refine our approach, and report on key outcomes.</li>
                </ul>
            </div>
            
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