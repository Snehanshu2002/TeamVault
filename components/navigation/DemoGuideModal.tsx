'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  Play, 
  CheckCircle, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  Users, 
  Eye, 
  Lock, 
  ExternalLink,
  SplitSquareVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({ isOpen, onClose }) => {
  const { user, switchPersona } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Step 1: Login as Rahul',
      description: 'Switch to Rahul Sharma (Team Alpha Member).',
      persona: 'user-rahul',
      actionText: 'Switch to Rahul',
      icon: Users,
      highlight: 'Notice Rahul is a member of Team Alpha only.',
      navigate: '/user/teams',
    },
    {
      step: 2,
      title: 'Step 2: Open Amit Chat',
      description: 'Select Amit Patel from Team Alpha to open private conversation.',
      persona: 'user-rahul',
      actionText: 'Open Amit Chat',
      icon: MessageSquare,
      highlight: 'Notice only safe handle @amit is visible (no private email/phone).',
      navigate: '/user/messages',
    },
    {
      step: 3,
      title: 'Step 3: Open Tab 2 & Login as Amit',
      description: 'Open a second browser tab/window or use the Live 2-Panel Demo to simulate Amit.',
      persona: 'user-amit',
      actionText: 'Try Side-by-Side Live Demo',
      icon: SplitSquareVertical,
      highlight: 'BroadcastChannel and Firestore sync messages instantly across tabs.',
      navigate: '/demo/chat',
    },
    {
      step: 4,
      title: 'Step 4: Send Real-Time Messages',
      description: 'Rahul sends: "Hi Amit, how is the project going?" -> Amit replies: "Hey Rahul, everything is on track!"',
      persona: 'user-amit',
      actionText: 'Switch to Amit',
      icon: MessageSquare,
      highlight: 'Messages appear automatically on both screens without any page refresh.',
      navigate: '/user/messages',
    },
    {
      step: 5,
      title: 'Step 5: Verify Real-Time Message Delivery',
      description: 'Confirm timestamps, unread markers, and auto-scroll delivery.',
      persona: 'user-rahul',
      actionText: 'Back to Rahul',
      icon: CheckCircle,
      highlight: 'Read receipts and real-time state broadcast seamlessly.',
      navigate: '/user/messages',
    },
    {
      step: 6,
      title: 'Step 6: Login as Admin 1 (Alex Vance)',
      description: 'Switch to Admin 1 who oversees Team Alpha and Team Beta.',
      persona: 'admin-1',
      actionText: 'Switch to Admin 1',
      icon: ShieldCheck,
      highlight: 'Admin 1 can manage Team Alpha and observe its communication logs.',
      navigate: '/admin',
    },
    {
      step: 7,
      title: 'Step 7: Open Admin Conversations',
      description: 'Navigate to Admin > Conversations to view team interactions.',
      persona: 'admin-1',
      actionText: 'View Admin Conversations',
      icon: Eye,
      highlight: 'Admin can see private chats occurring between members of Team Alpha & Beta.',
      navigate: '/admin/conversations',
    },
    {
      step: 8,
      title: 'Step 8: Inspect Rahul ↔ Amit Conversation',
      description: 'Open Rahul ↔ Amit conversation to verify live oversight & audit trail.',
      persona: 'admin-1',
      actionText: 'Inspect Live Transcript',
      icon: Eye,
      highlight: 'Admin receives live message feed in read-only audit mode.',
      navigate: '/admin/conversations',
    },
    {
      step: 9,
      title: 'Step 9: Login as Admin 2 (Beatrice Stone)',
      description: 'Switch to Admin 2 who only manages Team Gamma.',
      persona: 'admin-2',
      actionText: 'Switch to Admin 2',
      icon: Lock,
      highlight: 'Strict role-based isolation: Admin 2 has zero access to Team Alpha.',
      navigate: '/admin/conversations',
    },
    {
      step: 10,
      title: 'Step 10: Verify Admin 2 Isolation',
      description: 'Confirm that Admin 2 CANNOT see Team Alpha or the Rahul ↔ Amit conversation.',
      persona: 'admin-2',
      actionText: 'Verify Restricted Scope',
      icon: ShieldCheck,
      highlight: 'Only Team Gamma is accessible. Platform security verified!',
      navigate: '/admin/conversations',
    },
  ];

  const handleExecuteStep = (stepObj: typeof steps[0]) => {
    if (stepObj.persona && user?.id !== stepObj.persona) {
      switchPersona(stepObj.persona);
    }
    if (stepObj.navigate) {
      router.push(stepObj.navigate);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Presentation & Demo Guide"
      description="Follow this complete 10-step flow to demonstrate real-time private messaging, privacy protection, and authorized admin oversight."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Quick Demo Mode Options */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-950">Side-by-Side Two-User Live Demo</h4>
              <p className="text-xs text-indigo-700">
                Instantly chat as Rahul (left) and Amit (right) on a single screen without needing 2 tabs.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              router.push('/demo/chat');
              onClose();
            }}
          >
            Launch 2-Panel
          </Button>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.step;
            return (
              <div
                key={s.step}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {s.step}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {s.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">{s.description}</p>
                      <div className="mt-2 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                        💡 {s.highlight}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCurrent ? 'primary' : 'outline'}
                    onClick={() => {
                      setCurrentStep(s.step);
                      handleExecuteStep(s);
                    }}
                    className="shrink-0 text-xs"
                  >
                    <span>{s.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Current Persona: <strong className="text-slate-800">{user?.display_name}</strong> ({user?.role})
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Guide
          </Button>
        </div>
      </div>
    </Modal>
  );
};
