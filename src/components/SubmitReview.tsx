import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './SubmitReview.css';

interface Course {
  id: number;
  code: string;
  professor: string;
  department: string;
}

const SubmitReview: React.FC = () => {
  const { contract, isConnected, account } = useWeb3();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<number>(3);
  const [workload, setWorkload] = useState<number>(3);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch all courses and check which ones the user has reviewed
  useEffect(() => {
    const fetchCourses = async () => {
      if (!contract || !isConnected || !account) return;

      try {
        const courseCount = await contract.courseCount();
        const fetchedCourses: Course[] = [];
        const reviewedCourseIds: number[] = [];

        // First, get all courses
        for (let i = 0; i < courseCount; i++) {
          const course = await contract.getCourse(i);
          fetchedCourses.push({
            id: i,
            code: course.code,
            professor: course.professor,
            department: course.department,
          });
        }
        setAllCourses(fetchedCourses);

        // Then check which courses the user has reviewed by checking all reviews
        for (let i = 0; i < courseCount; i++) {
          try {
            const reviewCount = await contract.getReviewCount(i);
            for (let j = 0; j < reviewCount; j++) {
              const review = await contract.getReview(i, j);
              if (review.reviewer.toLowerCase() === account.toLowerCase()) {
                reviewedCourseIds.push(i);
                break;
              }
            }
          } catch (err) {
            console.error(`Error checking reviews for course ${i}:`, err);
          }
        }

        // Filter out reviewed courses
        const available = fetchedCourses.filter(course => !reviewedCourseIds.includes(course.id));
        setAvailableCourses(available);

        // If the currently selected course has been reviewed, clear the selection
        if (selectedCourse !== null && reviewedCourseIds.includes(selectedCourse)) {
          setSelectedCourse(null);
          setRating(5);
          setDifficulty(3);
          setWorkload(3);
          setReviewText('');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again.');
      }
    };

    fetchCourses();
  }, [contract, isConnected, account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract || !isConnected || selectedCourse === null) {
      setError('Please connect your wallet and select a course.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const tx = await contract.submitReview(
        selectedCourse,
        rating,
        difficulty,
        workload,
        reviewText
      );
      await tx.wait();
      setSuccess(true);

      // Remove the reviewed course from available courses
      setAvailableCourses(prev => prev.filter(course => course.id !== selectedCourse));
      setSelectedCourse(null);
      setRating(5);
      setDifficulty(3);
      setWorkload(3);
      setReviewText('');
    } catch (err: any) {
      console.error('Error submitting review:', err);
      
      if (err.message?.includes('Already reviewed this course')) {
        setError('You have already reviewed this course.');
      } else if (err.message?.includes('Must wait between reviews')) {
        setError('Please wait 24 hours between reviews.');
      } else if (err.message?.includes('Review too short')) {
        setError('Your review must be at least 10 characters long.');
      } else if (err.message?.includes('Review too long')) {
        setError('Your review must be less than 1000 characters long.');
      } else if (err.message?.includes('Rating must be between 1 and 5')) {
        setError('Please provide ratings between 1 and 5 stars.');
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="submit-review">
        <div className="connect-prompt">
          <p>Please connect your wallet to submit a review</p>
        </div>
      </div>
    );
  }

  if (availableCourses.length === 0) {
    return (
      <div className="submit-review">
        <div className="no-courses">
          <p>You have reviewed all available courses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-review">
      <h2>Submit a Course Review</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="course">Select Course:</label>
          <select
            id="course"
            value={selectedCourse ?? ''}
            onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : null)}
            required
          >
            <option value="">Select a course...</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.professor} ({course.department})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Rating:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`rating-star ${value <= rating ? 'active' : ''}`}
                onClick={() => setRating(value)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Difficulty:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`rating-star ${value <= difficulty ? 'active' : ''}`}
                onClick={() => setDifficulty(value)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Workload:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`rating-star ${value <= workload ? 'active' : ''}`}
                onClick={() => setWorkload(value)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="review">Review Text:</label>
          <textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            minLength={10}
            maxLength={1000}
            placeholder="Write your review here (10-1000 characters)..."
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">
            Review submitted successfully! Thank you for your feedback.
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={loading || selectedCourse === null}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview; 