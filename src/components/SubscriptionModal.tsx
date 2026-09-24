import React from 'react';
import { UserSubscription } from '../types';
import { PlanUpgradeView } from './PlanUpgradeView';

interface SubscriptionModalProps {
  subscription: UserSubscription;
  onUpdateSubscription: (updated: UserSubscription) => void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  subscription,
  onUpdateSubscription,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-[#0d0d0f] border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[94vh] overflow-y-auto flex flex-col shadow-2xl">
        <PlanUpgradeView
          subscription={subscription}
          onUpdateSubscription={onUpdateSubscription}
          onClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};
