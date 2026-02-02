export type UserRole = 'patient' | 'doctor' | 'mro' | 'admin';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  dob: string;
  gender: Gender;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Patient extends User {
  role: 'patient';
  condition?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  department: string;
  availableDays: string[];
  availableTimeSlots: string[];
  papers?: string;
}

export interface MRO extends User {
  role: 'mro';
  department: string;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medications: string;
  instructions: string;
  date: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  uploadedBy: string;
  uploaderRole: 'patient' | 'mro';
  fileName: string;
  description: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system';
  read: boolean;
  date: string;
}
