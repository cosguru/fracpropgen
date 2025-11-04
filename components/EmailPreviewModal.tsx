import React, { useState, useCallback } from 'react';
import Modal from './ui/Modal';
import { GeneratedEmail } from '../types';
import Button from './ui/Button';

interface EmailPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: GeneratedEmail;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, email }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(email.body).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    }, [email.body]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Companion Email to Client">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                    <div className="p-2 bg-slate-100 rounded-md text-sm text-slate-800">
                        {email.subject}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Body</label>
                    <div className="p-3 bg-slate-100 rounded-md text-sm text-slate-800 whitespace-pre-wrap h-64 overflow-y-auto">
                        {email.body}
                    </div>
                </div>
                <div className="pt-2 flex justify-end">
                    <Button onClick={handleCopy} icon={<CopyIcon />} className="w-full sm:w-auto">
                        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EmailPreviewModal;
