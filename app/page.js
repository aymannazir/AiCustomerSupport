"use client"; // Mark this file as a client component

import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { useEffect, useState } from 'react'; // Import necessary hooks
import styles from './Homepage.module.css'; // Import CSS module

const Page = () => {
  const [count, setCount] = useState(0);
  const router = useRouter();

  // Fetch the current count from the server
  useEffect(() => {
    const fetchCount = async () => {
      const response = await fetch('/api/waitlist/counter');
      const data = await response.json();
      setCount(data.count);
    };
    fetchCount();
  }, []);

  const handleJoinWaitlist = async (event) => {
    event.preventDefault(); // Prevent default form submission
    await fetch('/api/waitlist/join', {
      method: 'POST',
    });
    router.push('/AIChatAssistant'); // Redirect after joining the waitlist
  };

  const scrollToWaitlistSection = () => {
    const waitlistSection = document.getElementById('waitlistSection');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1>Welcome to StockAdvisorAI</h1>
        <h2>Join the Revolution in Stock Trading</h2>
        <p>Get real-time insights and advice directly from the stock chart.</p>
        <div className={styles.ctaButtons}>
          <button className={styles.joinNow} onClick={scrollToWaitlistSection}>
            Join Now
          </button>
        </div>
        <p className={styles.counter}>Current waitlist count: {count}</p>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featureBoxes}>
          <div className={styles.featureBox}>
            <img src="/path/to/real-time-insights-icon.png" alt="Real-Time Insights" />
            <h3>Real-Time Insights</h3>
            <p>Receive live updates and AI-driven insights on stock movements.</p>
          </div>
          <div className={styles.featureBox}>
            <img src="/path/to/expert-advice-icon.png" alt="Expert Advice" />
            <h3>Expert Advice</h3>
            <p>Get professional advice tailored to your trading strategy.</p>
          </div>
          <div className={styles.featureBox}>
            <img src="/path/to/user-friendly-interface-icon.png" alt="User-Friendly Interface" />
            <h3>User-Friendly Interface</h3>
            <p>Navigate with ease using our intuitive and modern design.</p>
          </div>
          <div className={styles.featureBox}>
            <img src="/path/to/ai-analysis-icon.png" alt="AI Analysis" />
            <h3>AI Analysis</h3>
            <p>Leverage advanced AI algorithms for in-depth market analysis and predictions.</p>
          </div>
          <div className={styles.featureBox}>
            <img src="/path/to/personalized-recommendations-icon.png" alt="Personalized Recommendations" />
            <h3>Personalized Recommendations</h3>
            <p>Get tailored investment suggestions based on your risk tolerance and preferences.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection}>
        <h2>Choose Your Plan</h2>
        <div className={styles.pricingPlans}>
          <div className={styles.plan}>
            <h3>Free Plan</h3>
            <p>Access limited features with no cost.</p>
          </div>
          <div className={styles.plan}>
            <h3>$5/month</h3>
            <p>Get advanced features for personal use.</p>
          </div>
          <div className={styles.plan}>
            <h3>$20/month</h3>
            <p>Unlock all features with premium support.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <h2>Why Choose Us?</h2>
        <div className={styles.benefitCards}>
          <div className={styles.benefitCard}>
            <h3>Accuracy</h3>
            <p>Our AI delivers precise and reliable stock predictions.</p>
          </div>
          <div className={styles.benefitCard}>
            <h3>Trustworthy</h3>
            <p>Join thousands of users who trust our service.</p>
          </div>
          <div className={styles.benefitCard}>
            <h3>Support</h3>
            <p>24/7 customer support to assist with your needs.</p>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlistSection" className={styles.waitlistSection}>
        <h2>Don't Miss Out</h2>
        <p>Sign up now and be the first to experience the future of stock trading.</p>
        <form onSubmit={handleJoinWaitlist}>
          <input type="email" placeholder="Enter your email" required />
          <input type="submit" value="Join the Waitlist" />
        </form>
      </section>
    </div>
  );
};

export default Page;
