import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import './CourseDetails.css';
import LikeButton from './LikeButton';

interface Review {
  reviewer: string;
  rating: number;
  difficulty: number;
  workload: number;
  reviewText: string;
  timestamp: number;
  likes: number;
  hasLiked: boolean;
}

interface Course {
  code: string;
  professor: string;
  department: string;
  totalReviews: number;
  averageRating: number;
  averageDifficulty: number;
  averageWorkload: number;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { contract, isConnected, account } = useWeb3();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!contract || !isConnected || !courseId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseData = await contract.getCourse(Number(courseId));
        setCourse({
          code: courseData.code,
          professor: courseData.professor,
          department: courseData.department,
          totalReviews: courseData.totalReviews.toNumber(),
          averageRating: courseData.averageRating.toNumber(),
          averageDifficulty: courseData.averageDifficulty.toNumber(),
          averageWorkload: courseData.averageWorkload.toNumber(),
        });

        // Fetch reviews
        const reviewCount = await contract.getReviewCount(Number(courseId));
        const fetchedReviews: Review[] = [];

        for (let i = 0; i < reviewCount; i++) {
          const review = await contract.getReview(Number(courseId), i);
          const likes = await contract.reviewLikes(Number(courseId), i);
          const hasLiked = await contract.hasLiked(Number(courseId), i, account);

          fetchedReviews.push({
            reviewer: review.reviewer,
            rating: review.rating,
            difficulty: review.difficulty,
            workload: review.workload,
            reviewText: review.reviewText,
            timestamp: review.timestamp.toNumber(),
            likes: likes.toNumber(),
            hasLiked
          });
        }

        // Sort reviews by timestamp (newest first)
        setReviews(fetchedReviews.sort((a, b) => b.timestamp - a.timestamp));
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to fetch course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [contract, isConnected, courseId, account]);

  if (!isConnected) {
    return (
      <div className="course-details">
        <div className="connect-prompt">
          <p>Please connect your wallet to view course details</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="course-details">
        <div className="loading">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-details">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-details">
        <div className="error">Course not found</div>
      </div>
    );
  }

  return (
    <div className="course-details">
      <button className="back-button" onClick={() => navigate('/courses')}>
        ← Back to Courses
      </button>

      <div className="course-header">
        <h1>{course.code}</h1>
        <p className="professor">Professor: {course.professor}</p>
        <p className="department">Department: {course.department}</p>
      </div>

      <div className="course-stats">
        <div className="stat">
          <span className="label">Average Rating:</span>
          <span className="value">{course.averageRating}/5</span>
        </div>
        <div className="stat">
          <span className="label">Average Difficulty:</span>
          <span className="value">{course.averageDifficulty}/5</span>
        </div>
        <div className="stat">
          <span className="label">Average Workload:</span>
          <span className="value">{course.averageWorkload}/5</span>
        </div>
        <div className="stat">
          <span className="label">Total Reviews:</span>
          <span className="value">{course.totalReviews}</span>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this course!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="reviewer">
                    {`${review.reviewer.slice(0, 6)}...${review.reviewer.slice(-4)}`}
                  </span>
                  <span className="review-date">
                    {new Date(review.timestamp * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-ratings">
                  <div className="rating">
                    <span className="label">Rating:</span>
                    <span className="stars">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="rating">
                    <span className="label">Difficulty:</span>
                    <span className="stars">
                      {'★'.repeat(review.difficulty)}
                      {'☆'.repeat(5 - review.difficulty)}
                    </span>
                  </div>
                  <div className="rating">
                    <span className="label">Workload:</span>
                    <span className="stars">
                      {'★'.repeat(review.workload)}
                      {'☆'.repeat(5 - review.workload)}
                    </span>
                  </div>
                </div>
                <p className="review-text">{review.reviewText}</p>
                <LikeButton
                  courseId={Number(courseId)}
                  reviewIndex={index}
                  initialLikes={review.likes}
                  initialHasLiked={review.hasLiked}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails; 