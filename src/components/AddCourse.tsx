import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './AddCourse.css';
import { ethers } from 'ethers';

const AddCourse: React.FC = () => {
  const { contract, isConnected, account } = useWeb3();
  const [code, setCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!contract || !account) {
      setError('Contract or account not initialized');
      return;
    }

    // // Debug: Log available methods
    // console.log('Contract methods:', Object.keys(contract.functions));

    // Validate course code format
    const isValidCode = /^[A-Za-z]{4}\d{4}$/.test(code);
    if (!isValidCode) {
      setError('Course code must be 4 letters followed by 4 digits (e.g., COMP1234)');
      return;
    }

    try {
      setLoading(true);
      const tx = await (contract as ethers.Contract).addCourse(code, professor, department);
      await tx.wait();
      console.log('Transaction:', tx);
      setSuccess(true);
      setCode('');
      setProfessor('');
      setDepartment('');
    } catch (err: any) {
      console.error('Error adding course:', err);
      
      // Extract revert reason from error
      let errorMessage = 'Failed to add course';
      if (err.data?.message) {
        // For MetaMask errors
        errorMessage = err.data.message.replace('execution reverted: ', '');
      } else if (err.reason) {
        // For ethers.js errors
        errorMessage = err.reason;
      } else if (err.message) {
        // For other errors
        errorMessage = err.message;
      }

      // Display the revert reason directly
      if (errorMessage.includes('Course code already exists')) {
        setError('Course code already exists');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="add-course">
        <div className="connect-prompt">
          <p>Please connect your wallet to add a course</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-course">
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="code">Course Code:</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="Enter 4 letters followed by 4 digits"
          />
        </div>
        <div className="form-group">
          <label htmlFor="professor">Professor:</label>
          <input
            id="professor"
            type="text"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            required
            placeholder="Enter professor name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            id="department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            placeholder="Enter department name"
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Course added successfully!</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourse; 