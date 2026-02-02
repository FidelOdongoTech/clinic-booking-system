import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Patient, Doctor, MRO, Admin, Appointment, Prescription, MedicalDocument, Notification, UserRole } from '../types';
import { mockPatients, mockDoctors, mockMROs, mockAdmins, mockAppointments, mockPrescriptions, mockDocuments } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  patients: Patient[];
  doctors: Doctor[];
  mros: MRO[];
  admins: Admin[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  documents: MedicalDocument[];
  notifications: Notification[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  registerPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'role' | 'status'>) => boolean;
  registerDoctor: (doctor: Omit<Doctor, 'id' | 'createdAt' | 'role' | 'status'>) => void;
  registerMRO: (mro: Omit<MRO, 'id' | 'createdAt' | 'role' | 'status'>) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  uploadDocument: (document: Omit<MedicalDocument, 'id'>) => void;
  updateUserStatus: (userId: string, role: UserRole, status: 'active' | 'inactive') => void;
  updateDoctorAvailability: (doctorId: string, days: string[], timeSlots: string[]) => void;
  getPatientById: (id: string) => Patient | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getPrescriptionsByPatient: (patientId: string) => Prescription[];
  getDocumentsByPatient: (patientId: string) => MedicalDocument[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    patients: mockPatients,
    doctors: mockDoctors,
    mros: mockMROs,
    admins: mockAdmins,
    appointments: mockAppointments,
    prescriptions: mockPrescriptions,
    documents: mockDocuments,
    notifications: []
  });

  const login = useCallback((email: string, password: string, role: UserRole): boolean => {
    let user: User | undefined;
    
    switch (role) {
      case 'patient':
        user = state.patients.find(p => p.email === email && p.password === password);
        break;
      case 'doctor':
        user = state.doctors.find(d => d.email === email && d.password === password);
        break;
      case 'mro':
        user = state.mros.find(m => m.email === email && m.password === password);
        break;
      case 'admin':
        user = state.admins.find(a => a.email === email && a.password === password);
        break;
    }

    if (user && user.status === 'active') {
      setState(prev => ({ ...prev, currentUser: user! }));
      return true;
    }
    return false;
  }, [state.patients, state.doctors, state.mros, state.admins]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, currentUser: null }));
  }, []);

  const registerPatient = useCallback((patientData: Omit<Patient, 'id' | 'createdAt' | 'role' | 'status'>): boolean => {
    const existingPatient = state.patients.find(p => p.email === patientData.email);
    if (existingPatient) return false;

    const newPatient: Patient = {
      ...patientData,
      id: `p${Date.now()}`,
      role: 'patient',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({ ...prev, patients: [...prev.patients, newPatient] }));
    return true;
  }, [state.patients]);

  const registerDoctor = useCallback((doctorData: Omit<Doctor, 'id' | 'createdAt' | 'role' | 'status'>) => {
    const newDoctor: Doctor = {
      ...doctorData,
      id: `d${Date.now()}`,
      role: 'doctor',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({ ...prev, doctors: [...prev.doctors, newDoctor] }));
  }, []);

  const registerMRO = useCallback((mroData: Omit<MRO, 'id' | 'createdAt' | 'role' | 'status'>) => {
    const newMRO: MRO = {
      ...mroData,
      id: `m${Date.now()}`,
      role: 'mro',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({ ...prev, mros: [...prev.mros, newMRO] }));
  }, []);

  const bookAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({ ...prev, appointments: [...prev.appointments, newAppointment] }));
  }, []);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(apt =>
        apt.id === id ? { ...apt, ...updates } : apt
      )
    }));
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(apt =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      )
    }));
  }, []);

  const addPrescription = useCallback((prescriptionData: Omit<Prescription, 'id'>) => {
    const newPrescription: Prescription = {
      ...prescriptionData,
      id: `rx${Date.now()}`
    };
    setState(prev => ({ ...prev, prescriptions: [...prev.prescriptions, newPrescription] }));
  }, []);

  const uploadDocument = useCallback((documentData: Omit<MedicalDocument, 'id'>) => {
    const newDocument: MedicalDocument = {
      ...documentData,
      id: `doc${Date.now()}`
    };
    setState(prev => ({ ...prev, documents: [...prev.documents, newDocument] }));
  }, []);

  const updateUserStatus = useCallback((userId: string, role: UserRole, status: 'active' | 'inactive') => {
    setState(prev => {
      switch (role) {
        case 'patient':
          return { ...prev, patients: prev.patients.map(p => p.id === userId ? { ...p, status } : p) };
        case 'doctor':
          return { ...prev, doctors: prev.doctors.map(d => d.id === userId ? { ...d, status } : d) };
        case 'mro':
          return { ...prev, mros: prev.mros.map(m => m.id === userId ? { ...m, status } : m) };
        case 'admin':
          return { ...prev, admins: prev.admins.map(a => a.id === userId ? { ...a, status } : a) };
        default:
          return prev;
      }
    });
  }, []);

  const updateDoctorAvailability = useCallback((doctorId: string, days: string[], timeSlots: string[]) => {
    setState(prev => ({
      ...prev,
      doctors: prev.doctors.map(d =>
        d.id === doctorId ? { ...d, availableDays: days, availableTimeSlots: timeSlots } : d
      )
    }));
  }, []);

  const getPatientById = useCallback((id: string) => {
    return state.patients.find(p => p.id === id);
  }, [state.patients]);

  const getDoctorById = useCallback((id: string) => {
    return state.doctors.find(d => d.id === id);
  }, [state.doctors]);

  const getAppointmentsByPatient = useCallback((patientId: string) => {
    return state.appointments.filter(apt => apt.patientId === patientId);
  }, [state.appointments]);

  const getAppointmentsByDoctor = useCallback((doctorId: string) => {
    return state.appointments.filter(apt => apt.doctorId === doctorId);
  }, [state.appointments]);

  const getPrescriptionsByPatient = useCallback((patientId: string) => {
    return state.prescriptions.filter(rx => rx.patientId === patientId);
  }, [state.prescriptions]);

  const getDocumentsByPatient = useCallback((patientId: string) => {
    return state.documents.filter(doc => doc.patientId === patientId);
  }, [state.documents]);

  const value: AppContextType = {
    ...state,
    login,
    logout,
    registerPatient,
    registerDoctor,
    registerMRO,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    addPrescription,
    uploadDocument,
    updateUserStatus,
    updateDoctorAvailability,
    getPatientById,
    getDoctorById,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getPrescriptionsByPatient,
    getDocumentsByPatient
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
