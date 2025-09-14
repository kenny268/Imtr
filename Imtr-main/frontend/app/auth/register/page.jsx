'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdWarning } from 'react-icons/md'; // Triangle warning icon


import { motion } from 'framer-motion';

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page since public registration is disabled
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <MdWarning className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Registration Disabled
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Public registration is not available. Please contact an administrator to create your account.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Redirecting to login page...
        </div>
      </motion.div>
    </div>
  );
};

const OldRegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    nationalId: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { showSuccess, showError, showValidationErrors, handleApiError } = useUI();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      showError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Structure payload according to backend validation schema
      // Map camelCase frontend fields to snake_case backend fields
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          address: formData.address || undefined,
          national_id: formData.nationalId || undefined,
        }
      };

      await register(payload);
      showSuccess('Registration successful! Please check your email for verification.');
      router.push('/auth/login');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto h-20 w-20 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <HiUser className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join IMTR School Management System
            </p>
          </div>

          {/* Register Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="border-b border-gray-200 dark:border-dark-700 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiUser className="h-5 w-5 mr-2 text-brand-500" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                        placeholder="+254 7XX XXX XXX"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enter a valid Kenya mobile number
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="border-b border-gray-200 dark:border-dark-700 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiAcademicCap className="h-5 w-5 mr-2 text-brand-500" />
                  Academic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiAcademicCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="LECTURER">Lecturer</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                  </div>

                  {/* National ID */}
                  <div>
                    <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      National ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiIdentification className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nationalId"
                        name="nationalId"
                        type="text"
                        value={formData.nationalId}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                        placeholder="12345678"
                        maxLength="8"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      8-digit National ID (optional)
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Enter your address (optional)"
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiLockClosed className="h-5 w-5 mr-2 text-brand-500" />
                  Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiLockClosed className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must contain uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiLockClosed className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-dark-600 rounded mt-1"
                />
                <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <button type="button" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 underline">
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 underline">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200',
                  isLoading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </AuthGuard>
  );
};

export default RegisterPage;
