import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const RegisterEmployee = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    taxCenter: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName.trim() && formData.idNumber.trim() && formData.taxCenter.trim()) {
      onRegister(formData);
      setFormData({ fullName: '', idNumber: '', taxCenter: '' });
    }
  };

  return (
    <div className="register-form">
      <div className="form-title">
        <FaPlus /> አዲስ ሰራተኛ ይመዝገቡ
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>ሙሉ ስም</label>
            <input
              type="text"
              name="fullName"
              placeholder="ሙሉ ስም ያስገቡ"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>መለያ ቁጥር</label>
            <input
              type="text"
              name="idNumber"
              placeholder="መለያ ቁጥር ያስገቡ"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>ታክስ ማእከል</label>
            <input
              type="text"
              name="taxCenter"
              placeholder="ታክስ ማእከል ያስገቡ"
              value={formData.taxCenter}
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

export default RegisterEmployee;