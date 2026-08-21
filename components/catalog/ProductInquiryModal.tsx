import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle, CreditCard, Info } from 'lucide-react';
import { databaseService } from '../../services/database.ts';

export type InquiryIntent =
  | 'workflow_kit'
  | 'validation_sprint'
  | 'enterprise_pilot'
  | 'all_catalog_workspace';

interface ProductInquiryModalProps {
  intent: InquiryIntent;
  productName?: string;
  onClose: () => void;
}

const INTENT_TITLES: Record<InquiryIntent, string> = {
  workflow_kit: 'Buy Workflow Kit',
  validation_sprint: 'Book Validation Sprint',
  enterprise_pilot: 'Request Enterprise Pilot',
  all_catalog_workspace: 'All-Catalog Workspace',
};

const INTENT_BODIES: Record<InquiryIntent, string> = {
  workflow_kit:
    'The workflow kit includes the canonical prompt, input/output schemas, runbook and fixture set. Execution is performed by your engineering team; KONKRED provides the kit and support.',
  validation_sprint:
    'A structured validation sprint produces the validation report for the product: benchmark results, limitation analysis and a production-readiness recommendation.',
  enterprise_pilot:
    'A supervised pilot with KONKRED validation engineers, scoped to your data and security requirements. Requires scoping call and approval.',
  all_catalog_workspace:
    'Access to all 15 workflow products across the catalogue under one workspace license, with validation sprints scheduled by priority.',
};

/**
 * Test-mode monetization form. Payment/CRM credentials are not configured, so
 * this form collects an inquiry lead only — NO payment is processed. The UI
 * states this explicitly and reports honest success/failure.
 */
export const ProductInquiryModal: React.FC<ProductInquiryModalProps> = ({ intent, productName, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the terms and privacy notice to continue.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await databaseService.submitProductLead({
        productSlug: productName ? undefined : null,
        intent,
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        message: message.trim() || undefined,
        acceptedTerms,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission failed:', err);
      setError(
        'Your inquiry could not be stored right now (lead storage is not configured in this environment). ' +
        'Please email ari@konkred.xyz directly with your intent.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={INTENT_TITLES[intent]}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0E1319] border-2 border-black rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0E1319] z-10">
          <div>
            <h3 className="font-mono font-black uppercase tracking-widest text-sm text-white">
              {INTENT_TITLES[intent]}
            </h3>
            {productName && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 mt-0.5">
                {productName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* TEST MODE notice — payment is NOT processed */}
          <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/10 rounded-xl px-4 py-3">
            <CreditCard size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono font-black uppercase tracking-widest text-[10px] text-amber-400">
                TEST MODE // NO PAYMENT PROCESSED
              </p>
              <p className="text-[11px] text-zinc-300 leading-relaxed mt-1">
                Payment and CRM credentials are not configured in this environment. This form
                records your inquiry as a lead only — nothing is charged. A KONKRED contact will
                follow up to arrange payment, booking or scoping.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">{INTENT_BODIES[intent]}</p>

          {submitted ? (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-4 py-4">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono font-black uppercase tracking-widest text-[11px] text-emerald-400">
                    INQUIRY RECEIVED
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                    Your {INTENT_TITLES[intent].toLowerCase()} inquiry was stored. A KONKRED contact
                    will follow up at {email}. No payment was processed.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-name" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="inq-email" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Work Email *
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="inq-company" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                  Company
                </label>
                <input
                  id="inq-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label htmlFor="inq-message" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                  Message / Scope Notes
                </label>
                <textarea
                  id="inq-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Timeline, data sensitivity, integration context…"
                />
              </div>

              <label className="flex items-start gap-2.5 text-[11px] text-zinc-400 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 accent-amber-500"
                />
                <span>
                  I agree to the KONKRED <span className="text-amber-500">terms</span> and{' '}
                  <span className="text-amber-500">privacy policy</span> and consent to being
                  contacted about this inquiry. No payment is authorized by this form.
                </span>
              </label>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3" role="alert">
                  <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 font-mono leading-relaxed">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Info size={14} />}
                {isSubmitting ? 'Submitting…' : `Submit ${INTENT_TITLES[intent]}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
