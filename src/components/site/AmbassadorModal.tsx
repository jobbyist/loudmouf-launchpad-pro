'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ambassadorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  instagram: z.string().min(3, "Please enter a valid Instagram handle").regex(/^@?[a-zA-Z0-9._]{3,}$/, "Invalid Instagram handle"),
  email: z.string().email("Please enter a valid email address"),
  audienceSize: z.enum(["1k-10k", "10k-50k", "50k-100k", "100k+"], {
    errorMap: () => ({ message: "Please select your audience size" }),
  }),
  whyLoudmouf: z.string().min(30, "Please tell us more (at least 30 characters)"),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type AmbassadorFormData = z.infer<typeof ambassadorSchema>;

interface AmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AmbassadorModal({ isOpen, onClose }: AmbassadorModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AmbassadorFormData>({
    resolver: zodResolver(ambassadorSchema),
    defaultValues: {
      name: '',
      instagram: '',
      email: '',
      audienceSize: undefined as any,
      whyLoudmouf: '',
      termsAgreed: false,
    },
  });

  const termsAgreed = watch('termsAgreed');

  const onSubmit = async (data: AmbassadorFormData) => {
    setStatus('loading');

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          reset();
          setStatus('idle');
        }, 2500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-2xl font-medium text-white">Join the Loudmouf Ambassador Program</h3>
            <p className="text-sm text-white/60 mt-1">Drop 001 Early Access</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success State */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="mb-6 text-loud-yellow animate-bounce">
              <CheckCircle size={80} strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-medium text-white mb-2">Application Received!</h3>
            <p className="text-white/70 max-w-xs">
              Thank you! Our team will review your application and get back to you within 48 hours.
            </p>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <input
                id="name"
                {...register('name')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-loud-yellow"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="instagram">Instagram Handle</Label>
              <input
                id="instagram"
                {...register('instagram')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-loud-yellow"
                placeholder="@yourhandle"
              />
              {errors.instagram && <p className="text-red-400 text-sm mt-1">{errors.instagram.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-loud-yellow"
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="audienceSize">Approximate Audience Size</Label>
              <select
                id="audienceSize"
                {...register('audienceSize')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-loud-yellow"
              >
                <option value="">Select your range</option>
                <option value="1k-10k">1K – 10K</option>
                <option value="10k-50k">10K – 50K</option>
                <option value="50k-100k">50K – 100K</option>
                <option value="100k+">100K+</option>
              </select>
              {errors.audienceSize && <p className="text-red-400 text-sm mt-1">{errors.audienceSize.message}</p>}
            </div>

            <div>
              <Label htmlFor="whyLoudmouf">Why do you want to partner with Loudmouf?</Label>
              <textarea
                id="whyLoudmouf"
                {...register('whyLoudmouf')}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-loud-yellow resize-y"
                placeholder="Tell us about your content, audience, and why you're excited..."
              />
              {errors.whyLoudmouf && <p className="text-red-400 text-sm mt-1">{errors.whyLoudmouf.message}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="termsAgreed"
                {...register('termsAgreed')}
                className="mt-1"
              />
              <Label htmlFor="termsAgreed" className="text-sm text-white/80 cursor-pointer">
                I agree to the{' '}
                <a 
                  href="https://partners.loudmouf.co.za/brand-ambassador-program#terms" 
                  target="_blank"
                  className="text-loud-yellow hover:underline"
                >
                  Ambassador Program Terms & Conditions
                </a>
              </Label>
            </div>
            {errors.termsAgreed && <p className="text-red-400 text-sm -mt-2">{errors.termsAgreed.message}</p>}

            <Button
              type="submit"
              disabled={status === 'loading' || !termsAgreed}
              className="w-full py-4 text-base font-medium"
              size="lg"
            >
              {status === 'loading' ? 'Submitting Application...' : 'Submit Application'}
            </Button>

            {status === 'error' && (
              <p className="text-red-400 text-center text-sm">Failed to submit. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}