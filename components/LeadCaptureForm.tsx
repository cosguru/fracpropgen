import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

interface LeadCaptureFormProps {
    onSubmit: (name: string, email: string) => Promise<void>;
    onClose: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            setError('Please fill out both fields.');
            return;
        }
        setError('');
        setIsLoading(true);
        await onSubmit(name, email);
        // The parent component will handle closing the modal, so we don't need to setIsLoading(false) here.
    };

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
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="pt-2">
                <Button type="submit" isLoading={isLoading} icon={<DownloadIcon />} className="w-full">
                   {isLoading ? 'Processing...' : 'Download Now'}
                </Button>
            </div>
        </form>
    );
};

export default LeadCaptureForm;
