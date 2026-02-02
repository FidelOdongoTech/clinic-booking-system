import { useState } from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MRO, Gender } from '@/types';
import { departments, specialties } from '@/data/mockData';

export function MRODashboard() {
  const { 
    currentUser, 
    patients,
    doctors,
    appointments,
    getPatientById,
    getDoctorById,
    uploadDocument,
    registerDoctor,
    registerMRO
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerType, setRegisterType] = useState<'doctor' | 'mro'>('doctor');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [uploadData, setUploadData] = useState({ fileName: '', description: '' });
  const [registerData, setRegisterData] = useState({
    name: '', email: '', password: '', phone: '', dob: '', gender: 'male' as Gender,
    specialty: '', department: ''
  });

  const mro = currentUser as MRO;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');
  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const handleUploadDocument = () => {
    if (!selectedPatientId || !uploadData.fileName) return;
    
    uploadDocument({
      patientId: selectedPatientId,
      uploadedBy: mro.id,
      uploaderRole: 'mro',
      fileName: uploadData.fileName,
      description: uploadData.description,
      date: new Date().toISOString().split('T')[0]
    });
    
    setShowUploadModal(false);
    setUploadData({ fileName: '', description: '' });
    setSelectedPatientId('');
  };

  const handleRegister = () => {
    if (!registerData.name || !registerData.email || !registerData.password) return;

    if (registerType === 'doctor') {
      registerDoctor({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        dob: registerData.dob,
        gender: registerData.gender,
        specialty: registerData.specialty,
        department: registerData.department,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      });
    } else {
      registerMRO({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        dob: registerData.dob,
        gender: registerData.gender,
        department: registerData.department
      });
    }
    
    setShowRegisterModal(false);
    setRegisterData({ name: '', email: '', password: '', phone: '', dob: '', gender: 'male', specialty: '', department: '' });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {mro.name}!</h1>
        <p className="text-gray-600">Medical Record Officer - {mro.department}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: patients.length, color: 'bg-blue-500' },
          { label: 'Total Doctors', value: doctors.length, color: 'bg-green-500' },
          { label: 'Scheduled Appointments', value: scheduledAppointments.length, color: 'bg-purple-500' },
          { label: 'Today\'s Appointments', value: todayAppointments.length, color: 'bg-orange-500' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Upcoming Appointments to Prepare</h2>
        </CardHeader>
        <CardContent>
          {scheduledAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {scheduledAppointments.slice(0, 5).map(apt => {
                const patient = getPatientById(apt.patientId);
                const doctor = getDoctorById(apt.doctorId);
                return (
                  <div key={apt.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{patient?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-500">with {doctor?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{apt.date}</p>
                      <p className="text-sm text-gray-500">{apt.time}</p>
                    </div>
                    <Badge variant="info">Prepare File</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
        <p className="text-gray-600">View and manage all clinic appointments</p>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No appointments found</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map(apt => {
            const patient = getPatientById(apt.patientId);
            const doctor = getDoctorById(apt.doctorId);
            return (
              <Card key={apt.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{patient?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-500">Patient</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium">{doctor?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doctor?.name}</p>
                        <p className="text-sm text-gray-500">{doctor?.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{apt.date}</p>
                      <p className="text-sm text-gray-500">{apt.time}</p>
                    </div>
                    <Badge variant={
                      apt.status === 'scheduled' ? 'info' : 
                      apt.status === 'completed' ? 'success' : 'danger'
                    }>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Patients</h1>
        <p className="text-gray-600">View and manage patient records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => (
          <Card key={patient.id}>
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg font-medium">{patient.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">DOB</p>
                    <p className="font-medium">{patient.dob}</p>
                  </div>
                </div>
                {patient.condition && (
                  <div className="mt-2">
                    <p className="text-gray-500 text-sm">Condition</p>
                    <p className="font-medium text-sm">{patient.condition}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-600">Upload medical documents for patients</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>Upload Document</Button>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Patient Documents</h3>
          <p className="text-gray-500 mb-4">Click the button above to upload scanned diagnoses and medical records</p>
          <Button onClick={() => setShowUploadModal(true)}>Upload New Document</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register Staff</h1>
        <p className="text-gray-600">Register new doctors and medical record officers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setRegisterType('doctor'); setShowRegisterModal(true); }}>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Doctor</h3>
            <p className="text-gray-500">Add a new doctor to the system</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setRegisterType('mro'); setShowRegisterModal(true); }}>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register MRO</h3>
            <p className="text-gray-500">Add a new medical record officer</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'appointments': return renderAppointments();
      case 'patients': return renderPatients();
      case 'documents': return renderDocuments();
      case 'register': return renderRegister();
      default: return renderDashboard();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

      {/* Upload Document Modal */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        title="Upload Medical Document"
      >
        <div className="space-y-4">
          <Select
            label="Select Patient"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            options={[
              { value: '', label: 'Choose a patient' },
              ...patients.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
          <Input
            label="File Name"
            type="text"
            value={uploadData.fileName}
            onChange={(e) => setUploadData({ ...uploadData, fileName: e.target.value })}
            placeholder="e.g., Blood_Test_Results.pdf"
          />
          <Input
            label="Description"
            type="text"
            value={uploadData.description}
            onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
            placeholder="Brief description of the document"
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowUploadModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleUploadDocument} className="flex-1">Upload</Button>
          </div>
        </div>
      </Modal>

      {/* Register Staff Modal */}
      <Modal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        title={registerType === 'doctor' ? 'Register New Doctor' : 'Register New MRO'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            placeholder="Enter full name"
          />
          <Input
            label="Email"
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            placeholder="Enter email address"
          />
          <Input
            label="Password"
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            placeholder="Create password"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={registerData.phone}
              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              placeholder="Phone number"
            />
            <Input
              label="Date of Birth"
              type="date"
              value={registerData.dob}
              onChange={(e) => setRegisterData({ ...registerData, dob: e.target.value })}
            />
          </div>
          <Select
            label="Gender"
            value={registerData.gender}
            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value as Gender })}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
          />
          <Select
            label="Department"
            value={registerData.department}
            onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
            options={[
              { value: '', label: 'Select department' },
              ...departments.map(d => ({ value: d, label: d }))
            ]}
          />
          {registerType === 'doctor' && (
            <Select
              label="Specialty"
              value={registerData.specialty}
              onChange={(e) => setRegisterData({ ...registerData, specialty: e.target.value })}
              options={[
                { value: '', label: 'Select specialty' },
                ...specialties.map(s => ({ value: s, label: s }))
              ]}
            />
          )}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowRegisterModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleRegister} className="flex-1">Register</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
