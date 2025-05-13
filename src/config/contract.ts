export const CONTRACT_ADDRESS = "0x19800EE2C38992b87DC6e1919b5BBC16dfB8A9F8";

export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "professor",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "department",
				"type": "string"
			}
		],
		"name": "CourseAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "reviewer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "ReviewSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "reviewer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "newRating",
				"type": "uint8"
			}
		],
		"name": "ReviewUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_REVIEW_LENGTH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_REVIEW_LENGTH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "professor",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "department",
				"type": "string"
			}
		],
		"name": "addCourse",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "courseCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "courseReviews",
		"outputs": [
			{
				"internalType": "address",
				"name": "reviewer",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "difficulty",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "workload",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "reviewText",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "courses",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "professor",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "department",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalReviews",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalDifficulty",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalWorkload",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			}
		],
		"name": "getCourse",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "professor",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "department",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalReviews",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "averageRating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "averageDifficulty",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "averageWorkload",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reviewIndex",
				"type": "uint256"
			}
		],
		"name": "getReview",
		"outputs": [
			{
				"internalType": "address",
				"name": "reviewer",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "difficulty",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "workload",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "reviewText",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			}
		],
		"name": "getReviewCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasLiked",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hasReviewed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastReviewTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reviewIndex",
				"type": "uint256"
			}
		],
		"name": "likeReview",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "reviewLikes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "difficulty",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "workload",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "reviewText",
				"type": "string"
			}
		],
		"name": "submitReview",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "courseId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "newRating",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "newDifficulty",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "newWorkload",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "newReviewText",
				"type": "string"
			}
		],
		"name": "updateReview",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userReputation",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]