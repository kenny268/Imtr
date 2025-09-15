'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUsers, 
  HiUser,
  HiAcademicCap, 
  HiUserGroup, 
  HiBookOpen, 
  HiCollection, 
  HiCurrencyDollar, 
  HiLibrary, 
  HiChartBar, 
  HiCog,
  HiTrendingUp,
  HiClock,
  HiCheckCircle,
  HiPlus,
  HiEye,
  HiPencil,
  HiTrash,
  HiRefresh,
  HiSearch,
  HiSortAscending,
  HiSortDescending,
  HiViewGrid,
  HiViewList,
  HiFilter,
  HiChevronDown
} from 'react-icons/hi';
import { useAuth } from '@/app/lib/auth-context';
import { api } from '@/app/lib/api';
import CreateUserModal from '@/app/components/modals/CreateUserModal';
import StudentApprovalModal from '@/app/components/modals/StudentApprovalModal';
import ViewUserModal from '@/app/components/modals/ViewUserModal';
import EditUserModal from '@/app/components/modals/EditUserModal';
import DeleteUserModal from '@/app/components/modals/DeleteUserModal';
import CreateProgramModal from '@/app/components/modals/CreateProgramModal';
import CreateCourseModal from '@/app/components/modals/CreateCourseModal';
import ViewProgramModal from '@/app/components/modals/ViewProgramModal';
import EditProgramModal from '@/app/components/modals/EditProgramModal';
import DeleteProgramModal from '@/app/components/modals/DeleteProgramModal';
import StudentsSection from './StudentsSection';
import UserManagementSection from './UserManagementSection';
import ProgramsSection from './ProgramsSection';
import CoursesSection from './CoursesSection';

