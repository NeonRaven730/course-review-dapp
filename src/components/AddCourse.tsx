import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './AddCourse.css';

const AddCourse: React.FC = () => {
  const { contract, isConnected } = useWeb3();
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract || !isConnected) {
      setError('Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const tx = await contract.addCourse(name, professor, department);
      await tx.wait();

      setSuccess(true);
      setName('');
      setProfessor('');
      setDepartment('');
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Failed to add course. Please try again.');
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
          <label htmlFor="name">Course ID:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. COMP4541"
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
            placeholder="e.g. John Smith"
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
            placeholder="e.g. Computer Science"
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">
            Course added successfully!
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourse; 