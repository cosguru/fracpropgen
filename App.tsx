
import React, { useState, useCallback } from 'react';
import { ProposalFormInput, GeneratedProposal } from './types';
import ProposalForm from './components/ProposalForm';
import ProposalPreview from './components/ProposalPreview';
import { generateProposalContent } from './services/geminiService';
import { exportToDocx } from './services/wordService';
import { sendLeadToSysteme } from './services/zapierService';
import Loader from './components/ui/Loader';
import Button from './components/ui/Button';
import Modal from './components/ui/Modal';
import LeadCaptureForm from './components/LeadCaptureForm';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const App: React.FC = () => {
    const [formInput, setFormInput] = useState<ProposalFormInput>({
        executiveName: 'Jane Doe',
        executiveRole: 'Fractional CMO',
        clientName: 'Acme Inc.',
        projectGoal: 'Increase lead generation by 50% in the next quarter.',
        deliverables: 'Marketing strategy audit, New content marketing plan, SEO optimization roadmap',
        timeline: '3-Month Engagement',
        price: '$5,000/month retainer',
        executiveAbout: '',
        templateId: 'strategic-leader', // Default template
    });

    const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleAboutChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAboutText = e.target.value;
        setGeneratedProposal(prev => (prev ? { ...prev, about: newAboutText } : null));
        setFormInput(prev => ({ ...prev, executiveAbout: newAboutText }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedProposal(null);

        try {
            const proposal = await generateProposalContent(formInput);
            setGeneratedProposal(proposal);
            setFormInput(prev => ({...prev, executiveAbout: proposal.about}));
        } catch (err) {
            console.error(err);
            setError('Failed to generate proposal. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadClick = () => {
        if (generatedProposal) {
            setIsModalOpen(true);
        }
    };

    const handleLeadSubmission = async (name: string, email: string) => {
        return await sendLeadToSysteme(name, email);
    };

    const handleDownloadAndClose = () => {
        if (generatedProposal) {
            exportToDocx(generatedProposal, formInput.clientName);
        }
        setIsModalOpen(false);
    }


    return (
        <div className="min-h-screen font-sans text-slate-800 flex flex-col">
             <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                   <h1 className="text-xl font-bold text-slate-900">FractionalProposal.com</h1>
                </div>
            </header>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">Create Winning Proposals in Minutes</h2>
                <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">Leverage AI to instantly generate professional, high-converting proposals for your fractional executive services.</p>
            </div>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <ProposalForm 
                            input={formInput} 
                            onChange={handleFormChange} 
                            onSubmit={handleSubmit}
                            isLoading={isLoading} 
                        />
                    </div>
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg h-full flex flex-col">
                            <div className="p-4 sm:p-6 flex flex-col flex-grow h-full">
                                {isLoading ? (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                                        <Loader />
                                        <p className="text-slate-700 font-semibold mt-4">Generating your proposal...</p>
                                        <p className="text-slate-500 mt-2 text-sm">The AI is crafting your winning proposal. This can take a moment.</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex-grow flex items-center justify-center text-center">
                                        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 w-full max-w-md">
                                            <strong className="font-bold">An Error Occurred</strong>
                                            <span className="block mt-1 text-sm">{error}</span>
                                        </div>
                                    </div>
                                ) : generatedProposal ? (
                                    <div className="flex flex-col flex-grow h-full">
                                        <div className="flex-grow overflow-y-auto pr-2">
                                            <ProposalPreview 
                                                proposal={generatedProposal}
                                                onAboutChange={handleAboutChange}
                                            />
                                        </div>
                                        <div className="mt-auto pt-6 border-t border-slate-200 text-center">
                                           <Button
                                                onClick={handleDownloadClick}
                                                icon={<DownloadIcon />}
                                                className="w-full sm:w-auto"
                                            >
                                                Download as Word Doc
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500 bg-slate-50 rounded-lg">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <h3 className="text-lg font-semibold text-slate-700">Your Proposal Will Appear Here</h3>
                                        <p className="mt-1 max-w-md text-sm">Fill out the form on the left to generate an AI-powered proposal.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="border-t border-slate-200 text-slate-500 text-sm text-center py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <p className="mb-2">
                        Copyright © {new Date().getFullYear()} <a href="https://fractionalofficer.com" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-600 underline hover:text-brandGreen-600 transition-colors">FractionalOfficer.com</a>, a Decebal Ventures LLC asset. All Rights Reserved.
                    </p>
                    <p>
                        Powered by Google Gemini. Created with ❤️ in San Antonio, Texas.
                    </p>
                </div>
            </footer>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Download Proposal">
                <LeadCaptureForm 
                    onSubmit={handleLeadSubmission} 
                    onSuccessComplete={handleDownloadAndClose}
                />
            </Modal>
        </div>
    );
};

export default App;
