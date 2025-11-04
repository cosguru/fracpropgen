
import React, { useState, useCallback, useEffect } from 'react';
import { ProposalFormInput, GeneratedProposal, GeneratedEmail } from './types';
import ProposalForm from './components/ProposalForm';
import ProposalPreview from './components/ProposalPreview';
import { generateProposalContent, generateCompanionEmail } from './services/geminiService';
import { exportToDocx } from './services/wordService';
import { sendLeadToSysteme } from './services/systemeService';
import ProgressBar from './components/ui/ProgressBar';
import Button from './components/ui/Button';
import Modal from './components/ui/Modal';
import LeadCaptureForm from './components/LeadCaptureForm';
import { templates } from './data/templates';
import EmailPreviewModal from './components/EmailPreviewModal';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);


const EmptyStateIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"/>
        <path d="M12 12L14.5 14.5"/>
        <path d="M12 7V12"/>
    </svg>
)

const StaticContent = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <section id="template" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">What’s Inside Our Consulting Proposal Template?</h2>
                <p className="text-slate-600 mb-4">Our AI-generated template provides a complete, professionally structured document with all the essential sections you need to win projects:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                    <li><strong>Scope of Work:</strong> Clearly defined deliverables and objectives. Our AI helps you craft the perfect <strong className="font-semibold">consulting scope of work template</strong>.</li>
                    <li><strong>Pricing & Investment:</strong> Flexible section to detail your fees, whether it's a retainer, fixed project, or hourly.</li>
                    <li><strong>Terms & Conditions:</strong> A standard section for payment terms, confidentiality, and termination clauses.</li>
                    <li><strong>Signature Block:</strong> A dedicated space for client and consultant signatures to formalize the agreement.</li>
                    <li><strong>90-Day Plan:</strong> A high-level roadmap outlining key milestones for the initial engagement period.</li>
                </ul>
            </section>

            <section id="examples" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">Consulting Proposal Examples</h2>
                <p className="text-slate-600 mb-6">Our AI adapts its writing style based on the template you choose. Here are a few <strong>consulting proposal examples</strong> of what you can create:</p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-800">Project-Based Plan</h3>
                        <p className="text-sm text-slate-600 mt-1">A detailed proposal for a project with a fixed scope and timeline.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-800">Discovery Audit</h3>
                        <p className="text-sm text-slate-600 mt-1">A concise proposal for a short-term audit to diagnose problems.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-800">Retainer Renewal</h3>
                        <p className="text-sm text-slate-600 mt-1">A proposal to continue an existing engagement, highlighting past wins.</p>
                    </div>
                </div>
            </section>

            <section id="formats" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">Available in Your Favorite Format</h2>
                <p className="text-slate-600">Once generated, you can instantly download your proposal as a Microsoft Word document, the most common format for easy editing and sharing.</p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 mt-4">
                    <li><strong>Microsoft Word (.docx):</strong> Download a <strong>free consulting proposal template word</strong> document, fully editable and ready to be customized with your branding.</li>
                </ul>
            </section>

            <section id="how-to" className="mb-12 scroll-mt-20">
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">How to Customize Your Proposal in 5 Steps</h2>
                <p className="text-slate-600 mb-4">Creating your proposal is simple and fast:</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                    <li><strong>Select a Template:</strong> Choose an AI persona that matches your role (e.g., Fractional CMO, CFO, CTO).</li>
                    <li><strong>Enter Key Details:</strong> Fill in your name, client name, project goal, deliverables, timeline, and pricing.</li>
                    <li><strong>Generate with AI:</strong> Click "Generate Proposal" and let our AI craft the entire document in seconds.</li>
                    <li><strong>Review and Refine:</strong> Read through the generated text. You can edit the "About Me" section directly in the browser.</li>
                    <li><strong>Download:</strong> Enter your details and download the final document as a Word file.</li>
                </ol>
            </section>
            
            <section id="faq" className="scroll-mt-20">
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-slate-800">How long should a consulting proposal be?</h3>
                        <p className="text-slate-600 text-sm mt-1">A good consulting proposal is typically 5-10 pages long. It should be concise yet comprehensive, clearly outlining the problem, your proposed solution, scope, timeline, and investment. Our AI generator creates a perfectly structured proposal of optimal length.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">How do you price a consulting proposal?</h3>
                        <p className="text-slate-600 text-sm mt-1">Pricing can be structured as a fixed project fee, hourly rate, or a monthly retainer. The best method depends on the project's scope and client relationship. Our tool allows you to input any pricing structure, like a <strong>consulting retainer proposal template</strong>, which is then professionally formatted.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">What is the difference between a scope of work and a statement of work (SOW)?</h3>
                        <p className="text-slate-600 text-sm mt-1">A 'Scope of Work' is a section within a proposal that details the services, deliverables, and timelines. A 'Statement of Work' (SOW) is often a more formal, standalone legal document that expands on the scope with detailed terms, conditions, and standards. Our template provides a clear scope of work that can easily be expanded into an SOW.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Is a retainer or fixed-price project better?</h3>
                        <p className="text-slate-600 text-sm mt-1">A retainer is ideal for ongoing, strategic advisory work where the scope may evolve, providing predictable revenue. A fixed-price project is best for well-defined projects with clear start and end dates. The choice depends on the nature of the engagement and client needs.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Can I add an e-signature to the downloaded proposal?</h3>
                        <p className="text-slate-600 text-sm mt-1">Yes. The generated Word document includes a standard signature block. You can easily upload it to any e-signature service like DocuSign or PandaDoc to collect legally binding digital signatures from your clients.</p>
                    </div>
                </div>
            </section>
        </div>
    </div>
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
    const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingEmail, setIsGeneratingEmail] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);


    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isLoading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return 95;
                    }
                    const increment = prev < 50 ? 10 : (prev < 80 ? 5 : 2);
                    return prev + increment;
                });
            }, 400);
        } else {
            setProgress(0);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isLoading]);


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
        setGeneratedEmail(null);

        try {
            const proposal = await generateProposalContent(formInput);
            setProgress(100);
            
            setTimeout(() => {
                setGeneratedProposal(proposal);
                setFormInput(prev => ({...prev, executiveAbout: proposal.about}));
                setIsLoading(false);
            }, 500); // Short delay to show 100%

        } catch (err) {
            console.error(err);
            setError('Failed to generate proposal. Please check your inputs and try again.');
            setIsLoading(false);
        }
    };

    const handleGenerateEmail = async () => {
        if (!generatedProposal) return;
        setIsGeneratingEmail(true);
        setError(null);
        try {
            const email = await generateCompanionEmail(generatedProposal, formInput.clientName, formInput.executiveName);
            setGeneratedEmail(email);
            setIsEmailModalOpen(true);
        } catch (err) {
             console.error(err);
            setError('Failed to generate email. Please try again.');
        } finally {
            setIsGeneratingEmail(false);
        }
    }
    
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
                <div className="max-w-4xl mx-auto">
                    <ProposalForm 
                        input={formInput} 
                        onChange={handleFormChange} 
                        onTemplateChange={handleTemplateChange}
                        onSubmit={handleSubmit}
                        isLoading={isLoading} 
                    />

                    <div className="mt-8 lg:mt-12">
                        <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg border border-slate-100 flex flex-col">
                            <div className="p-4 sm:p-6 flex flex-col flex-grow min-h-[500px]">
                                {isLoading ? (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto">
                                        <ProgressBar progress={progress} />
                                        <p className="text-slate-700 font-semibold mt-4 text-lg" aria-live="polite">{Math.round(progress)}%</p>
                                        <p className="text-slate-500 mt-2 text-sm">The AI is crafting your winning proposal. This can take a moment.</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex-grow flex items-center justify-center text-center">
                                        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 w-full max-w-md">
                                            <strong className="font-bold font-display">An Error Occurred</strong>
                                            <span className="block mt-1 text-sm">{error}</span>
                                        </div>
                                    </div>
                                ) : generatedProposal ? (
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex-grow overflow-y-auto pr-2">
                                            <ProposalPreview 
                                                proposal={generatedProposal}
                                                onAboutChange={handleAboutChange}
                                            />
                                        </div>
                                        <div className="mt-auto pt-6 border-t border-slate-200 flex flex-col items-center">
                                           <div className="flex flex-col sm:flex-row gap-4">
                                                <Button
                                                    onClick={handleGenerateEmail}
                                                    icon={<EmailIcon />}
                                                    className="w-full sm:w-auto bg-slate-600 hover:bg-slate-700 focus:ring-slate-500 from-slate-500 to-slate-600"
                                                    isLoading={isGeneratingEmail}
                                                >
                                                    Generate Email to Client
                                                </Button>
                                                <Button
                                                    onClick={handleDownloadClick}
                                                    icon={<DownloadIcon />}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Download as Word Doc
                                                </Button>
                                            </div>
                                            <a
                                                href="https://forms.gle/YFxavJGmj66xBCcaA"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block text-sm text-slate-500 hover:text-slate-700 hover:underline transition-colors"
                                            >
                                                Provide Feedback
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500 bg-slate-50 rounded-lg">
                                       <EmptyStateIcon />
                                        <h3 className="text-lg font-semibold font-display text-slate-700">Your Proposal Will Appear Here</h3>
                                        <p className="mt-1 max-w-md text-sm">Fill out the form to generate an AI-powered proposal.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <StaticContent />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Download Proposal">
                <LeadCaptureForm 
                    onSubmit={handleLeadSubmission} 
                    onSuccessComplete={handleDownloadAndClose}
                />
            </Modal>
            {generatedEmail && (
                 <EmailPreviewModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    subject={generatedEmail.subject}
                    body={generatedEmail.body}
                />
            )}
           
        </>
    );
};

export default App;
