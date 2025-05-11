import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import './Home.css';

const Home: React.FC = () => {
  const { isConnected, connectWallet } = useWeb3();

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to the Decentralized Course Review System</h1>
        <p>A trustless platform for students to review courses and professors</p>
        
        {!isConnected ? (
          <div className="connect-prompt">
            <div className="metamask-prompt">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask Logo" 
                className="metamask-logo"
              />
              <h2>Please Connect to MetaMask</h2>
              <p>To use this platform, you need to connect your MetaMask wallet</p>
              <button 
                className="btn btn-primary metamask-button"
                onClick={connectWallet}
              >
                Connect MetaMask Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="action-buttons">
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
            <Link to="/submit-review" className="btn btn-secondary">
              Submit a Review
            </Link>
            <Link to="/add-course" className="btn btn-secondary">
              Add a Course
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Decentralized</h3>
          <p>Reviews are stored on the blockchain, ensuring transparency and immutability</p>
        </div>
        <div className="feature-card">
          <h3>Trustless</h3>
          <p>No central authority controls the reviews, making the system fair and unbiased</p>
        </div>
        <div className="feature-card">
          <h3>Secure</h3>
          <p>Built on Ethereum blockchain, ensuring data integrity and security</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 