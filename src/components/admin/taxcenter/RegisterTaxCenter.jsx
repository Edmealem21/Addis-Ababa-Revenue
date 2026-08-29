import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const RegisterTaxCenter = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.address.trim()) {
      onRegister(formData);
      setFormData({ name: '', address: '' });
    }
  };

  return (
    <div className="register-form">
      <div className="form-title">
        <FaPlus /> አዲስ ታክስ ማእከል ይመዝገቡ
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>የታክስ ማእከል ስም *</label>
            <input
              type="text"
              name="name"
              placeholder="ለምሳሌ: አዲስ አበባ ቦሌ"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>አድራሻ *</label>
            <input
              type="text"
              name="address"
              placeholder="አድራሻ ያስገቡ"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            ይመዝገቡ
          </button>
          <button type="button" className="btn btn-danger" onClick={onCancel}>
            <FaTimes /> ሰርዝ
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default RegisterTaxCenter;