import React, { useState, useEffect } from 'react';

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
    // 1. Fetch Marital Status directly from External API
    fetch('https://smartloan-api-ipn1.onrender.com/api/reflist?type=maritalStatus', {
      headers: {
        'x-api-key': 'smartloan-secret-key-2026',
        'ngrok-skip-browser-warning': '69420'
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setRefData(prev => ({ ...prev, maritalStatuses: result.data }));
        }
      })
      .catch(err => console.error('Error fetching Marital Status directly:', err));

    // 2. Fetch Position directly
    fetch('https://smartloan-api-ipn1.onrender.com/api/reflist?type=position', {
      headers: { 'x-api-key': 'smartloan-secret-key-2026', 'ngrok-skip-browser-warning': '69420' }
    })
      .then(res => res.json())
      .then(result => { if (result.success && result.data) setRefData(prev => ({ ...prev, positions: result.data })); })
      .catch(err => console.error('Error fetching Position directly:', err));

    // 3. Fetch Debt Type directly
    fetch('https://smartloan-api-ipn1.onrender.com/api/reflist?type=debtType', {
      headers: { 'x-api-key': 'smartloan-secret-key-2026', 'ngrok-skip-browser-warning': '69420' }
    })
      .then(res => res.json())
      .then(result => { if (result.success && result.data) setRefData(prev => ({ ...prev, debtTypes: result.data })); })
      .catch(err => console.error('Error fetching Debt Type directly:', err));

    // 4. Fetch Purpose directly
    fetch('https://smartloan-api-ipn1.onrender.com/api/reflist?type=purpose', {
      headers: { 'x-api-key': 'smartloan-secret-key-2026', 'ngrok-skip-browser-warning': '69420' }
    })
      .then(res => res.json())
      .then(result => { if (result.success && result.data) setRefData(prev => ({ ...prev, purposes: result.data })); })
      .catch(err => console.error('Error fetching Purpose directly:', err));

    // 5. Fetch Term directly
    fetch('https://smartloan-api-ipn1.onrender.com/api/reflist?type=term', {
      headers: { 'x-api-key': 'smartloan-secret-key-2026', 'ngrok-skip-browser-warning': '69420' }
    })
      .then(res => res.json())
      .then(result => { if (result.success && result.data) setRefData(prev => ({ ...prev, terms: result.data })); })
      .catch(err => console.error('Error fetching Term directly:', err));

    // 6. Fetch Home Ownership directly
    fetch('https://smartloan-api-ipn1.onrender.com/api/reflist?type=homeOwnership', {
      headers: { 'x-api-key': 'smartloan-secret-key-2026', 'ngrok-skip-browser-warning': '69420' }
    })
      .then(res => res.json())
      .then(result => { 
        if (result.success && result.data) setRefData(prev => ({ ...prev, homeOwnerships: result.data })); 
        setLoading(false); 
      })
      .catch(err => { console.error('Error fetching Home Ownership directly:', err); setLoading(false); });
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
    if (type === 'select-multiple') {
      const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
      setFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to save this application?')) {
      console.log('Step 1: UI submitting application directly to External API...');
      
      // Clean and typecast data properly for the external API
      const cleanedData = {
        ...formData,
        nationalId: formData.nationalId.replace(/-/g, ''),
        maritalStatusId: formData.maritalStatusId ? parseInt(formData.maritalStatusId, 10) : undefined,
        positionId: formData.positionId ? parseInt(formData.positionId, 10) : undefined,
        annualIncome: formData.annualIncome ? parseFloat(formData.annualIncome) : undefined,
        loanAmount: formData.loanAmount ? parseFloat(formData.loanAmount) : undefined,
        purposeId: formData.purposeId ? parseInt(formData.purposeId, 10) : undefined,
        termId: formData.termId ? parseInt(formData.termId, 10) : undefined,
        homeOwnershipId: formData.homeOwnershipId ? parseInt(formData.homeOwnershipId, 10) : undefined,
        debts: Array.isArray(formData.debts) ? formData.debts.map(d => parseInt(d, 10)) : []
      };

      try {
        const response = await fetch('https://smartloan-api-ipn1.onrender.com/api/loan/apply', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': 'smartloan-secret-key-2026',
            'ngrok-skip-browser-warning': '69420'
          },
          body: JSON.stringify(cleanedData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit application to Render API');
        }

        const data = await response.json();
        alert('Application submitted successfully! ID: ' + (data.data?.id || ''));
        setFormData(initialState); // Clear form after success
      } catch (err) {
        console.error('Error submitting application:', err);
        alert('Error submitting application: ' + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card" style={{ animation: 'fadeIn 0.4s ease-out', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary) 0%, #60a5fa 100%)' }}></div>
      <h2 className="section-title">Loan Application Form (แบบฟอร์มการสมัครสินเชื่อ)</h2>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <section className="form-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>👤</span> Personal Information (ข้อมูลส่วนบุคคล)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
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
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💼</span> Employment & Income (ข้อมูลอาชีพและรายได้)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
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
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} step="0.01" max="999999999.99" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
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
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💰</span> Loan Details (รายละเอียดสินเชื่อที่ต้องการ)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Existing Debt Burdens (ภาระหนี้สินที่มีอยู่)</label>
              <select 
                multiple 
                name="debts" 
                value={formData.debts} 
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '6px', 
                  height: '140px',
                  backgroundColor: 'white'
                }}
              >
                {refData.debtTypes.map(debt => (
                  <option key={debt.id} value={debt.id} style={{ padding: '0.35rem 0.5rem', marginBottom: '4px' }}>
                    {debt.nameEn} ({debt.nameTh})
                  </option>
                ))}
              </select>
              <small style={{display: 'block', color:'#64748b', marginTop: '0.25rem', fontSize:'0.75rem'}}>* Hold Ctrl (Windows) or Cmd (Mac) to select multiple options</small>
            </div>
            <div className="form-group">
              <label className="required">Loan Amount (วงเงินที่ขอกู้)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required step="0.01" max="999999999.99" style={{ paddingLeft: '2rem', width: '100%', borderColor: '#3b82f6' }} placeholder="0.00" />
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

        <div className="form-footer" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="footer-info">
            <div className="footer-info-item">Last Updated By: Administrator</div>
            <div className="footer-info-item">Date: {new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</div>
          </div>
          <div className="footer-actions">
            <button type="button" className="btn btn-cancel" onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>↺</span> Clear
            </button>
            <button type="submit" className="btn btn-update" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>✓</span> Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;
