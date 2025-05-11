import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="navbar">
      <div className="nav-brand">CourseReview DApp</div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/courses" className="nav-link">Courses</Link>
        <Link to="/submit-review" className="nav-link">Submit Review</Link>
        <Link to="/add-course" className="nav-link">Add Course</Link>
        {account ? (
          <span className="wallet-address">
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
        ) : (
          <button 
            className="btn btn-primary connect-wallet"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 