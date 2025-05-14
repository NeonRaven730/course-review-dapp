import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import './CourseList.css';

interface Course {
  id: number;
  code: string;
  professor: string;
  department: string;
  totalReviews: number;
  averageRating: number;
  averageDifficulty: number;
  averageWorkload: number;
}

const CourseList: React.FC = () => {
  const { contract, isConnected } = useWeb3();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!contract || !isConnected) return;

      try {
        setLoading(true);
        setError(null);

        const courseCount = await contract.courseCount();
        const fetchedCourses: Course[] = [];

        for (let i = 0; i < courseCount; i++) {
          const course = await contract.getCourse(i);
          fetchedCourses.push({
            id: i,
            code: course.code,
            professor: course.professor,
            department: course.department,
            totalReviews: course.totalReviews.toNumber(),
            averageRating: course.averageRating.toNumber(),
            averageDifficulty: course.averageDifficulty.toNumber(),
            averageWorkload: course.averageWorkload.toNumber(),
          });
        }

        setCourses(fetchedCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [contract, isConnected]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || course.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(courses.map(course => course.department)));

  if (!isConnected) {
    return (
      <div className="course-list">
        <div className="connect-prompt">
          <p>Please connect your wallet to view courses</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="course-list">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-list">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="course-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search courses or professors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="department-filter"
        >
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-results">No courses found matching your criteria</div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
              <h3>{course.code}</h3>
              <p className="professor">Professor: {course.professor}</p>
              <p className="department">Department: {course.department}</p>
              <div className="course-stats">
                <div className="stat">
                  <span className="label">Rating</span>
                  <span className="value">{course.averageRating}/5</span>
                </div>
                <div className="stat">
                  <span className="label">Difficulty</span>
                  <span className="value">{course.averageDifficulty}/5</span>
                </div>
                <div className="stat">
                  <span className="label">Workload</span>
                  <span className="value">{course.averageWorkload}/5</span>
                </div>
                <div className="stat">
                  <span className="label">Reviews</span>
                  <span className="value">{course.totalReviews}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList; 