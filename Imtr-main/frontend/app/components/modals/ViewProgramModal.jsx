import { HiX, HiBookOpen, HiUsers, HiClock, HiCheckCircle, HiXCircle, HiAcademicCap, HiCurrencyDollar, HiCalendar, HiDocumentText } from 'react-icons/hi';

const ViewProgramModal = ({ isOpen, onClose, program }) => {
  if (!isOpen || !program) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      case 'suspended':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'archived':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'certificate':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'diploma':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'bachelor':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'master':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'phd':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <HiBookOpen className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Program Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {program.name} ({program.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <HiX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{program.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Code
                </label>
                <p className="text-gray-900 dark:text-white font-mono">{program.code}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(program.level)}`}>
                  {program.level?.charAt(0).toUpperCase() + program.level?.slice(1) || 'Not specified'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                  {program.status?.charAt(0).toUpperCase() + program.status?.slice(1) || 'Not specified'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <div className="flex items-center space-x-2">
                  <HiClock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {program.duration_months ? `${program.duration_months} months` : 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Credits
                </label>
                <div className="flex items-center space-x-2">
                  <HiAcademicCap className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {program.total_credits || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Students
                </label>
                <div className="flex items-center space-x-2">
                  <HiUsers className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {program.current_students || 0}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Students
                </label>
                <div className="flex items-center space-x-2">
                  <HiUsers className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {program.max_students || 'Unlimited'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Department, Faculty & Coordinator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <p className="text-gray-900 dark:text-white">{program.department?.name || 'Not specified'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Faculty
              </label>
              <p className="text-gray-900 dark:text-white">{program.faculty?.name || 'Not specified'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Program Coordinator
              </label>
              <p className="text-gray-900 dark:text-white">
                {program.coordinator?.user?.profile 
                  ? `${program.coordinator.user.profile.first_name} ${program.coordinator.user.profile.last_name}`
                  : 'Not assigned'
                }
              </p>
            </div>
          </div>

          {/* Description */}
          {program.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>
            </div>
          )}

          {/* Fees Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiCurrencyDollar className="h-5 w-5 mr-2" />
              Fees Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tuition Fee
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(program.tuition_fee)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Fee
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(program.registration_fee)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Other Fees
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {typeof program.other_fees === 'number' 
                    ? formatCurrency(program.other_fees)
                    : 'Not specified'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiCalendar className="h-5 w-5 mr-2" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Start Date
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(program.start_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program End Date
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(program.end_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Deadline
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(program.application_deadline)}</p>
              </div>
            </div>
          </div>

          {/* Accreditation */}
          {program.accreditation_body && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <HiCheckCircle className="h-5 w-5 mr-2" />
                Accreditation
              </h3>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Accrediting Body
                    </label>
                    <p className="text-gray-900 dark:text-white">{program.accreditation_body}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Accreditation Number
                    </label>
                    <p className="text-gray-900 dark:text-white">{program.accreditation_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Accreditation Date
                    </label>
                    <p className="text-gray-900 dark:text-white">{formatDate(program.accreditation_date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <p className="text-gray-900 dark:text-white">{formatDate(program.accreditation_expiry)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entry Requirements */}
          {program.entry_requirements && program.entry_requirements.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Requirements
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1">
                  {Array.isArray(program.entry_requirements) 
                    ? program.entry_requirements.map((requirement, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {requirement}
                        </li>
                      ))
                    : <p className="text-gray-700 dark:text-gray-300">{program.entry_requirements}</p>
                  }
                </ul>
              </div>
            </div>
          )}

          {/* Learning Outcomes */}
          {program.learning_outcomes && program.learning_outcomes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Outcomes
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1">
                  {Array.isArray(program.learning_outcomes) 
                    ? program.learning_outcomes.map((outcome, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {outcome}
                        </li>
                      ))
                    : <p className="text-gray-700 dark:text-gray-300">{program.learning_outcomes}</p>
                  }
                </ul>
              </div>
            </div>
          )}

          {/* Career Prospects */}
          {program.career_prospects && program.career_prospects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Career Prospects
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1">
                  {Array.isArray(program.career_prospects) 
                    ? program.career_prospects.map((prospect, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {prospect}
                        </li>
                      ))
                    : <p className="text-gray-700 dark:text-gray-300">{program.career_prospects}</p>
                  }
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProgramModal;
