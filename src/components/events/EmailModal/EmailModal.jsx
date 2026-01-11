/**
 * Email Modal Component
 * Captures user email with opt-in checkbox before redirecting to tickets
 */

'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSubscription } from '@/actions/actions';
// OTP Flow Commented Out
// import { verifyOTP } from '@/actions/actions';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  optIn: z.boolean().default(true),
});

// OTP Flow Commented Out
// const otpSchema = z.object({
//   otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
// });

export function EmailModal({ isOpen, onClose, onSubmit, eventTitle, eventId, ticketUrl }) {
  // OTP Flow Commented Out - No step needed, direct redirect
  // const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  // const [userOptIn, setUserOptIn] = useState(true);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmail,
    watch: watchEmail,
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      optIn: true,
    },
  });

  // OTP Flow Commented Out
  // const {
  //   register: registerOTP,
  //   handleSubmit: handleOTPSubmit,
  //   formState: { errors: otpErrors },
  //   reset: resetOTP,
  // } = useForm({
  //   resolver: zodResolver(otpSchema),
  //   defaultValues: {
  //     otp: '',
  //   },
  // });

  const optIn = watchEmail('optIn');

  const handleEmailFormSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      const result = await createSubscription({
        email: data.email,
        eventId: eventId,
        optIn: data.optIn,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create subscription');
      }

      // OTP Flow Commented Out - Direct redirect after subscription
      // setUserEmail(data.email);
      // setUserOptIn(data.optIn);
      // setStep('otp');

      // Direct redirect to ticket URL without OTP verification
      const redirectUrl = result.data?.ticketUrl || ticketUrl;
      onSubmit(data.email, data.optIn, redirectUrl);
      handleClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Flow Commented Out
  // const handleOTPFormSubmit = async (data) => {
  //   setIsSubmitting(true);
  //   setError('');

  //   try {
  //     const result = await verifyOTP({
  //       email: userEmail,
  //       eventId: eventId,
  //       otp: data.otp,
  //     });

  //     if (!result.success) {
  //       throw new Error(result.error || 'Invalid verification code');
  //     }

  //     // Redirect to ticket URL
  //     onSubmit(userEmail, userOptIn, result.data?.ticketUrl || ticketUrl);
  //     handleClose();
  //   } catch (err) {
  //     setError(err.message || 'Invalid verification code. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleClose = () => {
    if (!isSubmitting) {
      resetEmail();
      // OTP Flow Commented Out
      // resetOTP();
      setError('');
      // setStep('email');
      // setUserEmail('');
      // setUserOptIn(true);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Get Tickets
            {/* OTP Flow Commented Out */}
            {/* {step === 'email' ? 'Get Tickets' : 'Verify Your Email'} */}
          </DialogTitle>
          <DialogDescription>
            Enter your email to get tickets for <strong>{eventTitle}</strong>
            {/* OTP Flow Commented Out */}
            {/* {step === 'email' ? (
              <>Enter your email to get tickets for <strong>{eventTitle}</strong></>
            ) : (
              <>We sent a 6-digit verification code to <strong>{userEmail}</strong>. Please enter it below.</>
            )} */}
          </DialogDescription>
        </DialogHeader>

        {/* Email Form - OTP Flow Commented Out */}
        <form onSubmit={handleEmailSubmit(handleEmailFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...registerEmail('email')}
              disabled={isSubmitting}
            />
            {emailErrors.email && (
              <p className="text-sm text-destructive">{emailErrors.email.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="optIn"
              {...registerEmail('optIn')}
              checked={optIn}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="optIn"
              className="text-sm font-normal cursor-pointer"
            >
              I want to receive updates about similar events
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Get Tickets'}
            </Button>
          </DialogFooter>
        </form>

        {/* OTP Flow Commented Out */}
        {/* {step === 'email' ? (
          <form onSubmit={handleEmailSubmit(handleEmailFormSubmit)} className="space-y-4">
            ...
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit(handleOTPFormSubmit)} className="space-y-4">
            ...
          </form>
        )} */}
      </DialogContent>
    </Dialog>
  );
}

