import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import './Navbar.css';
import { ethers } from 'ethers';

const Navbar: React.FC = () => {
  const { account, connectWallet, contract } = useWeb3();
  const [reputation, setReputation] = useState(0);

  useEffect(() => {
    if (contract && account) {
      contract.userReputation(account).then((rep: ethers.BigNumber) => 
        setReputation(rep.toNumber())
      );
    }
  }, [contract, account]);

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
      <div className="reputation">
        Reputation: {reputation} ★
      </div>
    </nav>
  );
};

export default Navbar; 