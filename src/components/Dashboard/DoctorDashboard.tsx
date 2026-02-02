import { useState } from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Doctor, Patient, Appointment } from '@/types';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const allTimeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function DoctorDashboard() {
  const { 
    currentUser, 
    getAppointmentsByDoctor, 
    getPatientById,
    updateAppointment,
    updateDoctorAvailability,
    addPrescription,
    getDocumentsByPatient
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptionData, setPrescriptionData] = useState({ medications: '', instructions: '' });
  const [availability, setAvailability] = useState({ days: [] as string[], times: [] as string[] });

  const doctor = currentUser as Doctor;
  const appointments = getAppointmentsByDoctor(doctor.id);
  
  const todayAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  
  // Get unique patient IDs from appointments
  const patientIds = [...new Set(appointments.map(a => a.patientId))];
  const myPatients = patientIds.map(id => getPatientById(id)).filter(Boolean) as Patient[];

  const handleCompleteAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setSelectedPatient(getPatientById(apt.patientId) || null);
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = () => {
    if (!selectedAppointment || !prescriptionData.medications) return;
    
    addPrescription({
      patientId: selectedAppointment.patientId,
      doctorId: doctor.id,
      appointmentId: selectedAppointment.id,
      medications: prescriptionData.medications,
      instructions: prescriptionData.instructions,
      date: new Date().toISOString().split('T')[0]
    });
    
    updateAppointment(selectedAppointment.id, { status: 'completed' });
    setShowPrescriptionModal(false);
    setPrescriptionData({ medications: '', instructions: '' });
    setSelectedAppointment(null);
  };

  const handleUpdateAvailability = () => {
    updateDoctorAvailability(doctor.id, availability.days, availability.times);
    setShowAvailabilityModal(false);
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const toggleTime = (time: string) => {
    setAvailability(prev => ({
      ...prev,
      times: prev.times.includes(time) ? prev.times.filter(t => t !== time) : [...prev.times, time]
    }));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {doctor.name}!</h1>
        <p className="text-gray-600">{doctor.specialty} - {doctor.department}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Appointments', value: todayAppointments.length, color: 'bg-blue-500' },
          { label: 'Total Patients', value: myPatients.length, color: 'bg-green-500' },
          { label: 'Completed', value: completedAppointments.length, color: 'bg-purple-500' },
          { label: 'Available Days', value: doctor.availableDays.length, color: 'bg-orange-500' }
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
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {todayAppointments.slice(0, 5).map(apt => {
                const patient = getPatientById(apt.patientId);
                return (
                  <div key={apt.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium">{patient?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-500">{patient?.condition || 'No condition specified'}</p>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-medium text-gray-900">{apt.date}</p>
                      <p className="text-sm text-gray-500">{apt.time}</p>
                    </div>
                    <Button size="sm" onClick={() => handleCompleteAppointment(apt)}>Complete</Button>
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
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Scheduled Appointments</h2>
        {todayAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No scheduled appointments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map(apt => {
              const patient = getPatientById(apt.patientId);
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
                          <p className="text-sm text-gray-500">{patient?.email}</p>
                          <p className="text-sm text-gray-500">Condition: {patient?.condition || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{apt.date}</p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                        <Badge variant="info">Scheduled</Badge>
                        <Button size="sm" onClick={() => handleCompleteAppointment(apt)}>
                          Complete & Prescribe
                        </Button>
                      </div>
                    </div>
                    {apt.notes && <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{apt.notes}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <h2 className="text-lg font-semibold mt-8">Completed Appointments</h2>
        {completedAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No completed appointments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedAppointments.map(apt => {
              const patient = getPatientById(apt.patientId);
              return (
                <Card key={apt.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">{patient?.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient?.name}</p>
                          <p className="text-sm text-gray-500">{patient?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{apt.date}</p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                        <Badge variant="success">Completed</Badge>
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

  const renderPatients = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
        <p className="text-gray-600">View patient details and medical history</p>
      </div>

      {myPatients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No patients yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myPatients.map(patient => {
            const patientDocs = getDocumentsByPatient(patient.id);
            const patientApts = appointments.filter(a => a.patientId === patient.id);
            return (
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
                    <Badge variant={patient.status === 'active' ? 'success' : 'default'}>
                      {patient.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{patientApts.length}</p>
                      <p className="text-xs text-gray-500">Visits</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{patientDocs.length}</p>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{patient.condition || 'N/A'}</p>
                      <p className="text-xs text-gray-500">Condition</p>
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

  const renderAvailability = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Availability</h1>
          <p className="text-gray-600">Set your available days and time slots for booking</p>
        </div>
        <Button onClick={() => {
          setAvailability({ days: doctor.availableDays, times: doctor.availableTimeSlots });
          setShowAvailabilityModal(true);
        }}>
          Edit Availability
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Available Days</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {doctor.availableDays.length === 0 ? (
                <p className="text-gray-500">No days set</p>
              ) : (
                doctor.availableDays.map(day => (
                  <Badge key={day} variant="info">{day}</Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Time Slots</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {doctor.availableTimeSlots.length === 0 ? (
                <p className="text-gray-500">No time slots set</p>
              ) : (
                doctor.availableTimeSlots.map(time => (
                  <Badge key={time} variant="success">{time}</Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-600">View and manage prescriptions you've written</p>
      </div>

      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Complete an appointment to add prescriptions</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'appointments': return renderAppointments();
      case 'patients': return renderPatients();
      case 'availability': return renderAvailability();
      case 'prescriptions': return renderPrescriptions();
      default: return renderDashboard();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

      {/* Prescription Modal */}
      <Modal 
        isOpen={showPrescriptionModal} 
        onClose={() => setShowPrescriptionModal(false)}
        title={`Write Prescription for ${selectedPatient?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
            <textarea
              value={prescriptionData.medications}
              onChange={(e) => setPrescriptionData({ ...prescriptionData, medications: e.target.value })}
              placeholder="Enter medications with dosage..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              value={prescriptionData.instructions}
              onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })}
              placeholder="Enter instructions for the patient..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowPrescriptionModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSavePrescription} className="flex-1">Complete & Save</Button>
          </div>
        </div>
      </Modal>

      {/* Availability Modal */}
      <Modal 
        isOpen={showAvailabilityModal} 
        onClose={() => setShowAvailabilityModal(false)}
        title="Edit Availability"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {allDays.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    availability.days.includes(day)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Time Slots</label>
            <div className="flex flex-wrap gap-2">
              {allTimeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => toggleTime(time)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    availability.times.includes(time)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAvailabilityModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleUpdateAvailability} className="flex-1">Save Availability</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
