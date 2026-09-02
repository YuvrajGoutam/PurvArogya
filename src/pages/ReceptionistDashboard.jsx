import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, UserPlus, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { patients, doctors, queue, addPatient, forwardToDoctor } = useGlobal();
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'add'

  // Add Patient States
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [patientDetails, setPatientDetails] = useState({ name: '', age: '', gender: 'Male', address: '' });

  // Forwarding State
  const [selectedDoc, setSelectedDoc] = useState('');

  const handleSendOtp = (e) => { e.preventDefault(); setStep(2); };
  const handleVerifyOtp = (e) => { e.preventDefault(); setStep(3); };
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    addPatient({ ...patientDetails, phone });
    setStep(1); setPhone(''); setOtp(''); setPatientDetails({ name: '', age: '', gender: 'Male', address: '' });
    setActiveTab('queue');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-brand-900 text-white flex flex-col">
        <div className="p-6 flex items-center border-b border-brand-800">
          <img src="/logo.svg" alt="PurvArogya" className="w-8 h-8 mr-3 drop-shadow-md" />
          <span className="text-lg font-bold">PurvArogya</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('queue')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'queue' ? 'bg-brand-800' : 'hover:bg-brand-800/50'}`}>
            <Activity className="w-5 h-5 mr-3" /> Dashboard & Queue
          </button>
          <button onClick={() => setActiveTab('add')} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'add' ? 'bg-brand-800' : 'hover:bg-brand-800/50'}`}>
            <UserPlus className="w-5 h-5 mr-3" /> Add / Walk-in
          </button>
        </nav>
        <div className="p-4 border-t border-brand-800">
          <button onClick={() => navigate('/')} className="flex items-center w-full px-4 py-3 hover:bg-brand-800/50 rounded-lg transition-colors text-red-300 hover:text-red-200">
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Management</h1>

        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registered Patients List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800">
                Registered Patients Directory
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {patients.map(p => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{p.name} <span className="text-sm font-normal text-gray-500">({p.age}, {p.gender})</span></p>
                      <p className="text-sm text-gray-500">Phone: {p.phone}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                      <select 
                        onChange={(e) => setSelectedDoc(e.target.value)} 
                        className="text-sm border-gray-300 rounded p-1.5 border"
                      >
                        <option value="">Select Doctor...</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                      </select>
                      <button 
                        onClick={() => {
                          if(!selectedDoc) return alert('Select doctor first!');
                          forwardToDoctor(p.id, selectedDoc);
                          setSelectedDoc('');
                        }}
                        className="bg-accent-600 text-white text-sm px-3 py-1.5 rounded hover:bg-accent-700"
                      >
                        Forward
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Queue */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800">
                Live Doctor Queues
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {queue.length === 0 ? <p className="text-gray-500 text-center py-4">No patients in queue.</p> : null}
                {queue.map(q => {
                  const pat = patients.find(pt => pt.id === q.patientId);
                  const doc = doctors.find(dt => dt.id === q.doctorId);
                  return (
                    <div key={q.id} className="bg-brand-50 border border-brand-100 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-brand-900">{pat?.name}</p>
                        <p className="text-sm text-brand-700">Waiting for: {doc?.name}</p>
                      </div>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">Waiting</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">New Patient Registration</h2>
            
            {/* Steps indicator */}
            <div className="flex justify-between items-center mb-8 px-4 relative">
              <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-accent-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
              ))}
            </div>

            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className="block text-sm font-medium">Patient Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">+91</span>
                  <input type="tel" maxLength={10} required value={phone} onChange={e=>setPhone(e.target.value)} className="flex-1 block w-full p-2.5 border border-gray-300 rounded-r-md" placeholder="Enter number..." />
                </div>
                <button type="submit" className="w-full bg-accent-600 text-white rounded p-3 font-medium hover:bg-accent-700">Send OTP for Verification</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <label className="block text-sm font-medium">Enter OTP sent to {phone}</label>
                <input type="text" maxLength={6} required value={otp} onChange={e=>setOtp(e.target.value)} className="block w-full p-2.5 text-center tracking-widest font-bold border border-gray-300 rounded-md" placeholder="••••••" />
                <button type="submit" className="w-full bg-accent-600 text-white rounded p-3 font-medium hover:bg-accent-700">Verify OTP</button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleRegisterPatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium">Full Name</label>
                    <input type="text" required value={patientDetails.name} onChange={e=>setPatientDetails({...patientDetails, name: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Age</label>
                    <input type="number" required value={patientDetails.age} onChange={e=>setPatientDetails({...patientDetails, age: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select value={patientDetails.gender} onChange={e=>setPatientDetails({...patientDetails, gender: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium">Address</label>
                    <textarea required value={patientDetails.address} onChange={e=>setPatientDetails({...patientDetails, address: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded"></textarea>
                  </div>
                </div>
                <button type="submit" className="w-full bg-accent-600 text-white rounded p-3 font-medium hover:bg-accent-700">Save Patient Profile</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
