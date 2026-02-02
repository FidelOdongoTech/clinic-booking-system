import { useState } from 'react';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Admin, Gender, UserRole } from '@/types';
import { departments, specialties } from '@/data/mockData';

export function AdminDashboard() {
  const { 
    currentUser, 
    patients,
    doctors,
    mros,
    admins,
    appointments,
    getPatientById,
    getDoctorById,
    updateUserStatus,
    registerDoctor,
    registerMRO
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerType, setRegisterType] = useState<'doctor' | 'mro'>('doctor');
  const [userFilter, setUserFilter] = useState<UserRole | 'all'>('all');
  const [registerData, setRegisterData] = useState({
    name: '', email: '', password: '', phone: '', dob: '', gender: 'male' as Gender,
    specialty: '', department: ''
  });

  const admin = currentUser as Admin;
  const allUsers = [...patients, ...doctors, ...mros, ...admins.filter(a => a.id !== admin.id)];
  const filteredUsers = userFilter === 'all' ? allUsers : allUsers.filter(u => u.role === userFilter);
  
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

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

  const handleToggleStatus = (userId: string, role: UserRole, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateUserStatus(userId, role, newStatus);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'patient': return 'Patient';
      case 'doctor': return 'Doctor';
      case 'mro': return 'MRO';
      case 'admin': return 'Admin';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: patients.length, color: 'bg-blue-500' },
          { label: 'Total Doctors', value: doctors.length, color: 'bg-green-500' },
          { label: 'Total MROs', value: mros.length, color: 'bg-purple-500' },
          { label: 'Total Appointments', value: appointments.length, color: 'bg-orange-500' }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Appointment Statistics</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Scheduled</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${appointments.length ? (scheduledAppointments.length / appointments.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="font-medium w-8">{scheduledAppointments.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${appointments.length ? (completedAppointments.length / appointments.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="font-medium w-8">{completedAppointments.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cancelled</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${appointments.length ? (cancelledAppointments.length / appointments.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="font-medium w-8">{cancelledAppointments.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(-5).reverse().map(apt => {
                const patient = getPatientById(apt.patientId);
                const doctor = getDoctorById(apt.doctorId);
                return (
                  <div key={apt.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{patient?.name}</span> booked with <span className="font-medium">{doctor?.name}</span>
                      </p>
                      <p className="text-xs text-gray-500">{apt.date} at {apt.time}</p>
                    </div>
                    <Badge variant={apt.status === 'scheduled' ? 'info' : apt.status === 'completed' ? 'success' : 'danger'}>
                      {apt.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">View and manage all system users</p>
        </div>
        <div className="flex gap-4">
          <Select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value as UserRole | 'all')}
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'patient', label: 'Patients' },
              { value: 'doctor', label: 'Doctors' },
              { value: 'mro', label: 'MROs' },
              { value: 'admin', label: 'Admins' }
            ]}
            className="w-40"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      user.role === 'doctor' ? 'info' :
                      user.role === 'patient' ? 'success' :
                      user.role === 'mro' ? 'warning' : 'default'
                    }>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant={user.status === 'active' ? 'danger' : 'primary'}
                      onClick={() => handleToggleStatus(user.id, user.role, user.status)}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
        <p className="text-gray-600">View all system appointments</p>
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
                        <p className="text-sm text-gray-500">{patient?.email}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <svg className="w-4 h-4 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
        <p className="text-gray-600">Analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Users by Role</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Patients', count: patients.length, color: 'bg-blue-500' },
                { label: 'Doctors', count: doctors.length, color: 'bg-green-500' },
                { label: 'MROs', count: mros.length, color: 'bg-purple-500' },
                { label: 'Admins', count: admins.length, color: 'bg-orange-500' }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Appointments by Status</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Scheduled', count: scheduledAppointments.length, color: 'bg-blue-500' },
                { label: 'Completed', count: completedAppointments.length, color: 'bg-green-500' },
                { label: 'Cancelled', count: cancelledAppointments.length, color: 'bg-red-500' }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Active vs Inactive Users</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">Active</span>
                </div>
                <span className="font-semibold">{allUsers.filter(u => u.status === 'active').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-600">Inactive</span>
                </div>
                <span className="font-semibold">{allUsers.filter(u => u.status === 'inactive').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register Staff</h1>
        <p className="text-gray-600">Add new doctors and medical record officers to the system</p>
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
      case 'users': return renderUsers();
      case 'appointments': return renderAppointments();
      case 'reports': return renderReports();
      case 'register': return renderRegister();
      default: return renderDashboard();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

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
