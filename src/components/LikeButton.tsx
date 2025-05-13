import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

interface LikeButtonProps {
  courseId: number;
  reviewIndex: number;
  initialLikes: number;
  initialHasLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  courseId,
  reviewIndex,
  initialLikes,
  initialHasLiked
}) => {
  const { contract, account } = useWeb3();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);

  const handleLike = async () => {
    if (!contract || !account) return;
    try {
      await contract.likeReview(courseId, reviewIndex);
      setLikes(likes + 1);
      setHasLiked(true);
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked}
      className={`like-button ${hasLiked ? 'liked' : ''}`}
    >
      👍 {likes}
    </button>
  );
};

export default LikeButton;