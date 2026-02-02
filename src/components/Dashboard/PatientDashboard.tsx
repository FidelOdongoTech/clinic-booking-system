import { useState } from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Patient, Doctor } from '@/types';
import { departments } from '@/data/mockData';

export function PatientDashboard() {
  const { 
    currentUser, 
    doctors, 
    getAppointmentsByPatient, 
    getPrescriptionsByPatient, 
    getDocumentsByPatient,
    getDoctorById,
    bookAppointment,
    cancelAppointment,
    uploadDocument
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });
  const [uploadData, setUploadData] = useState({ fileName: '', description: '' });

  const patient = currentUser as Patient;
  const appointments = getAppointmentsByPatient(patient.id);
  const prescriptions = getPrescriptionsByPatient(patient.id);
  const documents = getDocumentsByPatient(patient.id);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.status !== 'scheduled');

  const filteredDoctors = departmentFilter 
    ? doctors.filter(d => d.department === departmentFilter && d.status === 'active')
    : doctors.filter(d => d.status === 'active');

  const handleBookAppointment = () => {
    if (!selectedDoctor || !bookingData.date || !bookingData.time) return;
    
    bookAppointment({
      patientId: patient.id,
      doctorId: selectedDoctor.id,
      date: bookingData.date,
      time: bookingData.time,
      status: 'scheduled',
      notes: bookingData.notes
    });
    
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setBookingData({ date: '', time: '', notes: '' });
  };

  const handleUploadDocument = () => {
    if (!uploadData.fileName) return;
    
    uploadDocument({
      patientId: patient.id,
      uploadedBy: patient.id,
      uploaderRole: 'patient',
      fileName: uploadData.fileName,
      description: uploadData.description,
      date: new Date().toISOString().split('T')[0]
    });
    
    setShowUploadModal(false);
    setUploadData({ fileName: '', description: '' });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {patient.name}!</h1>
        <p className="text-gray-600">Here's an overview of your health activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Upcoming Appointments', value: upcomingAppointments.length, color: 'bg-blue-500' },
          { label: 'Past Appointments', value: pastAppointments.length, color: 'bg-green-500' },
          { label: 'Prescriptions', value: prescriptions.length, color: 'bg-purple-500' },
          { label: 'Documents', value: documents.length, color: 'bg-orange-500' }
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

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <Button size="sm" onClick={() => setActiveTab('doctors')}>Book New</Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.slice(0, 3).map(apt => {
                const doctor = getDoctorById(apt.doctorId);
                return (
                  <div key={apt.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{doctor?.name.charAt(0)}</span>
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
                    <Badge variant="info">Scheduled</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDoctors = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
        <p className="text-gray-600">Browse our specialists and book appointments</p>
      </div>

      <div className="flex gap-4">
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          options={[
            { value: '', label: 'All Departments' },
            ...departments.map(d => ({ value: d, label: d }))
          ]}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id}>
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-medium">{doctor.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-blue-600">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500">{doctor.department}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Available Days:</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.availableDays.slice(0, 3).map(day => (
                    <span key={day} className="text-xs bg-gray-100 px-2 py-1 rounded">{day.slice(0, 3)}</span>
                  ))}
                  {doctor.availableDays.length > 3 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">+{doctor.availableDays.length - 3}</span>
                  )}
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowBookingModal(true);
                }}
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">View and manage your appointments</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No upcoming appointments</p>
              <Button className="mt-4" onClick={() => setActiveTab('doctors')}>Book Appointment</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map(apt => {
              const doctor = getDoctorById(apt.doctorId);
              return (
                <Card key={apt.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{doctor?.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doctor?.name}</p>
                          <p className="text-sm text-gray-500">{doctor?.specialty} - {doctor?.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{apt.date}</p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                        <Badge variant="info">Scheduled</Badge>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => cancelAppointment(apt.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    {apt.notes && (
                      <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{apt.notes}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-900 mt-8">Past Appointments</h2>
        {pastAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No past appointments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map(apt => {
              const doctor = getDoctorById(apt.doctorId);
              return (
                <Card key={apt.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">{doctor?.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doctor?.name}</p>
                          <p className="text-sm text-gray-500">{doctor?.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{apt.date}</p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                        <Badge variant={apt.status === 'completed' ? 'success' : 'danger'}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-600">View your medical prescriptions</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No prescriptions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(rx => {
            const doctor = getDoctorById(rx.doctorId);
            return (
              <Card key={rx.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Prescription from {doctor?.name}</h3>
                      <p className="text-sm text-gray-500">{rx.date}</p>
                    </div>
                    <Badge variant="info">{doctor?.specialty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                      <div className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap text-sm">{rx.medications}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Instructions:</p>
                      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">{rx.instructions}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Documents</h1>
          <p className="text-gray-600">View and upload your medical documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>Upload Document</Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No documents uploaded</p>
            <Button className="mt-4" onClick={() => setShowUploadModal(true)}>Upload First Document</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                    <p className="text-sm text-gray-500">{doc.date}</p>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'doctors': return renderDoctors();
      case 'appointments': return renderAppointments();
      case 'prescriptions': return renderPrescriptions();
      case 'documents': return renderDocuments();
      default: return renderDashboard();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

      {/* Booking Modal */}
      <Modal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        title={`Book Appointment with ${selectedDoctor?.name}`}
      >
        <div className="space-y-4">
          <Input
            label="Appointment Date"
            type="date"
            value={bookingData.date}
            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
          <Select
            label="Time Slot"
            value={bookingData.time}
            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
            options={[
              { value: '', label: 'Select a time slot' },
              ...(selectedDoctor?.availableTimeSlots.map(t => ({ value: t, label: t })) || [])
            ]}
          />
          <Input
            label="Notes (Optional)"
            type="text"
            value={bookingData.notes}
            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
            placeholder="Reason for visit..."
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBookingModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleBookAppointment} className="flex-1">Confirm Booking</Button>
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        title="Upload Medical Document"
      >
        <div className="space-y-4">
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-xs mt-1">PDF, PNG, JPG up to 10MB</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowUploadModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleUploadDocument} className="flex-1">Upload</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
