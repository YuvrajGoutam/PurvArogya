import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowLeft, Shield, ArrowRight } from 'lucide-react';

export default function PatientLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const handleSendOtp = (e) => {
    e.preventDefault();
    if(phone.length >= 10) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if(otp.length === 6) {
      navigate('/patient-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Portal
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-brand-900 px-8 py-8 text-white text-center">
          <div className="inline-flex justify-center mb-4">
            <img src="/logo.svg" alt="PurvArogya" className="w-16 h-16 drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-semibold">PurvArogya Patient Portal</h2>
          <p className="text-brand-100 mt-2 text-sm">Access your medical history securely</p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                  <p className="text-xs text-slate-500 mb-3">Please enter your registered mobile number to receive a secure OTP.</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-medium border-r pr-2 border-slate-300">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      required
                      className="block w-full pl-16 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-lg tracking-wider font-medium" 
                      placeholder="00000 00000" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={phone.length < 10}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Get OTP
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
                  <p className="text-xs text-slate-500 mb-3">We have sent a 6-digit code to +91 {phone}. <button type="button" onClick={() => setStep(1)} className="text-brand-600 hover:underline">Edit</button></p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-lg tracking-widest font-bold text-center" 
                      placeholder="••••••" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={otp.length < 6}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all"
                >
                  Verify & Secure Login
                </button>
                
                <div className="text-center">
                  <button type="button" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
                    Resend OTP
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
