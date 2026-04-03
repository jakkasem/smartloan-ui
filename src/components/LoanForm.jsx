import React, { useState, useEffect } from 'react';

const API_BASE   = 'https://smartloan-api-ipn1.onrender.com';
const API_KEY = 'smartloan-secret-key-2026';

const LoanForm = () => {
  const initialState = {
    customerName: '',
    nationalId: '',
    dob: '',
    address: '',
    phoneNumber: '',
    email: '',
    maritalStatusId: '',
    companyName: '',
    positionId: '',
    employmentPeriod: '',
    annualIncome: '',
    officeNumber: '',
    loanAmount: '',
    purposeId: '',
    termId: '',
    homeOwnershipId: '',
    debts: []
  };

  const [formData, setFormData] = useState(initialState);
  const [refData, setRefData] = useState({
    maritalStatuses: [],
    positions: [],
    debtTypes: [],
    purposes: [],
    terms: [],
    homeOwnerships: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/reflist`, {
      headers: { 'x-api-key': API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setRefData(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reference data:', err);
        setLoading(false);
      });
  }, []);

  const formatNationalId = (val) => {
    const numericValue = val.replace(/\D/g, '');
    const truncated = numericValue.slice(0, 13);
    let formatted = '';
    for (let i = 0; i < truncated.length; i++) {
      if (i === 1 || i === 5 || i === 10 || i === 12) formatted += '-';
      formatted += truncated[i];
    }
    return formatted;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const debtId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        debts: checked
          ? [...prev.debts, debtId]
          : prev.debts.filter(id => id !== debtId)
      }));
    } else if (name === 'nationalId') {
      setFormData(prev => ({ ...prev, [name]: formatNationalId(value) }));
    } else if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue.slice(0, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all inputs?')) {
      setFormData(initialState);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to save this application?')) {
      const payload = {
        customerName:     formData.customerName,
        nationalId:       formData.nationalId.replace(/-/g, ''),
        dob:              formData.dob,
        address:          formData.address,
        phoneNumber:      formData.phoneNumber,
        email:            formData.email,
        maritalStatusId:  parseInt(formData.maritalStatusId),
        companyName:      formData.companyName || undefined,
        positionId:       formData.positionId ? parseInt(formData.positionId) : undefined,
        employmentPeriod: formData.employmentPeriod || undefined,
        annualIncome:     formData.annualIncome ? parseFloat(formData.annualIncome) : undefined,
        officeNumber:     formData.officeNumber || undefined,
        loanAmount:       parseFloat(formData.loanAmount),
        purposeId:        parseInt(formData.purposeId),
        termId:           parseInt(formData.termId),
        homeOwnershipId:  parseInt(formData.homeOwnershipId),
        debtTypeIds:      formData.debts,
      };
      fetch(`${API_BASE}/api/loan/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Application submitted successfully!');
            setFormData(initialState);
          } else {
            alert('Error: ' + (data.message || 'Submission failed'));
          }
        })
        .catch(err => alert('Error submitting application'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card card--animated">
      <div className="card-top-bar" />
      <h2 className="section-title">Loan Application Form (แบบฟอร์มการสมัครสินเชื่อ)</h2>

      <form onSubmit={handleSubmit}>

        {/* Personal Information */}
        <section className="form-section">
          <h3 className="section-header">
            <span className="section-header-icon">👤</span>
            Personal Information (ข้อมูลส่วนบุคคล)
          </h3>
          <div className="form-grid form-grid--panel">
            <div className="form-group">
              <label className="required">Customer Name (ชื่อ-นามสกุล)</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label className="required">National ID (บัตรประชาชน)</label>
              <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} required placeholder="x-xxxx-xxxxx-xx-x" />
            </div>
            <div className="form-group">
              <label className="required">Date of Birth (วันเดือนปีเกิด)</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="form-group col-full">
              <label>Address (ที่อยู่)</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Full Address"></textarea>
            </div>
            <div className="form-group">
              <label>Phone Number (เบอร์โทรศัพท์)</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} maxLength="10" placeholder="08xxxxxxxx" />
            </div>
            <div className="form-group">
              <label>Email (อีเมล)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="username@domain.com" />
            </div>
            <div className="form-group">
              <label>Marital Status (สถานภาพการสมรส)</label>
              <select name="maritalStatusId" value={formData.maritalStatusId} onChange={handleChange}>
                <option value="">Select...</option>
                {refData.maritalStatuses.map(item => (
                  <option key={item.id} value={item.id}>{item.nameEn} ({item.nameTh})</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Employment & Income */}
        <section className="form-section">
          <h3 className="section-header">
            <span className="section-header-icon">💼</span>
            Employment &amp; Income (ข้อมูลอาชีพและรายได้)
          </h3>
          <div className="form-grid form-grid--panel">
            <div className="form-group">
              <label>Company Name (ชื่อบริษัท)</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name Co., Ltd." />
            </div>
            <div className="form-group">
              <label>Position (ตำแหน่งงาน)</label>
              <select name="positionId" value={formData.positionId} onChange={handleChange}>
                <option value="">Select...</option>
                {refData.positions.map(item => (
                  <option key={item.id} value={item.id}>{item.nameEn} ({item.nameTh})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Employment Period (ระยะเวลาการทำงาน)</label>
              <input type="text" name="employmentPeriod" value={formData.employmentPeriod} onChange={handleChange} placeholder="e.g. 2 years" />
            </div>
            <div className="form-group">
              <label>Annual Income (รายได้ต่อปี)</label>
              <div className="input-currency-wrapper">
                <span className="currency-symbol">฿</span>
                <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} step="0.01" max="999999999.99" className="input-with-currency" placeholder="0.00" />
              </div>
            </div>
            <div className="form-group">
              <label>Office Number (เบอร์โทรศัพท์ที่ทำงาน)</label>
              <input type="tel" name="officeNumber" value={formData.officeNumber} onChange={handleChange} maxLength="20" placeholder="e.g. 021234567 ext 123" />
            </div>
          </div>
        </section>

        {/* Loan Details */}
        <section className="form-section">
          <h3 className="section-header">
            <span className="section-header-icon">💰</span>
            Loan Details (รายละเอียดสินเชื่อที่ต้องการ)
          </h3>
          <div className="form-grid form-grid--panel">
            <div className="form-group col-full">
              <label>Existing Debt Burdens (ภาระหนี้สินที่มีอยู่)</label>
              <div className="listbox-container">
                {refData.debtTypes.map(debt => (
                  <label key={debt.id} className="listbox-item">
                    <input
                      type="checkbox"
                      value={debt.id}
                      checked={formData.debts.includes(debt.id)}
                      onChange={handleChange}
                    />
                    <span>{debt.nameEn} ({debt.nameTh})</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="required">Loan Amount (วงเงินที่ขอกู้)</label>
              <div className="input-currency-wrapper">
                <span className="currency-symbol">฿</span>
                <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required step="0.01" max="999999999.99" className="input-with-currency input-loan-amount" placeholder="0.00" />
              </div>
            </div>
            <div className="form-group">
              <label>Purpose (วัตถุประสงค์ในการกู้)</label>
              <select name="purposeId" value={formData.purposeId} onChange={handleChange}>
                <option value="">Select...</option>
                {refData.purposes.map(item => (
                  <option key={item.id} value={item.id}>{item.nameEn} ({item.nameTh})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Term (ระยะเวลาผ่อนชำระ)</label>
              <select name="termId" value={formData.termId} onChange={handleChange}>
                <option value="">Select...</option>
                {refData.terms.map(item => (
                  <option key={item.id} value={item.id}>{item.displayLabel}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Home Ownership (สถานะครอบครองที่อยู่อาศัย)</label>
              <select name="homeOwnershipId" value={formData.homeOwnershipId} onChange={handleChange}>
                <option value="">Select...</option>
                {refData.homeOwnerships.map(item => (
                  <option key={item.id} value={item.id}>{item.nameEn} ({item.nameTh})</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="form-footer">
          <div className="footer-info">
            <div className="footer-info-item">Last Updated By: Administrator</div>
            <div className="footer-info-item">Date: {new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</div>
          </div>
          <div className="footer-actions">
            <button type="button" className="btn btn-cancel btn--flex" onClick={handleClear}>
              <span>↺</span> Clear
            </button>
            <button type="submit" className="btn btn-update btn--flex">
              <span>✓</span> Save
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default LoanForm;
