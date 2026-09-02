import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([
    { id: 'd1', name: 'Dr. Smith', phone: '9999999999', license: 'LIC123', education: 'MBBS, MD', specialization: 'General Medicine' },
    { id: 'd2', name: 'Dr. Sharma', phone: '8888888888', license: 'AYU456', education: 'BAMS', specialization: 'Ayurveda' }
  ]);
  const [receptionists, setReceptionists] = useState([
    { id: 'r1', name: 'Alice', phone: '8888888888', email: 'alice@hospital.com' }
  ]);
  const [patients, setPatients] = useState([
    { id: 'p1', name: 'John Doe', phone: '9876543210', abhaId: '12-3456-7890-1234', age: 45, gender: 'Male', address: '123 Main St', history: [] }
  ]);
  
  // The queue now holds the structured intake from the Kiosk
  const [queue, setQueue] = useState([]); 
  /* queue item structure:
    {
      id: string,
      patientId: string,
      doctorId: string,
      status: 'waiting',
      intake: {
        mode: 'Allopathic' | 'AYUSH',
        chiefComplaint: string[],
        hpi: string, // voice transcript
        ayushData: { prakriti: string, agni: string, koshtha: string },
        redFlags: string[],
        documents: string[] // mock file names
      }
    }
  */

  // Admin Actions
  const addDoctor = (doc) => setDoctors([...doctors, { ...doc, id: Date.now().toString() }]);
  const deleteDoctor = (id) => setDoctors(doctors.filter(d => d.id !== id));
  
  const addReceptionist = (rec) => setReceptionists([...receptionists, { ...rec, id: Date.now().toString() }]);
  const deleteReceptionist = (id) => setReceptionists(receptionists.filter(r => r.id !== id));

  // Patient / Kiosk Actions
  const addPatient = (patient) => {
    const newPatient = { ...patient, id: Date.now().toString(), history: [] };
    setPatients([...patients, newPatient]);
    return newPatient;
  };

  const submitKioskIntake = (patientId, doctorId, intakeData) => {
    setQueue([...queue, {
      id: Date.now().toString(),
      patientId,
      doctorId,
      status: 'waiting',
      intake: intakeData,
      timestamp: new Date().toISOString()
    }]);
  };

  // Doctor Actions
  const completeConsultation = (queueId, patientId, notes, prescription) => {
    const intake = queue.find(q => q.id === queueId)?.intake;
    setQueue(queue.filter(q => q.id !== queueId));
    
    setPatients(patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          history: [...p.history, {
            date: new Date().toISOString().split('T')[0],
            doctor: 'Attending Doctor',
            intakeSummary: intake, // saved structured intake
            symptomsText: notes,
            prescription: prescription
          }]
        };
      }
      return p;
    }));
  };

  const updatePatientProfile = (patientId, updates) => {
    setPatients(patients.map(p => p.id === patientId ? { ...p, ...updates } : p));
  };

  return (
    <GlobalContext.Provider value={{
      doctors, receptionists, patients, queue,
      addDoctor, deleteDoctor, addReceptionist, deleteReceptionist,
      addPatient, submitKioskIntake, completeConsultation, updatePatientProfile
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
