import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CourseList from './components/CourseList';
import CourseDetails from './components/CourseDetails';
import SubmitReview from './components/SubmitReview';
import AddCourse from './components/AddCourse';
import './App.css';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Router basename="/course-review-dapp">
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/submit-review" element={<SubmitReview />} />
              <Route path="/add-course" element={<AddCourse />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;
