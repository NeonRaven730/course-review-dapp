export const CONTRACT_ADDRESS = "0xDBe0836C2313591d4ee62a387ebEbe431Bc2B6a1";

export const CONTRACT_ABI = [
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
    }
]; 