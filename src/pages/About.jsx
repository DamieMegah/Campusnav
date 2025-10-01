import React from 'react';
import './About.css';

function About() {
  return (
    <div className='about-container'>
      <h1 className="title">
        About Campus<span>Nav</span><sup>+</sup>
      </h1>

      <p className="paragraph">
        CampusNav+ was born from the real struggles of students navigating academic life.
        Our mission is simple: to make your journey smoother, smarter, and full of excellence.
        Whether you're a student chasing that dream first-class, a teacher seeking peace of mind,
        a fresher stepping into a new world, or a visitor finding your way. CampusNav+ is your trusted guide.
        Navigate the school grounds effortlessly, find your exam halls in seconds, and gain deep insight into your academic progress with clear,
        easy CGPA tools.
        Created for students, by students, CampusNav+ empowers you to cut through the chaos and focus on what truly matters: unlocking your full
        potential and achieving success beyond the classroom.
      </p>

      <h3 className="subtitle">Meet the Creator</h3>

      <p className="paragraph">
        <small className="alias" title="Alias">"DamieMegah"</small> is a passionate problem solver and tech enthusiast dedicated
        to creating tools that simplify not just academy but every other aspect of life. As a student himself, he understands the challenges
        firsthand and builds solutions with precision and purpose. Explore his portfolio to see innovation in action.
      </p>

      <p className="paragraph">
        Developed by{' '}
        <a
          href="https://damiemegah.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Damiemegah
        </a>
      </p>

      <div className="social-container">
        <a
          href="https://damiemegah.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          Portfolio
        </a>{' '}
        |{' '}
        <a
          href="https://web.facebook.com/profile.php?id=100064034170848"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          Facebook
        </a>{' '}
        |{' '}
        <a
          href="https://github.com/damiemegah"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          GitHub
        </a>
      </div>

      {/* FAQ Drop-Up */}
      <div className="faq-container">
        <span className="faq-trigger">FAQ</span>
        <div className="faq-dropup">
          <details>
            <summary>What is CampusNav+?</summary>
            <p>CampusNav+ helps students easily navigate their campus and manage their academic progress.</p>
          </details>
          <details>
            <summary>How do I locate my exam hall?</summary>
            <p>Search by hall name or code in the app to see its location and directions.</p>
          </details>
           <details>
            <summary>How do i contact DamieMegah?</summary>
            <p>You can Reach DamieMegah via his portfolio link provided in this page or through any of is social handle</p>
          </details>
          <details>
            <summary>Can i make payments on CampusNav+?</summary>
            <p>⚠️ No. CampusNav+ does not accept any payments on its platform or any link provided in chats.
               All payments must only be made through your school or institution’s official website.</p>
          </details>
          <details>
            <summary>Can I calculate my GPA/CGPA?</summary>
            <p>Yes. CampusNav+ includes built-in GPA & CGPA calculators for students.</p>
          </details>
           <details>
            <summary>What is the liveChat Pins about?</summary>
            <p>⚠️ The CampusNav+ liveChat Pins is only for academic navigation support and inquiries. It is not a place to share personal, sensitive,
               or financial information. For your safety, please keep conversations professional and related to CampusNav+ services only.</p>
          </details>
          <details>
            <summary>Where can I contact support or report a problem?</summary>
            <p>You can reach support via the  <a 
  href="https://damiemegah.github.io/damiemegah_privacy-policy/" 
  target="_blank" 
  rel="noopener noreferrer" 
 className="copy"
>
   Privacy & Policy
</a></p>
          </details>
        </div>
      </div>
    </div>
  );
}

export default About;
