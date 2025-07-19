import React from 'react';
import './About.css';
import Footer from '../components/Footer';


 function About() {
  return (
    <div className='about-container'>
      <h1 className="title">About Campus<span>Nav</span><sup>+</sup></h1>

      <p className="paragraph">
        CampusNav+ was born from the real struggles of students navigating academic life — our mission is simple: to make your journey smoother, smarter, and full of excellence.
Whether you're a student chasing that dream first-class, a parent seeking peace of mind, a fresher stepping into a new world, or a visitor finding your way — CampusNav+ is your trusted guide.
Navigate your school grounds effortlessly, find your exam halls in seconds, and gain deep insight into your academic progress with clear, easy CGPA tools.
Created for students, by students, CampusNav+ empowers you to cut through the chaos and focus on what truly matters: unlocking your full potential and achieving success beyond the classroom.
      </p>

      <h3 className="subtitle">Meet the Creator</h3>

      <p className="paragraph">
       DamieMegah is a passionate problem solver and tech enthusiast dedicated to creating tools that simplify not just academy but every other aspect of life. As a student himself, he understands the challenges
        firsthand and builds solutions with precision and purpose. Explore his portfolio to see innovation in action. </p>

      <p className="paragraph">
        Developed by <a href="https://damiemegah.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="link">Damiemegah</a>
      </p>

      <div className="social-container">
        <a href="https://twitter.com/damiemegah" target="_blank" rel="noopener noreferrer" className="social-link">Portfolio</a> |{' '}
        <a href="https://web.facebook.com/profile.php?id=100064034170848" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a> |{' '}
        <a href="https://github.com/damiemegah" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
      </div>
      <Footer />
    </div>
  );
}

export default About;
