import { Patient, Doctor, MRO, Admin, Appointment, Prescription, MedicalDocument } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    email: 'jennifergambo@gmail.com',
    password: 'password123',
    name: 'Jennifer Gambo',
    dob: '1990-05-15',
    gender: 'female',
    phone: '+254712345678',
    role: 'patient',
    status: 'active',
    createdAt: '2024-01-15',
    condition: 'Diabetes Type 2'
  },
  {
    id: 'p2',
    email: 'wanjiku.kamau@email.com',
    password: 'password123',
    name: 'Wanjiku Kamau',
    dob: '1985-08-22',
    gender: 'female',
    phone: '+254723456789',
    role: 'patient',
    status: 'active',
    createdAt: '2024-01-20',
    condition: 'Hypertension'
  },
  {
    id: 'p3',
    email: 'james.ochieng@email.com',
    password: 'password123',
    name: 'James Ochieng',
    dob: '1978-03-10',
    gender: 'male',
    phone: '+254734567890',
    role: 'patient',
    status: 'active',
    createdAt: '2024-02-01'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    email: 'dr.mwangi@clinic.com',
    password: 'doctor123',
    name: 'Dr. Grace Mwangi',
    dob: '1975-11-20',
    gender: 'female',
    phone: '+254700123456',
    role: 'doctor',
    status: 'active',
    createdAt: '2023-06-01',
    specialty: 'Cardiology',
    department: 'Internal Medicine',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: 'd2',
    email: 'dr.omondi@clinic.com',
    password: 'doctor123',
    name: 'Dr. Kevin Omondi',
    dob: '1980-07-15',
    gender: 'male',
    phone: '+254701234567',
    role: 'doctor',
    status: 'active',
    createdAt: '2023-08-15',
    specialty: 'Dermatology',
    department: 'Dermatology',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['10:00', '11:00', '14:00', '15:00']
  },
  {
    id: 'd3',
    email: 'dr.njeri@clinic.com',
    password: 'doctor123',
    name: 'Dr. Faith Njeri',
    dob: '1982-04-08',
    gender: 'female',
    phone: '+254702345678',
    role: 'doctor',
    status: 'active',
    createdAt: '2023-09-01',
    specialty: 'Pediatrics',
    department: 'Pediatrics',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['09:00', '10:00', '11:00', '12:00']
  },
  {
    id: 'd4',
    email: 'dr.kipchoge@clinic.com',
    password: 'doctor123',
    name: 'Dr. Samuel Kipchoge',
    dob: '1970-12-25',
    gender: 'male',
    phone: '+254703456789',
    role: 'doctor',
    status: 'active',
    createdAt: '2023-05-10',
    specialty: 'Orthopedics',
    department: 'Orthopedics',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['08:00', '09:00', '10:00', '14:00', '15:00']
  }
];

export const mockMROs: MRO[] = [
  {
    id: 'm1',
    email: 'mro.akinyi@clinic.com',
    password: 'mro123',
    name: 'Lucy Akinyi',
    dob: '1988-09-12',
    gender: 'female',
    phone: '+254704567890',
    role: 'mro',
    status: 'active',
    createdAt: '2023-04-01',
    department: 'Records'
  }
];

export const mockAdmins: Admin[] = [
  {
    id: 'a1',
    email: 'admin@clinic.com',
    password: 'admin123',
    name: 'Peter Mutua',
    dob: '1985-01-01',
    gender: 'male',
    phone: '+254705678901',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-01'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2025-01-20',
    time: '09:00',
    status: 'completed',
    notes: 'Regular checkup',
    createdAt: '2025-01-15'
  },
  {
    id: 'apt2',
    patientId: 'p2',
    doctorId: 'd1',
    date: '2025-01-25',
    time: '10:00',
    status: 'scheduled',
    notes: 'Blood pressure monitoring',
    createdAt: '2025-01-18'
  },
  {
    id: 'apt3',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2025-01-28',
    time: '14:00',
    status: 'scheduled',
    notes: 'Skin consultation',
    createdAt: '2025-01-20'
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'p1',
    doctorId: 'd1',
    appointmentId: 'apt1',
    medications: 'Metformin 500mg - Take twice daily with meals\nLisinopril 10mg - Take once daily in the morning',
    instructions: 'Monitor blood sugar levels daily. Avoid high-sugar foods. Return for follow-up in 1 month.',
    date: '2025-01-20'
  }
];

export const mockDocuments: MedicalDocument[] = [
  {
    id: 'doc1',
    patientId: 'p1',
    uploadedBy: 'm1',
    uploaderRole: 'mro',
    fileName: 'Blood_Test_Results_Jan2025.pdf',
    description: 'Complete blood count and metabolic panel results',
    date: '2025-01-20'
  },
  {
    id: 'doc2',
    patientId: 'p1',
    uploadedBy: 'p1',
    uploaderRole: 'patient',
    fileName: 'Previous_Hospital_Records.pdf',
    description: 'Medical records from previous hospital visit',
    date: '2025-01-15'
  }
];

export const departments = [
  'Internal Medicine',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Cardiology',
  'Gynecology',
  'Ophthalmology'
];

export const specialties = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'General Medicine',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'Psychiatry'
];
