
import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { GeneratedEmail } from '../types';

interface EmailPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: GeneratedEmail | null;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, email }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    useEffect(() => {
        if (isOpen) {
            setCopyButtonText('Copy to Clipboard'); // Reset on open
        }
    }, [isOpen]);

    const handleCopy = () => {
        if (email) {
            navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`).then(() => {
                setCopyButtonText('Copied!');
                setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generated Email">
            {email ? (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Subject</label>
                        <p className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800">{email.subject}</p>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Body</label>
                        <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800 whitespace-pre-wrap h-64 overflow-y-auto">{email.body}</div>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <CopyIcon /> {copyButtonText}
                    </button>
                </div>
            ) : (
                 <div className="text-center py-4 text-slate-500">
                    <p>No email generated.</p>
                </div>
            )}
        </Modal>
    );
};

export default EmailPreviewModal;
