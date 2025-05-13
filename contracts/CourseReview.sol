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
        string code;        // Primary identifier (e.g., "COMP4541")
        string professor;
        string department;
        uint256 totalReviews;
        uint256 totalRating;
        uint256 totalDifficulty;
        uint256 totalWorkload;
    }

    // State variables
    mapping(string => bool) public courseExists; // Tracks by course code
    mapping(uint256 => Course) public courses;   // Indexed by auto-increment ID
    mapping(uint256 => Review[]) public courseReviews;
    mapping(address => mapping(uint256 => bool)) public hasReviewed;
    mapping(address => uint256) public lastReviewTimestamp;
    
    uint256 public courseCount;
    uint256 public constant MIN_REVIEW_LENGTH = 10;
    uint256 public constant MAX_REVIEW_LENGTH = 1000;

    // Events
    event CourseAdded(uint256 indexed courseId, string code, string professor, string department);
    event ReviewSubmitted(uint256 indexed courseId, address indexed reviewer, uint8 rating);
    event ReviewUpdated(uint256 indexed courseId, address indexed reviewer, uint8 newRating);

    // Reputation system
    mapping(uint256 => mapping(uint256 => uint256)) public reviewLikes;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasLiked;
    mapping(address => uint256) public userReputation;

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

    // Course Management
    function addCourse(
        string memory code,
        string memory professor,
        string memory department
    ) external {
        require(!courseExists[code], "Course code already exists");
        require(bytes(code).length == 8, "Course code must be exactly 8 characters long");
        require(bytes(code).length > 0, "Course code cannot be empty");
        require(isValidCourseCode(code), "Course code must be 4 letters followed by 4 digits");

        uint256 courseId = courseCount++;
        courses[courseId] = Course({
            code: code,
            professor: professor,
            department: department,
            totalReviews: 0,
            totalRating: 0,
            totalDifficulty: 0,
            totalWorkload: 0
        });

        courseExists[code] = true;
        emit CourseAdded(courseId, code, professor, department);
    }

    // Review System
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

        // Update course stats
        course.totalReviews++;
        course.totalRating += rating;
        course.totalDifficulty += difficulty;
        course.totalWorkload += workload;

        hasReviewed[msg.sender][courseId] = true;
        lastReviewTimestamp[msg.sender] = block.timestamp;
        emit ReviewSubmitted(courseId, msg.sender, rating);
    }

    // Reputation System
    function likeReview(uint256 courseId, uint256 reviewIndex) external {
        Review storage review = courseReviews[courseId][reviewIndex];
        require(review.reviewer != msg.sender, "Cannot like your own review");
        require(!hasLiked[courseId][reviewIndex][msg.sender], "Already liked");
        
        reviewLikes[courseId][reviewIndex]++;
        hasLiked[courseId][reviewIndex][msg.sender] = true;
        userReputation[review.reviewer]++;
    }

    // View Functions
    function getCourse(uint256 courseId) external view returns (
        string memory code,
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
            course.code,
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
        require(reviewIndex < courseReviews[courseId].length, "Invalid review");
        
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

    function isValidCourseCode(string memory code) private pure returns (bool) {
        bytes memory codeBytes = bytes(code);
        if (codeBytes.length != 8) return false;

        for (uint256 i = 0; i < 4; i++) {
            if (!(codeBytes[i] >= 0x41 && codeBytes[i] <= 0x5A) && // A-Z
                !(codeBytes[i] >= 0x61 && codeBytes[i] <= 0x7A)) { // a-z
                return false;
            }
        }

        for (uint256 i = 4; i < 8; i++) {
            if (!(codeBytes[i] >= 0x30 && codeBytes[i] <= 0x39)) { // 0-9
                return false;
            }
        }

        return true;
    }
} 