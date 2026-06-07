
import React, { useState } from 'react';
import Button from '../components/common/Button.jsx';
import { API_BASE_URL } from '../services/config.js';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    age: '',  // Keep as string in form state
    gender: '',
    profession: '',
    skills: [],
    availability: 'Weekends',
    availableHours: '',  // Keep as string in form state
    previousExperience: '',
    motivation: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [skillsInput, setSkillsInput] = useState('');

  const API_URL = API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSkillsChange = (e) => {
  const value = e.target.value;

  setSkillsInput(value);

  setFormData(prev => ({
    ...prev,
    skills: value
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean)
  }));
};

  // ✅ NEW: Prepare data for API (convert types properly)
  const prepareFormDataForApi = (data) => {
    const apiData = { ...data };
    
    // Convert age to number if provided
    if (apiData.age !== undefined && apiData.age !== null && apiData.age !== '') {
      apiData.age = Number(apiData.age);
    } else {
      delete apiData.age; // Remove empty age
    }
    
    // Convert availableHours to number if provided
    if (apiData.availableHours !== undefined && apiData.availableHours !== null && apiData.availableHours !== '') {
      apiData.availableHours = Number(apiData.availableHours);
    } else {
      delete apiData.availableHours; // Remove empty availableHours
    }
    
    // Remove empty address fields
    if (apiData.address) {
      Object.keys(apiData.address).forEach(key => {
        if (!apiData.address[key]) {
          delete apiData.address[key];
        }
      });
      if (Object.keys(apiData.address).length === 0) {
        delete apiData.address;
      }
    }
    
    // Remove empty emergency contact fields
    if (apiData.emergencyContact) {
      Object.keys(apiData.emergencyContact).forEach(key => {
        if (!apiData.emergencyContact[key]) {
          delete apiData.emergencyContact[key];
        }
      });
      if (Object.keys(apiData.emergencyContact).length === 0) {
        delete apiData.emergencyContact;
      }
    }
    
    return apiData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});
    
    try {
      // Prepare data for API
      const apiData = prepareFormDataForApi(formData);
      
      console.log('Submitting:', apiData); // Debug log
      
      const response = await fetch(`${API_URL}/api/v1/volunteer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Application submitted successfully! We will contact you soon.' 
        });
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', pincode: '' },
          age: '',
          gender: '',
          profession: '',
          skills: [],
          availability: 'Weekends',
          availableHours: '',
          previousExperience: '',
          motivation: '',
          emergencyContact: { name: '', phone: '', relation: '' }
        });
        
        // Optional: Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMap = {};
          data.errors.forEach(err => {
            errorMap[err.field] = err.message;
          });
          setErrors(errorMap);
          console.log(errorMap);
          setMessage({ 
            type: 'error', 
            text: 'Please fix the errors in the form.' 
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: data.message || 'Something went wrong. Please try again.' 
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection.' 
      });
    } finally {
      setLoading(false);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to show field errors
  const showError = (fieldName) => {
    return errors[fieldName] && (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Show message */}
          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
              />
              {showError('fullName')}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
              />
              {showError('email')}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
              />
              {showError('phone')}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="16"
                max="100"
                className={`w-full border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
              />
              {showError('age')}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Profession
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>
          </div>

          {/* Address - same as before */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Address</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Volunteer Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Volunteer Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={skillsInput}
                  onChange={handleSkillsChange}
                  placeholder="e.g., Teaching, Cooking, Driving"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                  
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Weekends">Weekends</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Specific Hours">Specific Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Available Hours per Week
                </label>
                <input
                  type="number"
                  name="availableHours"
                  value={formData.availableHours}
                  onChange={handleChange}
                  min="1"
                  max="40"
                  className={`w-full border ${errors.availableHours ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
                />
                {showError('availableHours')}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Previous Experience
              </label>
              <textarea
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about any previous volunteering experience..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Why do you want to volunteer? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Share your motivation to join us..."
                className={`w-full border ${errors.motivation ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
              />
              {showError('motivation')}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Emergency Contact</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                placeholder="Contact Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
                placeholder="Contact Phone"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="emergencyContact.relation"
                value={formData.emergencyContact.relation}
                onChange={handleChange}
                placeholder="Relation"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full !py-3"
          >
            {loading ? 'Submitting...' : 'Become a Volunteer'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;