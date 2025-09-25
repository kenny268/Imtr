'use client';

import { HiX, HiCollection, HiBookOpen, HiClock, HiAcademicCap, HiUsers, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const ViewCourseModal = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', text: 'Inactive' },
      archived: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', text: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      core: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', text: 'Core' },
      elective: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Elective' },
      prerequisite: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', text: 'Prerequisite' },
      general: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'General' }
    };
    
    const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', text: type || 'Unknown' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
              <HiCollection className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{course.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{course.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiBookOpen className="h-5 w-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Program</label>
                  <p className="text-gray-900 dark:text-white">{course.program?.name || 'Not assigned'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Course Code</label>
                  <p className="text-gray-900 dark:text-white">{course.code}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Credits</label>
                  <p className="text-gray-900 dark:text-white">{course.credits}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Year & Semester</label>
                  <p className="text-gray-900 dark:text-white">Year {course.year}, Semester {course.semester}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Course Type</label>
                  <div className="mt-1">
                    {getTypeBadge(course.course_type)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(course.status)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Currently Offered</label>
                  <div className="flex items-center space-x-2">
                    {course.is_offered ? (
                      <HiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <HiXCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-gray-900 dark:text-white">
                      {course.is_offered ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                {course.max_students && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Max Students</label>
                    <p className="text-gray-900 dark:text-white">{course.max_students}</p>
                  </div>
                )}
              </div>
            </div>
            
            {course.description && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white mt-1">{course.description}</p>
              </div>
            )}
          </div>

          {/* Course Hours */}
          {(course.lecture_hours > 0 || course.tutorial_hours > 0 || course.practical_hours > 0 || course.field_work_hours > 0) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <HiClock className="h-5 w-5" />
                <span>Course Hours</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {course.lecture_hours > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Lecture Hours</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.lecture_hours}h</div>
                  </div>
                )}
                
                {course.tutorial_hours > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Tutorial Hours</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.tutorial_hours}h</div>
                  </div>
                )}
                
                {course.practical_hours > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Practical Hours</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.practical_hours}h</div>
                  </div>
                )}
                
                {course.field_work_hours > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Field Work Hours</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.field_work_hours}h</div>
                  </div>
                )}
              </div>
              
              {course.total_hours > 0 && (
                <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg">
                  <div className="text-sm font-medium text-brand-600 dark:text-brand-400">Total Hours</div>
                  <div className="text-2xl font-bold text-brand-900 dark:text-brand-100">{course.total_hours}h</div>
                </div>
              )}
            </div>
          )}

          {/* Grading System */}
          {course.grading_system && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <HiUsers className="h-5 w-5" />
                <span>Grading System</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {course.grading_system.assignments > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Assignments</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{course.grading_system.assignments}%</div>
                  </div>
                )}
                
                {course.grading_system.midterm > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Midterm</div>
                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{course.grading_system.midterm}%</div>
                  </div>
                )}
                
                {course.grading_system.final_exam > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">Final Exam</div>
                    <div className="text-2xl font-bold text-red-900 dark:text-red-100">{course.grading_system.final_exam}%</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <HiAcademicCap className="h-5 w-5" />
                <span>Prerequisites</span>
              </h3>
              
              <div className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <HiAcademicCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{prereq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Learning Objectives</h3>
              <ul className="space-y-2">
                {course.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-brand-600 dark:text-brand-400 mt-1">•</span>
                    <span className="text-gray-900 dark:text-white">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Content */}
          {course.course_content && course.course_content.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Course Content</h3>
              <ul className="space-y-2">
                {course.course_content.map((content, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-brand-600 dark:text-brand-400 mt-1">•</span>
                    <span className="text-gray-900 dark:text-white">{content}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assessment Methods */}
          {course.assessment_methods && course.assessment_methods.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assessment Methods</h3>
              <ul className="space-y-2">
                {course.assessment_methods.map((method, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-brand-600 dark:text-brand-400 mt-1">•</span>
                    <span className="text-gray-900 dark:text-white">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Textbooks */}
          {course.textbooks && course.textbooks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Textbooks</h3>
              <div className="space-y-3">
                {course.textbooks.map((textbook, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">{textbook.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">by {textbook.author}</div>
                    {textbook.edition && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">Edition: {textbook.edition}</div>
                    )}
                    {textbook.isbn && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">ISBN: {textbook.isbn}</div>
                    )}
                    {textbook.publisher && (
                      <div className="text-sm text-gray-500 dark:text-gray-500">Publisher: {textbook.publisher}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {course.references && course.references.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">References</h3>
              <ul className="space-y-2">
                {course.references.map((reference, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-brand-600 dark:text-brand-400 mt-1">•</span>
                    <span className="text-gray-900 dark:text-white">{reference}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attendance Requirements */}
          {course.attendance_required && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance Requirements</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Minimum Attendance</div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{course.min_attendance_percentage}%</div>
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

export default ViewCourseModal;
