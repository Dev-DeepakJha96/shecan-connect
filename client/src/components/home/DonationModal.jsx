import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import { API_BASE_URL } from '../../services/config.js';

const DonationModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: 500,
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    purpose: 'general',
    isAnonymous: false,
    message: ''
  });

  const API_URL = API_BASE_URL;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDonation = async () => {
    console.log("Sending Data =>", formData);
    if (!formData.donorName || !formData.donorEmail) {
      alert('Please enter your name and email');
      return;
    }

    if (formData.amount < 1) {
      alert('Please enter a valid amount (minimum ₹1)');
      return;
    }

    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const orderResponse = await fetch(`${API_URL}/api/v1/donation/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert(orderData.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'NGO Foundation',
        description: `Donation for ${formData.purpose}`,
        order_id: orderData.data.orderId,
        handler: async (response) => {
          const verifyResponse = await fetch(`${API_URL}/api/v1/donation/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId: orderData.data.donationId
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            alert(`Thank you for your donation of ₹${formData.amount}! Receipt: ${verifyData.data.receiptNumber}`);
            onClose();
            setFormData({
              amount: 500,
              donorName: '',
              donorEmail: '',
              donorPhone: '',
              purpose: 'general',
              isAnonymous: false,
              message: ''
            });
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.donorName,
          email: formData.donorEmail,
          contact: formData.donorPhone,
        },
        theme: { color: '#DB2777' }, // Matches your pink-600
        modal: { ondismiss: () => setLoading(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Donation error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Make a Donation</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition"
            >
              ×
            </button>
          </div>

          <div className="space-y-5">
            {/* Amount Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Donation Amount (₹)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setFormData({ ...formData, amount: amt })}
                    className={`py-2 px-4 rounded-lg border transition-all ${
                      formData.amount === amt
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'border-gray-300 hover:border-pink-600 text-gray-700'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setFormData({ ...formData, amount: amt })}
                    className={`py-2 px-4 rounded-lg border transition-all ${
                      formData.amount === amt
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'border-gray-300 hover:border-pink-600 text-gray-700'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Or enter custom amount"
                min="1"
              />
            </div>

            {/* Donor Details */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="donorEmail"
                value={formData.donorEmail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="donorPhone"
                value={formData.donorPhone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                    Where should your donation go?
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              >
                <option value="general">General Fund (Where most needed)</option>
                <option value="education">Children's Education</option>
                <option value="healthcare">Healthcare & Medical Aid</option>
                <option value="food">Food Distribution</option>
                <option value="emergency">Emergency Relief</option>
              </select>
            </div>

            {/* Anonymous Donation */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4 text-pink-600"
              />
              <label className="text-gray-700">Donate anonymously</label>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Write a message of support..."
              />
            </div>

            {/* Submit Button - Using YOUR Button component */}
            <Button
              variant="primary"
              onClick={handleDonation}
              disabled={loading}
              className="w-full !py-3 !text-lg"
            >
              {loading ? 'Processing...' : `Donate ₹${formData.amount}`}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Secure payment powered by Razorpay. Your donation is safe and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;