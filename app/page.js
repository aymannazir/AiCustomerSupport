"use client";
import React, { useState, useEffect } from 'react';
import styles from './Homepage.module.css'; // Ensure this path is correct

const Page = () => {
  const [count, setCount] = useState(0);

  // Fetch the current count from the server
  useEffect(() => {
    fetch('http://localhost:5000/api/waitlist/count')
      .then((response) => response.json())
      .then((data) => {
        setCount(data.count);
      })
      .catch((error) => console.error('Error fetching count:', error));
  }, []);

  // Handler for submitting the waitlist form
  const handleWaitlistJoin = (event) => {
    event.preventDefault();

    // Send a POST request to increment the waitlist counter
    fetch('http://localhost:5000/api/waitlist/join', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setCount(data.count); // Update the count with the response from the server
      })
      .catch((error) => console.error('Error joining waitlist:', error));
  };

  return (
    <div className={styles.container}>
      
      {/* Hero Section */}
      <header className={styles.heroSection}>
        <h1>StockAdvisor AI</h1>
        <h2>Your Ultimate AI-Powered Stock Research Assistant</h2>
        <p>Make informed investment decisions with real-time insights and comprehensive analysis.</p>
        <div className={styles.ctaButtons}>
          <button className={styles.joinWaitlist} onClick={() => document.querySelector('form').submit()}>Join the Waitlist</button>
          <p className={styles.counter}>{count} have joined so far</p>
        </div>
      </header>
      
      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2>Features</h2>
        <div className={styles.featureBoxes}>
          <div className={styles.featureBox}>
            <h3>Real-Time Stock Charts</h3>
            <p>Access live stock charts with essential indicators.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>Comprehensive Analysis</h3>
            <p>Get detailed insights on company performance and future plans.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>Market Sentiment</h3>
            <p>Understand market emotions and predict product success.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>Beginner Guidance</h3>
            <p>Learn what to research and why before investing.</p>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className={styles.pricingSection}>
        <h2>Pricing</h2>
        <div className={styles.pricingPlans}>
          <div className={styles.plan}>
            <h3>$5/month</h3>
            <p>Basic features with limited AI research.</p>
          </div>
          <div className={styles.plan}>
            <h3>$25/month</h3>
            <p>Unlimited AI-driven research.</p>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <h2>Who Benefits the Most</h2>
        <div className={styles.benefitCards}>
          <div className={styles.benefitCard}>
            <h3>Individual Investors</h3>
            <p>Make data-driven decisions with comprehensive analysis.</p>
          </div>
          <div className={styles.benefitCard}>
            <h3>Financial Advisors</h3>
            <p>Provide clients with accurate and real-time information.</p>
          </div>
          <div className={styles.benefitCard}>
            <h3>Market Analysts</h3>
            <p>Analyze trends and predict future market movements.</p>
          </div>
        </div>
      </section>
      
      {/* Waitlist Section */}
      <section className={styles.waitlistSection}>
        <h2>Join the Waitlist</h2>
        <p>{count} have joined so far</p>
        <form onSubmit={handleWaitlistJoin}>
          <input type="email" placeholder="Enter your email" required />
          <input type="submit" value="Join Now" />
        </form>
      </section>
    </div>
  );
};

export default Page;
