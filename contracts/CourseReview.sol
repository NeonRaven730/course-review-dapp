// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CourseReview {
    struct Review {
        address reviewer;
        uint8 rating;
        uint8 difficulty;
        uint8 workload;
        string reviewText;
        uint256 timestamp;
    }

    struct Course {
        string name;
        string professor;
        string department;
        uint256 totalReviews;
        uint256 totalRating;
        uint256 totalDifficulty;
        uint256 totalWorkload;
    }

    // State variables
    mapping(uint256 => Course) public courses;
    mapping(uint256 => Review[]) public courseReviews;
    mapping(address => mapping(uint256 => bool)) public hasReviewed;
    mapping(address => uint256) public lastReviewTimestamp;
    
    // New mapping to track existing courses
    mapping(bytes32 => bool) private courseExists;
    
    uint256 public courseCount;
    uint256 public constant MIN_REVIEW_LENGTH = 10;
    uint256 public constant MAX_REVIEW_LENGTH = 1000;

    // Events
    event CourseAdded(uint256 indexed courseId, string name, string professor, string department);
    event ReviewSubmitted(uint256 indexed courseId, address indexed reviewer, uint8 rating);
    event ReviewUpdated(uint256 indexed courseId, address indexed reviewer, uint8 newRating);

    // Modifiers
    modifier validRating(uint8 rating) {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        _;
    }

    modifier validReviewLength(string memory reviewText) {
        bytes memory reviewBytes = bytes(reviewText);
        require(reviewBytes.length >= MIN_REVIEW_LENGTH, "Review too short");
        require(reviewBytes.length <= MAX_REVIEW_LENGTH, "Review too long");
        _;
    }

    modifier notReviewed(uint256 courseId) {
        require(!hasReviewed[msg.sender][courseId], "Already reviewed this course");
        _;
    }

    // Helper function to generate course hash
    function getCourseHash(
        string memory name,
        string memory professor,
        string memory department
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(name, professor, department));
    }

    // Functions
    function addCourse(
        string memory name,
        string memory professor,
        string memory department
    ) external {
        // Check if course already exists
        bytes32 courseHash = getCourseHash(name, professor, department);
        require(!courseExists[courseHash], "Course already exists");

        uint256 courseId = courseCount;
        courses[courseId] = Course({
            name: name,
            professor: professor,
            department: department,
            totalReviews: 0,
            totalRating: 0,
            totalDifficulty: 0,
            totalWorkload: 0
        });
        
        // Mark course as existing
        courseExists[courseHash] = true;
        courseCount++;
        
        emit CourseAdded(courseId, name, professor, department);
    }

    function submitReview(
        uint256 courseId,
        uint8 rating,
        uint8 difficulty,
        uint8 workload,
        string memory reviewText
    ) external validRating(rating) validRating(difficulty) validRating(workload) 
      validReviewLength(reviewText) notReviewed(courseId) {
        require(courseId < courseCount, "Invalid course ID");

        Course storage course = courses[courseId];
        courseReviews[courseId].push(Review({
            reviewer: msg.sender,
            rating: rating,
            difficulty: difficulty,
            workload: workload,
            reviewText: reviewText,
            timestamp: block.timestamp
        }));

        // Update course statistics
        course.totalReviews++;
        course.totalRating += rating;
        course.totalDifficulty += difficulty;
        course.totalWorkload += workload;

        // Mark as reviewed
        hasReviewed[msg.sender][courseId] = true;
        lastReviewTimestamp[msg.sender] = block.timestamp;

        emit ReviewSubmitted(courseId, msg.sender, rating);
    }

    function updateReview(
        uint256 courseId,
        uint8 newRating,
        uint8 newDifficulty,
        uint8 newWorkload,
        string memory newReviewText
    ) external validRating(newRating) validRating(newDifficulty) validRating(newWorkload) 
      validReviewLength(newReviewText) {
        require(courseId < courseCount, "Invalid course ID");
        require(hasReviewed[msg.sender][courseId], "No review found");

        Review[] storage reviews = courseReviews[courseId];
        Course storage course = courses[courseId];
        
        // Find and update the review
        for (uint256 i = 0; i < reviews.length; i++) {
            if (reviews[i].reviewer == msg.sender) {
                // Update course statistics
                course.totalRating = course.totalRating - reviews[i].rating + newRating;
                course.totalDifficulty = course.totalDifficulty - reviews[i].difficulty + newDifficulty;
                course.totalWorkload = course.totalWorkload - reviews[i].workload + newWorkload;

                // Update review
                reviews[i].rating = newRating;
                reviews[i].difficulty = newDifficulty;
                reviews[i].workload = newWorkload;
                reviews[i].reviewText = newReviewText;
                reviews[i].timestamp = block.timestamp;

                emit ReviewUpdated(courseId, msg.sender, newRating);
                break;
            }
        }
    }

    // View functions
    function getCourse(uint256 courseId) external view returns (
        string memory name,
        string memory professor,
        string memory department,
        uint256 totalReviews,
        uint256 averageRating,
        uint256 averageDifficulty,
        uint256 averageWorkload
    ) {
        require(courseId < courseCount, "Invalid course ID");
        Course storage course = courses[courseId];
        
        return (
            course.name,
            course.professor,
            course.department,
            course.totalReviews,
            course.totalReviews > 0 ? course.totalRating / course.totalReviews : 0,
            course.totalReviews > 0 ? course.totalDifficulty / course.totalReviews : 0,
            course.totalReviews > 0 ? course.totalWorkload / course.totalReviews : 0
        );
    }

    function getReview(uint256 courseId, uint256 reviewIndex) external view returns (
        address reviewer,
        uint8 rating,
        uint8 difficulty,
        uint8 workload,
        string memory reviewText,
        uint256 timestamp
    ) {
        require(courseId < courseCount, "Invalid course ID");
        require(reviewIndex < courseReviews[courseId].length, "Invalid review index");
        
        Review storage review = courseReviews[courseId][reviewIndex];
        return (
            review.reviewer,
            review.rating,
            review.difficulty,
            review.workload,
            review.reviewText,
            review.timestamp
        );
    }

    function getReviewCount(uint256 courseId) external view returns (uint256) {
        require(courseId < courseCount, "Invalid course ID");
        return courseReviews[courseId].length;
    }
} 