import React, { useState, useEffect } from 'react';

const NewLoanForm = () => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    customerName: '',
    nationalId: '',
    dob: '',
    address: '',
    phoneNumber: '',
    email: '',
    maritalStatus: '',
    companyName: '',
    position: '',
    officeNumber: '',
    
    loanAmount: '',
    term: '',
    applicationType: '',
    purpose: '',
    
    employmentPeriod: '',
    homeOwnership: '',
    incomeCategory: '',
    annualIncome: '',
    debtToIncomeRatio: '',
    
    interestRate: '',
    grade: '',
    loanCondition: '',
    installment: '',
    paymentType: '',
    totalPayment: '',
    totalReceivedPrincipal: '',
    finalDate: '',
    recoveries: ''
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Dropdown States ---
  const [options, setOptions] = useState({
    maritalStatus: [],
    position: [],
    term: [],
    purpose: [],
    homeOwnership: [],
    applicationType: [],
    incomeCate: [],
    grade: [
      { code: 'A', value: 'A' }, { code: 'B', value: 'B' }, { code: 'C', value: 'C' },
      { code: 'D', value: 'D' }, { code: 'E', value: 'E' }, { code: 'F', value: 'F' }, { code: 'G', value: 'G' }
    ],
    loanCondition: [],
    paymentType: []
  });

  // --- Fetch APIs ---
  useEffect(() => {
    const fetchRefList = async (type) => {
      try {
        const res = await fetch(`https://smartloan-api-ipn1.onrender.com/api/reflist?type=${type}`, {
          headers: {
            'x-api-key': 'smartloan-secret-key-2026',
            'ngrok-skip-browser-warning': '69420'
          }
        });
        const data = await res.json();
        if (data.success && data.data) {
          console.log(`[DEBUG] Options for ${type}:`, data.data);
          setOptions(prev => ({ ...prev, [type]: data.data }));
        }
      } catch (err) {
        console.warn(`Failed to fetch ${type}:`, err);
      }
    };

    fetchRefList('maritalStatus');
    fetchRefList('position');
    fetchRefList('term');
    fetchRefList('applicationType');
    fetchRefList('purpose');
    fetchRefList('homeOwnership');
    fetchRefList('incomeCate');
    fetchRefList('loanCondition');
    fetchRefList('paymentType');
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Numeric filter and length limit for Phone Number
    if (name === 'phoneNumber') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNationalIdChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // keep only numbers
    if (val.length > 13) val = val.slice(0, 13);
    
    // Format: X-XXXX-XXXXX-XX-X
    let formatted = val;
    if (val.length > 1) formatted = `${val.slice(0, 1)}-${val.slice(1)}`;
    if (val.length > 5) formatted = `${formatted.slice(0, 6)}-${val.slice(5)}`;
    if (val.length > 10) formatted = `${formatted.slice(0, 12)}-${val.slice(10)}`;
    if (val.length > 12) formatted = `${formatted.slice(0, 15)}-${val.slice(12)}`;

    setFormData(prev => ({ ...prev, nationalId: val })); // store raw digits
    e.target.value = formatted; // update display
    
    if (errors.nationalId) setErrors(prev => ({ ...prev, nationalId: undefined }));
  };

  const formatDisplayNationalId = (val) => {
    if (!val) return '';
    let formatted = val;
    if (val.length > 1) formatted = `${val.slice(0, 1)}-${val.slice(1)}`;
    if (val.length > 5) formatted = `${formatted.slice(0, 6)}-${val.slice(5)}`;
    if (val.length > 10) formatted = `${formatted.slice(0, 12)}-${val.slice(10)}`;
    if (val.length > 12) formatted = `${formatted.slice(0, 15)}-${val.slice(12)}`;
    return formatted;
  }

  const handleCancel = () => {
    setFormData({
      customerName: '', nationalId: '', dob: '',
      address: '', phoneNumber: '', email: '', maritalStatus: '', companyName: '',
      position: '', officeNumber: '', loanAmount: '', term: '', applicationType: '',
      purpose: '', employmentPeriod: '', homeOwnership: '', incomeCategory: '',
      annualIncome: '', debtToIncomeRatio: '', interestRate: '', grade: '',
      loanCondition: '', installment: '', paymentType: '', totalPayment: '',
      totalReceivedPrincipal: '', finalDate: '',
      recoveries: ''
    });
    setErrors({});
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validations
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer Name is required.';
    if (!formData.nationalId || formData.nationalId.length !== 13) {
      newErrors.nationalId = 'National ID must be exactly 13 digits.';
    }
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required.';
    }

    // New Required Fields based on API feedback
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required.';
    if (!formData.position) newErrors.position = 'Position is required.';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required.';
    if (!formData.homeOwnership) newErrors.homeOwnership = 'Home Ownership is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitStatus({ type: 'error', message: 'Please fix the highlighted errors before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Prepare data for API
    const { 
      maritalStatus, position, term, applicationType, purpose, homeOwnership, 
      incomeCategory, loanCondition, paymentType, ...otherFields 
    } = formData;

    const toInt = (val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    const cleanedData = {
      ...otherFields,
      // Date formatting
      finalDate: formData.finalDate,
      // Type casting for numeric inputs
      loanAmount: formData.loanAmount ? parseFloat(formData.loanAmount) : 0,
      annualIncome: formData.annualIncome ? parseFloat(formData.annualIncome) : 0,
      installment: formData.installment ? parseFloat(formData.installment) : 0,
      totalPayment: formData.totalPayment ? parseFloat(formData.totalPayment) : 0,
      totalRecPrincipal: formData.totalReceivedPrincipal ? parseFloat(formData.totalReceivedPrincipal) : 0,
      recoveries: formData.recoveries ? parseFloat(formData.recoveries) : 0,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : 0,
      debtIncRatio: formData.debtToIncomeRatio ? parseFloat(formData.debtToIncomeRatio) : 0,
      employmentPeriod: formData.employmentPeriod ? parseFloat(formData.employmentPeriod) : 0,
      
      // Map reference fields to API expected keys (with 'Id' suffix)
      // Using toInt to ensure we send a valid number or undefined (missing)
      maritalStatusId: toInt(maritalStatus),
      positionId: toInt(position),
      termId: toInt(term),
      applicationTypeId: toInt(applicationType),
      purposeId: toInt(purpose),
      homeOwnershipId: toInt(homeOwnership),
      incomeCateId: toInt(incomeCategory),
      loanCondition: toInt(loanCondition), // Renamed from Id suffix based on backend observation
      loanConditionId: toInt(loanCondition), // Fallback
      interestPayTypeId: toInt(paymentType),
      debtTypeIds: [],
    };

    console.log('Final API Payload (Cleaned Data):', cleanedData);

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

      const result = await response.json();
      console.log('API Response Detail (Full):', result);

      if (response.ok && result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: `Application submitted successfully! ID: ${result.data?.id || 'N/A'}` 
        });
        handleCancel(); // Reset form
      } else {
        // Handle Validation Errors from API (Updated for details.fieldErrors structure)
        const errorSource = result.details?.fieldErrors || result.errors;
        
        if (result.message === "Validation error" && errorSource) {
          const apiErrors = {};
          
          // Map API field names back to UI keys if necessary
          const fieldMapping = {
            maritalStatusId: 'maritalStatus',
            positionId: 'position',
            termId: 'term',
            applicationTypeId: 'applicationType',
            purposeId: 'purpose',
            homeOwnershipId: 'homeOwnership',
            incomeCategoryId: 'incomeCategory',
            loanConditionId: 'loanCondition',
            paymentTypeId: 'paymentType'
          };

          // Process different API error formats (Object check for fieldErrors)
          Object.keys(errorSource).forEach(key => {
            const field = fieldMapping[key] || key;
            const errorVal = errorSource[key];
            // If it's an array of messages, take the first one
            apiErrors[field] = Array.isArray(errorVal) ? errorVal[0] : errorVal;
          });

          setErrors(apiErrors);
          throw new Error('Please check the highlighted fields for validation errors.');
        }
        
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Submission error:', err);
      // Don't overwrite apiErrors if they were already set, just update status
      setSubmitStatus({ 
        type: 'error', 
        message: err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDate = new Date();
  const formattedDateStr = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;

  const renderDropdown = (name, label, optionsSource = null, required = false) => {
    const sourceKey = optionsSource || name;
    return (
      <div className="form-group">
        <label className={required ? 'required' : ''}>{label}</label>
        <select name={name} value={formData[name]} onChange={handleChange} style={errors[name] ? {borderColor: '#ef4444'} : {}}>
          <option value="">Select...</option>
          {options[sourceKey]?.map((opt, i) => {
            // Robust ID resolution: search for the most likely unique identifier
            const val = (opt.id !== undefined && opt.id !== null) ? opt.id : 
                        (opt.code !== undefined && opt.code !== null) ? opt.code : 
                        (opt.value !== undefined && opt.value !== null) ? opt.value : 
                        (opt.key !== undefined && opt.key !== null) ? opt.key : 
                        (typeof opt === 'string' ? opt : i);
            
            const display = opt.nameTh ? `${opt.nameTh} (${opt.nameEn || opt.name || val})` : (opt.nameEn || opt.name || opt.value || opt.code || (typeof opt === 'string' ? opt : 'Unknown'));
            return (
              <option key={i} value={val}>{display}</option>
            );
          })}
        </select>
        {errors[name] && <div style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem'}}>{errors[name]}</div>}
      </div>
    );
  };

  const renderInput = (name, label, type="text", required=false, tooltipText="", maxLength=null) => (
    <div className="form-group">
      <label className={required ? 'required' : ''}>{label}</label>
      <input 
        type={type} 
        name={name} 
        value={formData[name]} 
        onChange={handleChange} 
        style={errors[name] ? {borderColor: '#ef4444'} : {}}
        placeholder={tooltipText}
        maxLength={maxLength}
      />
      {errors[name] && <div style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem'}}>{errors[name]}</div>}
    </div>
  );

  return (
    <div className="card" style={{ animation: 'fadeIn 0.4s ease-out', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary) 0%, #60a5fa 100%)' }}></div>
      <h2 className="section-title">New Loan Application Form (แบบฟอร์มยื่นคำขออนุมัติเงินกู้ใหม่)</h2>

      {submitStatus && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '8px', 
          backgroundColor: submitStatus.type === 'error' ? '#fef2f2' : '#ecfdf5',
          color: submitStatus.type === 'error' ? '#b91c1c' : '#047857',
          border: `1px solid ${submitStatus.type === 'error' ? '#fecaca' : '#a7f3d0'}`
        }}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* CUSTOMER INFORMATION */}
        <section className="form-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>👤</span> Customer Information (ข้อมูลลูกค้า)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            {renderInput('customerName', 'Customer Name (ชื่อ-นามสกุล)', 'text', true, 'Full Name')}
            
            <div className="form-group">
              <label className="required">National ID (บัตรประชาชน)</label>
              <input 
                type="text" 
                name="nationalId" 
                value={formatDisplayNationalId(formData.nationalId)} 
                onChange={handleNationalIdChange} 
                maxLength={17}
                placeholder="X-XXXX-XXXXX-XX-X"
                style={errors.nationalId ? {borderColor: '#ef4444'} : {}}
              />
              {errors.nationalId && <div style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem'}}>{errors.nationalId}</div>}
            </div>

            <div className="form-group">
              <label className="required">Date of Birth (วันเดือนปีเกิด)</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={errors.dob ? {borderColor: '#ef4444', width: '100%'} : {width: '100%'}} />
              {errors.dob && <div style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem'}}>{errors.dob}</div>}
            </div>

            {renderInput('phoneNumber', 'Phone Number (เบอร์โทรศัพท์)', 'tel', false, '08xxxxxxxx', 10)}
            {renderInput('email', 'Email (อีเมล)', 'email', false, 'username@domain.com')}
            {renderDropdown('maritalStatus', 'Marital Status (สถานภาพการสมรส)', null, true)}
            {renderInput('companyName', 'Company Name (ชื่อบริษัท)', 'text', false, 'Company Name Co., Ltd.')}
            {renderDropdown('position', 'Position (ตำแหน่งงาน)', null, true)}
            {renderInput('officeNumber', 'Office Number (เบอร์โทรศัพท์ที่ทำงาน)', 'tel', false, 'e.g. 021234567 ext 123')}
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Address (ที่อยู่)</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Full Address"></textarea>
            </div>
          </div>
        </section>

        {/* LOAN DETAILS */}
        <section className="form-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💰</span> Loan Details (รายละเอียดสินเชื่อ)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div className="form-group">
              <label>Loan Amount (วงเงินที่ขอกู้)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} step="0.01" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
              </div>
            </div>
            {renderDropdown('term', 'Term (ระยะเวลาผ่อนชำระ)')}
            {renderDropdown('applicationType', 'Application Type (ประเภทของการยื่นคำขอ)')}
            {renderDropdown('purpose', 'Purpose (วัตถุประสงค์ในการกู้)', null, true)}
          </div>
        </section>

        {/* APPLICANT FINANCIAL & EMPLOYMENT */}
        <section className="form-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💼</span> Applicant Financial & Employment (การเงินและการทำงาน)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            {renderInput('employmentPeriod', 'Employment Period (ระยะเวลาการทำงาน - ปี)', 'number', false, 'e.g. 2')}
            {renderDropdown('homeOwnership', 'Home Ownership (สถานะครอบครองที่อยู่อาศัย)', null, true)}
             {renderDropdown('incomeCategory', 'Income Category (ระดับรายได้)', 'incomeCate')}
            <div className="form-group">
              <label>Annual Income (รายได้ต่อปี)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} step="0.01" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
              </div>
            </div>
            {renderInput('debtToIncomeRatio', 'Debt-to-Income Ratio (อัตราส่วนหนี้สินต่อรายได้)', 'number')}
          </div>
        </section>

        {/* LOAN TERMS & FINALIZATION */}
        <section className="form-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📋</span> Loan Terms & Finalization (เงื่อนไขและการสรุป)
          </h3>
          <div className="form-grid" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            {renderInput('interestRate', 'Interest Rate (อัตราดอกเบี้ย %)', 'number')}
            {renderDropdown('grade', 'Grade (ระดับความน่าเชื่อถือ)')}
            {renderDropdown('loanCondition', 'Loan Condition (สถานะของสัญญา)')}
            <div className="form-group">
              <label>Installment (ยอดชำระรายเดือน)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="installment" value={formData.installment} onChange={handleChange} step="0.01" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
              </div>
            </div>
            {renderDropdown('paymentType', 'Interest Payment Type (ระบุรูปแบบการจ่ายดอกเบี้ย)')}
            <div className="form-group">
              <label>Total Payment (ยอดชำระรวมสะสม)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="totalPayment" value={formData.totalPayment} onChange={handleChange} step="0.01" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
              </div>
            </div>
            <div className="form-group">
              <label>Total Received Principal (ยอดเงินต้นที่ชำระคืนแล้ว)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="totalReceivedPrincipal" value={formData.totalReceivedPrincipal} onChange={handleChange} step="0.01" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
              </div>
            </div>
            <div className="form-group">
              <label>Recoveries (เงินคืนจากการตัดหนี้สูญ)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>฿</span>
                <input type="number" name="recoveries" value={formData.recoveries} onChange={handleChange} step="0.01" style={{ paddingLeft: '2rem', width: '100%' }} placeholder="0.00" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Final Date (วันที่ชำระเงินงวดล่าสุด)</label>
              <input type="date" name="finalDate" value={formData.finalDate} onChange={handleChange} style={{ width: '100%' }} />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="form-footer" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="footer-info">
            <div className="footer-info-item">Last Updated By: System Admin</div>
            <div className="footer-info-item">Date: {formattedDateStr}</div>
          </div>
          <div className="footer-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn btn-cancel" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>↺</span> Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-update" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? '⌛' : '✓'}</span> {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default NewLoanForm;
