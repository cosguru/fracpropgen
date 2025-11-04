
import React, { useState, useCallback } from 'react';
import { ProposalFormInput, GeneratedProposal } from './types';
import ProposalForm from './components/ProposalForm';
import ProposalPreview from './components/ProposalPreview';
import { generateProposalContent } from './services/geminiService';
import { exportToDocx } from './services/wordService';
import { sendLeadToSysteme } from './services/systemeService';
import Loader from './components/ui/Loader';
import Button from './components/ui/Button';
import Modal from './components/ui/Modal';
import LeadCaptureForm from './components/LeadCaptureForm';
import { templates } from './data/templates';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const defaultTemplate = templates[0];

/**
 * ===================================================================
 * ACTION REQUIRED: Set Your Systeme.io Tag ID
 * ===================================================================
 * To automatically tag new contacts in Systeme.io, replace the placeholder
 * value `123` below with your actual Tag ID.
 *
 * How to find your Tag ID:
 * 1. In Systeme.io, go to Contacts > Tags.
 * 2. Click to edit the tag you want to use.
 * 3. The ID is the number in the URL (e.g., .../tags/12345/edit).
 * ===================================================================
 */
const SYSTEME_TAG_ID = 494992; // <-- Replace 123 with your actual Tag ID

const App: React.FC = () => {
    const [formInput, setFormInput] = useState<ProposalFormInput>({
        executiveName: 'Jane Doe',
        clientName: 'Acme Inc.',
        executiveRole: defaultTemplate.exampleData.executiveRole,
        projectGoal: defaultTemplate.exampleData.projectGoal,
        deliverables: defaultTemplate.exampleData.deliverables,
        price: defaultTemplate.exampleData.price,
        timeline: '3-Month Engagement',
        executiveAbout: '',
        templateId: defaultTemplate.id,
    });

    const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
    }, []);
    
    const handleTemplateChange = useCallback((templateId: string) => {
        const selectedTemplate = templates.find(t => t.id === templateId);
        if (selectedTemplate) {
            setFormInput(prev => ({
                ...prev,
                templateId: selectedTemplate.id,
                executiveRole: selectedTemplate.exampleData.executiveRole,
                projectGoal: selectedTemplate.exampleData.projectGoal,
                deliverables: selectedTemplate.exampleData.deliverables,
                price: selectedTemplate.exampleData.price,
            }));
        }
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
        return await sendLeadToSysteme(name, email, [SYSTEME_TAG_ID]);
    };

    const handleDownloadAndClose = () => {
        if (generatedProposal) {
            exportToDocx(generatedProposal, formInput.clientName, formInput.executiveName, formInput.executiveRole);
        }
        setIsModalOpen(false);
    }


    return (
        <>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <ProposalForm 
                            input={formInput} 
                            onChange={handleFormChange} 
                            onTemplateChange={handleTemplateChange}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Download Proposal">
                <LeadCaptureForm 
                    onSubmit={handleLeadSubmission} 
                    onSuccessComplete={handleDownloadAndClose}
                />
            </Modal>
        </>
    );
};

export default App;