const AdminDashboard = ({ activeMenu }) => {
  const { hasPermission } = useAuth();
  const [students, setStudents] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Modal states for user management
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Modal states for programs and courses
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showViewProgramModal, setShowViewProgramModal] = useState(false);
  const [showEditProgramModal, setShowEditProgramModal] = useState(false);
  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalUsers: 0,
    pendingApprovals: 0
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });
  const [approvalPagination, setApprovalPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });
  const [userPagination, setUserPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });
  const [programPagination, setProgramPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  });
  const [coursePagination, setCoursePagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  });

  // Advanced filtering and sorting states
  const [studentFilters, setStudentFilters] = useState({
    search: '',
    year: '',
    program: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [studentViewMode, setStudentViewMode] = useState('table'); // 'table' or 'grid'
  const [showStudentFilters, setShowStudentFilters] = useState(false);

  // User management filters and view mode
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
    status: '',
    emailVerified: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [userViewMode, setUserViewMode] = useState('table'); // 'table' or 'grid'

  // Program management filters and view mode
  const [programFilters, setProgramFilters] = useState({
    search: '',
    level: '',
    status: '',
    department: '',
    faculty: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [programViewMode, setProgramViewMode] = useState('table'); // 'table' or 'grid'

  // Course management filters and view mode
  const [courseFilters, setCourseFilters] = useState({
    search: '',
    program_id: '',
    semester: '',
    year: '',
    course_type: '',
    status: '',
    is_offered: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [courseViewMode, setCourseViewMode] = useState('table'); // 'table' or 'grid'

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const [studentsRes, usersRes, approvalsRes] = await Promise.all([
        api.get('/students?page=1&limit=1'),
        api.get('/users?page=1&limit=1'),
        api.get('/student-approvals/pending-registrations?page=1&limit=1')
      ]);

      setDashboardStats({
        totalStudents: studentsRes.data.data.pagination?.total || 0,
        totalLecturers: usersRes.data.data.users?.filter(u => u.role === 'LECTURER').length || 0,
        totalUsers: usersRes.data.data.pagination?.total || 0,
        pendingApprovals: approvalsRes.data.data.pagination?.total || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const stats = [
    { label: 'Total Students', value: dashboardStats.totalStudents.toString(), icon: HiAcademicCap, change: '+12%', color: 'text-blue-600' },
    { label: 'Total Lecturers', value: dashboardStats.totalLecturers.toString(), icon: HiUserGroup, change: '+5%', color: 'text-green-600' },
    { label: 'Total Users', value: dashboardStats.totalUsers.toString(), icon: HiUsers, change: '+8%', color: 'text-purple-600' },
    { label: 'Pending Approvals', value: dashboardStats.pendingApprovals.toString(), icon: HiClock, change: '+15%', color: 'text-yellow-600' },
  ];

  // Fetch students with filters (from users endpoint with role filter)
  const fetchStudents = async (page = 1, filters = studentFilters) => {
    if (!hasPermission('students:read')) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        role: 'STUDENT', // Filter for students only
        ...(filters.search && { search: filters.search }),
        ...(filters.year && { year: filters.year }),
        ...(filters.program && { program: filters.program }),
        ...(filters.status && { status: filters.status }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await api.get(`/users?${queryParams}`);
      if (response.data.success) {
        // Transform users to students format for display
        const studentUsers = response.data.data.users || [];
        setStudents(studentUsers);
        setPagination(response.data.data.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleStudentFilterChange = (key, value) => {
    const newFilters = { ...studentFilters, [key]: value };
    setStudentFilters(newFilters);
    fetchStudents(1, newFilters);
  };

  // Refresh students
  const refreshStudents = () => {
    fetchStudents(pagination.current_page, studentFilters);
  };

  // Fetch programs
  const fetchPrograms = async (page = 1, filters = programFilters) => {
    if (!hasPermission('programs:read')) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.search && { search: filters.search }),
        ...(filters.level && { level: filters.level }),
        ...(filters.status && { status: filters.status }),
        ...(filters.department && { department: filters.department }),
        ...(filters.faculty && { faculty: filters.faculty }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await api.get(`/programs?${queryParams}`);
      if (response.data.success) {
        setPrograms(response.data.data.programs || []);
        setProgramPagination(response.data.data.pagination || programPagination);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle program filter changes
  const handleProgramFilterChange = (key, value) => {
    const newFilters = { ...programFilters, [key]: value };
    setProgramFilters(newFilters);
    fetchPrograms(1, newFilters);
  };

  // Refresh programs
  const refreshPrograms = () => {
    fetchPrograms(programPagination.current_page, programFilters);
  };

  // Fetch courses
  const fetchCourses = async (page = 1, filters = courseFilters) => {
    if (!hasPermission('courses:read')) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.search && { search: filters.search }),
        ...(filters.program_id && { program_id: filters.program_id }),
        ...(filters.semester && { semester: filters.semester }),
        ...(filters.year && { year: filters.year }),
        ...(filters.course_type && { course_type: filters.course_type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.is_offered !== '' && { is_offered: filters.is_offered }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await api.get(`/courses?${queryParams}`);
      if (response.data.success) {
        setCourses(response.data.data.courses || []);
        setCoursePagination(response.data.data.pagination || coursePagination);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle course filter changes
  const handleCourseFilterChange = (key, value) => {
    const newFilters = { ...courseFilters, [key]: value };
    setCourseFilters(newFilters);
    fetchCourses(1, newFilters);
  };

  // Refresh courses
  const refreshCourses = () => {
    fetchCourses(coursePagination.current_page, courseFilters);
  };

  // Fetch pending registrations
  const fetchPendingRegistrations = async (page = 1) => {
    if (!hasPermission('students:write')) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/student-approvals/pending-registrations?page=${page}&limit=10`);
      if (response.data.success) {
        setPendingRegistrations(response.data.data.registrations || []);
        setApprovalPagination(response.data.data.pagination || approvalPagination);
      }
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approve student registration
  const handleApproveStudent = async (userId, approvalData) => {
    try {
      const response = await api.post(`/student-approvals/approve/${userId}`, approvalData);
      if (response.data.success) {
        // Refresh both lists
        await fetchStudents();
        await fetchPendingRegistrations();
        setShowApprovalModal(false);
        setSelectedStudent(null);
      }
    } catch (error) {
      throw error;
    }
  };

  // Reject student registration
  const handleRejectStudent = async (userId, rejectionReason) => {
    try {
      const response = await api.post(`/student-approvals/reject/${userId}`, {
        rejection_reason: rejectionReason
      });
      if (response.data.success) {
        // Refresh pending registrations
        await fetchPendingRegistrations();
        setShowApprovalModal(false);
        setSelectedStudent(null);
      }
    } catch (error) {
      throw error;
    }
  };

  // Open approval modal
  const openApprovalModal = (student) => {
    setSelectedStudent(student);
    setShowApprovalModal(true);
  };

  // Fetch users with filters
  const fetchUsers = async (page = 1, filters = userFilters) => {
    if (!hasPermission('users:read')) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.emailVerified && { email_verified: filters.emailVerified }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await api.get(`/users?${queryParams}`);
      if (response.data.success) {
        setUsers(response.data.data.users || []);
        setUserPagination(response.data.data.pagination || userPagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user filter changes
  const handleUserFilterChange = (key, value) => {
    const newFilters = { ...userFilters, [key]: value };
    setUserFilters(newFilters);
    fetchUsers(1, newFilters);
  };

  // Refresh users
  const refreshUsers = () => {
    fetchUsers(userPagination.current_page, userFilters);
  };

  // Load data when menu is active
  useEffect(() => {
    if (activeMenu === 'dashboard') {
      fetchDashboardStats();
    } else if (activeMenu === 'students') {
      fetchStudents();
    } else if (activeMenu === 'student-approvals') {
      fetchPendingRegistrations();
    } else if (activeMenu === 'users') {
      fetchUsers();
    } else if (activeMenu === 'programs') {
      fetchPrograms();
    } else if (activeMenu === 'courses') {
      fetchCourses();
    }
  }, [activeMenu]);

  const recentActivities = [
    { id: 1, action: 'New student enrolled', user: 'John Doe', time: '2 hours ago', type: 'enrollment' },
    { id: 2, action: 'Course created', user: 'Dr. Smith', time: '4 hours ago', type: 'course' },
    { id: 3, action: 'Payment received', user: 'Jane Wilson', time: '6 hours ago', type: 'payment' },
    { id: 4, action: 'User role updated', user: 'Admin', time: '8 hours ago', type: 'admin' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-brand-100">Here's what's happening at IMTR today.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <HiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {stat.change} from last month
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
                        <HiCheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowCreateUserModal(true)}
                    className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
                  >
                    <HiUsers className="h-6 w-6 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-brand-900 dark:text-brand-100">
                      Add User
                    </p>
                  </button>
                  <button className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <HiBookOpen className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Create Course
                    </p>
                  </button>
                  <button className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <HiChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      View Reports
                    </p>
                  </button>
                  <button className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                    <HiCog className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Settings
                    </p>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'users':
        return (
          <>
            <UserManagementSection
              users={users}
              loading={loading}
              userPagination={userPagination}
              userFilters={userFilters}
              userViewMode={userViewMode}
              hasPermission={hasPermission}
              setShowCreateUserModal={setShowCreateUserModal}
              handleUserFilterChange={handleUserFilterChange}
              refreshUsers={refreshUsers}
              fetchUsers={fetchUsers}
              setUserViewMode={setUserViewMode}
            />
            <CreateUserModal
              isOpen={showCreateUserModal}
              onClose={() => setShowCreateUserModal(false)}
            />
          </>
        );

      case 'programs':
        return (
          <>
            <ProgramsSection
              programs={programs}
              loading={loading}
              pagination={programPagination}
              programFilters={programFilters}
              programViewMode={programViewMode}
              hasPermission={hasPermission}
              setShowCreateProgramModal={setShowCreateProgramModal}
              setShowViewModal={setShowViewProgramModal}
              setShowEditModal={setShowEditProgramModal}
              setShowDeleteModal={setShowDeleteProgramModal}
              setSelectedProgram={setSelectedProgram}
              handleProgramFilterChange={handleProgramFilterChange}
              refreshPrograms={refreshPrograms}
              fetchPrograms={fetchPrograms}
              setProgramViewMode={setProgramViewMode}
            />
            <CreateProgramModal
              isOpen={showCreateProgramModal}
              onClose={() => setShowCreateProgramModal(false)}
              onSuccess={() => {
                refreshPrograms();
                setShowCreateProgramModal(false);
              }}
            />
            <ViewProgramModal
              isOpen={showViewProgramModal}
              onClose={() => {
                setShowViewProgramModal(false);
                setSelectedProgram(null);
              }}
              program={selectedProgram}
            />
            <EditProgramModal
              isOpen={showEditProgramModal}
              onClose={() => {
                setShowEditProgramModal(false);
                setSelectedProgram(null);
              }}
              program={selectedProgram}
              onSave={async (programData) => {
                try {
                  await refreshPrograms();
                  setShowEditProgramModal(false);
                  setSelectedProgram(null);
                } catch (error) {
                  console.error('Failed to refresh programs:', error);
                }
              }}
            />
            <DeleteProgramModal
              isOpen={showDeleteProgramModal}
              onClose={() => {
                setShowDeleteProgramModal(false);
                setSelectedProgram(null);
              }}
              program={selectedProgram}
              onDelete={async (program) => {
                try {
                  await refreshPrograms();
                  setShowDeleteProgramModal(false);
                  setSelectedProgram(null);
                } catch (error) {
                  console.error('Failed to refresh programs:', error);
                }
              }}
            />
          </>
        );

      case 'courses':
        return (
          <>
            <CoursesSection
              courses={courses}
              loading={loading}
              pagination={coursePagination}
              courseFilters={courseFilters}
              courseViewMode={courseViewMode}
              hasPermission={hasPermission}
              setShowCreateCourseModal={setShowCreateCourseModal}
              setShowViewModal={setShowViewModal}
              setShowEditModal={setShowEditModal}
              setShowDeleteModal={setShowDeleteModal}
              setSelectedCourse={setSelectedCourse}
              handleCourseFilterChange={handleCourseFilterChange}
              refreshCourses={refreshCourses}
              fetchCourses={fetchCourses}
              setCourseViewMode={setCourseViewMode}
            />
            <CreateCourseModal
              isOpen={showCreateCourseModal}
              onClose={() => setShowCreateCourseModal(false)}
              onSuccess={() => {
                refreshCourses();
                setShowCreateCourseModal(false);
              }}
            />
          </>
        );

      case 'students':
        return (
        <>
          <StudentsSection
            students={students}
            loading={loading}
            pagination={pagination}
            studentFilters={studentFilters}
            studentViewMode={studentViewMode}
            hasPermission={hasPermission}
            setShowCreateUserModal={setShowCreateUserModal}
            handleStudentFilterChange={handleStudentFilterChange}
            refreshStudents={refreshStudents}
            fetchStudents={fetchStudents}
            setStudentViewMode={setStudentViewMode}
            // Approval workflow props
            pendingRegistrations={pendingRegistrations}
            approvalPagination={approvalPagination}
            fetchPendingRegistrations={fetchPendingRegistrations}
            handleApproveStudent={handleApproveStudent}
            handleRejectStudent={handleRejectStudent}
            showApprovalModal={showApprovalModal}
            setShowApprovalModal={setShowApprovalModal}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            // Modal handlers
            setShowViewModal={setShowViewModal}
            setShowEditModal={setShowEditModal}
            setShowDeleteModal={setShowDeleteModal}
            setSelectedUser={setSelectedUser}
          />
          <CreateUserModal
            isOpen={showCreateUserModal}
            onClose={() => setShowCreateUserModal(false)}
          />
          <StudentApprovalModal
            isOpen={showApprovalModal}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedStudent(null);
            }}
            student={selectedStudent}
            onApprove={handleApproveStudent}
            onReject={handleRejectStudent}
          />
          <ViewUserModal
            isOpen={showViewModal}
            onClose={() => {
              setShowViewModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
          />
          <EditUserModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onSave={async (userData) => {
              // Handle user update
              try {
                const response = await api.put(`/users/${selectedUser.id}`, userData);
                if (response.data.success) {
                  // Refresh students list
                  await fetchStudents();
                  setShowEditModal(false);
                  setSelectedUser(null);
                }
              } catch (error) {
                console.error('Failed to update user:', error);
              }
            }}
          />
          <DeleteUserModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onDelete={async (user) => {
              // Handle user deletion
              try {
                const response = await api.delete(`/users/${user.id}`);
                if (response.data.success) {
                  // Refresh students list
                  await fetchStudents();
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }
              } catch (error) {
                console.error('Failed to delete user:', error);
              }
            }}
          />
        </>
        );

      case 'student-approvals':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Approvals</h1>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {pendingRegistrations.length} pending registrations
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading pending registrations...</p>
                </div>
              ) : pendingRegistrations.length === 0 ? (
                <div className="p-6 text-center">
                  <HiCheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pending Approvals</h3>
                  <p className="text-gray-600 dark:text-gray-400">All student registrations have been processed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {pendingRegistrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                                  <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {registration.profile?.first_name} {registration.profile?.last_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {registration.profile?.national_id || 'Not provided'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {registration.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {registration.profile?.phone || 'Not provided'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(registration.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openApprovalModal(registration)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Review Registration"
                              >
                                <HiEye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {approvalPagination.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {((approvalPagination.current_page - 1) * approvalPagination.per_page) + 1} to{' '}
                      {Math.min(approvalPagination.current_page * approvalPagination.per_page, approvalPagination.total)} of{' '}
                      {approvalPagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchPendingRegistrations(approvalPagination.current_page - 1)}
                        disabled={approvalPagination.current_page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => fetchPendingRegistrations(approvalPagination.current_page + 1)}
                        disabled={approvalPagination.current_page === approvalPagination.total_pages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Student Approval Modal */}
            <StudentApprovalModal
              isOpen={showApprovalModal}
              onClose={() => {
                setShowApprovalModal(false);
                setSelectedStudent(null);
              }}
              student={selectedStudent}
              onApprove={handleApproveStudent}
              onReject={handleRejectStudent}
              loading={loading}
            />
          </div>
        );

      case 'lecturers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecturers</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Lecturer
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Lecturer management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Programs</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Program
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Program management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Course
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Course management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Transaction
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Finance management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Book
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Library management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Generate Report
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Reports content will be implemented here.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Settings content will be implemented here.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Content not found</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default AdminDashboard;
