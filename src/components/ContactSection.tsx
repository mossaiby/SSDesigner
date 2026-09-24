import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
import { LeadInquiry } from '../types';

interface ContactSectionProps {
  isStandalonePage?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isStandalonePage = false }) => {
  const { softwareList, submitLead } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [inquiryType, setInquiryType] = useState<LeadInquiry['inquiryType']>('Software Demo');
  const [softwareInterest, setSoftwareInterest] = useState<string>(softwareList[0]?.name || 'FormSpace Prime');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead({
      name,
      email,
      organization,
      role: role || 'Structural Engineer',
      inquiryType,
      softwareInterest,
      message,
    });
    setIsSubmitted(true);
  };

  return (
    <section className={`py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors ${isStandalonePage ? 'min-h-screen' : 'border-b border-slate-200 dark:border-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Office info & technical inquiry details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <span>Engineering Liaison & Solvers Advisory</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Connect with Our Space Structure Specialists
            </h2>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              Whether you require a live benchmark for a 200m clear-span truss, evaluation licenses for your finite element team, or custom tensegrity solver development, our engineering team is ready to assist.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-900 text-xs">
              <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-950 dark:text-white">Engineering HQ — Europe</div>
                  <div className="text-slate-500 dark:text-slate-400">Ludwig-Maximilians Technology Park, Munich, Germany</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <Building className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-950 dark:text-white">Advanced Form-Finding Laboratory</div>
                  <div className="text-slate-500 dark:text-slate-400">ETH Innovation Campus, Zurich, Switzerland</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-950 dark:text-white">Direct Technical Dispatch</div>
                  <div className="text-cyan-600 dark:text-cyan-400 font-mono">engineering@ssdesigner.ir</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 shadow-sm">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Sales Fluff Guarantee</span>
              </div>
              Technical inquiries are directly routed to licensed civil and aerospace structural engineers, not generic sales reps.
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                    Technical Inquiry Received
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-slate-950 dark:text-white font-semibold">{name}</span>. An engineer has logged your request for <span className="text-cyan-600 dark:text-cyan-400 font-medium">{softwareInterest}</span>. We will follow up with trial credentials and computational benchmarks within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setEmail('');
                      setOrganization('');
                      setMessage('');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                    Inquire for Software Licenses & Benchmarks
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Marcus Vance, P.E."
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Professional Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="m.vance@aerospace-labs.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Organization / Firm *</label>
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="e.g. Arup / Buro Happold"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Title / Role</label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="Principal Structural Analyst"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Inquiry Type</label>
                      <select
                        value={inquiryType}
                        onChange={e => setInquiryType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Software Demo">Software Demo & Evaluation License</option>
                        <option value="Commercial Quotation">Commercial Site License</option>
                        <option value="Academic License">Academic / Research Grant</option>
                        <option value="Consulting / Engineering Partnership">Project Consultation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Target Software</label>
                      <select
                        value={softwareInterest}
                        onChange={e => setSoftwareInterest(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none"
                      >
                        {softwareList.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                        <option value="Full Space Structures Suite">Entire SSDesigner Suite</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-mono">Project Scope & Solver Requirements</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Span dimensions, number of members, material types (steel / cables / CFRP / membrane), nonlinear challenges..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Engineering Lead</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
