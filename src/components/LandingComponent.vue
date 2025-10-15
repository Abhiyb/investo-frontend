<script setup>
import { TrendingUp, ArrowRight, Play, BarChart2, Shield, BarChart3, Activity } from 'lucide-vue-next'
import router from '../router';

</script>

<template>
 
      
      <!-- Main content area -->
      <main class="app-main-content">
        <div class="invest-tracker-container">
          <div class="invest-main-content">
            <div class="invest-hero-section">
              <div class="invest-hero-left">
                <div class="invest-badge">
                  <TrendingUp class="invest-badge-icon" />
                  <span>Smart Investment Tracking</span>
                </div>
                
                <h1 class="invest-hero-title">
                  Master Your
                  <span class="invest-text-primary">Investment<br>Portfolio</span>
                </h1>
                
                <p class="invest-hero-description">
                  Track, analyze, and optimize your investments with our
                  comprehensive portfolio management platform. Make
                  informed decisions with real-time analytics and expert
                  insights.
                </p>
                
                <div class="invest-hero-actions">
                  <button :onclick="()=>router.push('/investments')" class="invest-btn invest-btn-primary invest-btn-lg">
                    Investments
                    <ArrowRight class="invest-btn-icon" />
                  </button>
                  <button class="invest-btn invest-btn-outline invest-btn-lg">
                    <Play class="invest-btn-icon" />
                    Watch Demo
                  </button>
                </div>
                
                <div class="invest-stats">
                  <div class="invest-stat">
                    <h2 class="invest-stat-value invest-primary-text">10K+</h2>
                    <p class="invest-stat-label">Active Users</p>
                  </div>
                  <div class="invest-stat">
                    <h2 class="invest-stat-value invest-primary-text">$2B+</h2>
                    <p class="invest-stat-label">Assets Tracked</p>
                  </div>
                  <div class="invest-stat">
                    <h2 class="invest-stat-value invest-primary-text">99.9%</h2>
                    <p class="invest-stat-label">Uptime</p>
                  </div>
                </div>
              </div>
              
              <div class="invest-hero-right">
                <div class="invest-insights-card">
                  <div class="invest-card-header">
                    <div class="invest-header-left">
                      <Shield class="invest-shield-icon" />
                      <h3 class="invest-card-title">Investment Insights</h3>
                    </div>
                    <div class="invest-live-indicator">
                      <span class="invest-live-dot"></span>
                      <span>Live</span>
                    </div>
                  </div>
                  
                  <div class="invest-market-trends">
                    <p class="invest-trends-label">Market Trends</p>
                    <div class="invest-emerging-tech">
                      <h4 class="invest-tech-title">Emerging Tech</h4>
                      <div class="invest-trending-info">
                        <TrendingUp class="invest-trending-icon" />
                        <span class="invest-trending-text">Trending in investor portfolios</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="invest-sectors-section">
                    <div class="invest-sectors-header">
                      <h4 class="invest-sectors-title">Top Performing Sectors</h4>
                      <button class="invest-view-all-btn">View All</button>
                    </div>
                    
                    <div class="invest-sector-item">
                      <div class="invest-sector-info">
                        <div class="invest-sector-icon invest-tech-icon">
                          <BarChart3 />
                        </div>
                        <div class="invest-sector-details">
                          <h5 class="invest-sector-name">Technology</h5>
                          <p class="invest-sector-assets">214 assets</p>
                        </div>
                      </div>
                      <div class="invest-sector-performance invest-positive">+12.4%</div>
                    </div>
                    
                    <div class="invest-sector-item">
                      <div class="invest-sector-info">
                        <div class="invest-sector-icon invest-health-icon">
                          <Activity />
                        </div>
                        <div class="invest-sector-details">
                          <h5 class="invest-sector-name">Healthcare</h5>
                          <p class="invest-sector-assets">87 assets</p>
                        </div>
                      </div>
                      <div class="invest-sector-performance invest-positive">+8.7%</div>
                    </div>
                  </div>
                  
                  <div class="invest-chart-placeholder">
                    <BarChart2 class="invest-chart-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    
</template>

<style scoped>
/* Layout Styles */
.app-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #1e293b;
  background-color: #f8fafc;
}

/* Top navbar spanning full width */
.app-top-navbar {
  width: 100%;
  height: 70px;
  background-color: white;
  border-bottom: 0px solid #e2e8f0;
  flex-shrink: 0;
  z-index: 100;
  position: relative;
}

/* Content area below navbar */
.app-content-area {
  display: flex;
  flex: 1;
  height: calc(100vh - 70px);
  overflow: hidden;
}

/* Left sidebar */
.app-sidebar {
  width: 280px;
  height: 100%;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  flex-shrink: 0;
}

/* Main content area */
.app-main-content {
  flex: 1;
  height: 100%;
  overflow: hidden;
  background-color: #f8fafc;
}

/* Investment Tracker Styles */
.invest-tracker-container {
  width: 100%;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --invest-primary: #1e3a8a;
  --invest-primary-hover: #4338ca;
  --invest-text-primary: #1a1d23;
  --invest-text-secondary: #6b7280;
  --invest-background: #f8fafc;
  --invest-card-background: #ffffff;
  --invest-border-color: #e5e7eb;
  --invest-success: #10b981;
  --invest-purple: #8b5cf6;
  background-color: var(--invest-background);
  color: var(--invest-text-primary);
  line-height: 1.5;
}

.invest-main-content {
  padding: 2rem;
  max-width: 100%;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.invest-hero-section {
  display: flex;
  gap: 3rem;
  padding: 0;
  height: 100%;
  align-items: center;
}

.invest-hero-left {
  flex: 1;
  max-width: 900px;
}

.invest-hero-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.invest-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #eef1ff;
  color: var(--invest-primary);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.invest-badge-icon {
  width: 1rem;
  height: 1rem;
}

.invest-hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--invest-text-primary);
}

.invest-text-primary {
  color: var(--invest-primary);
}

.invest-hero-description {
  font-size: 1.125rem;
  color: var(--invest-text-secondary);
  max-width: 550px;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.invest-hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.invest-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
}

.invest-btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.invest-btn-primary {
  background-color: var(--invest-primary);
  color: white;
}

.invest-btn-primary:hover {
  background-color: var(--invest-primary);
  opacity: 90%;
}

.invest-btn-outline {
  background-color: transparent;
  border: 1px solid var(--invest-border-color);
  color: var(--invest-text-primary);
}

.invest-btn-outline:hover {
  background-color: #f9fafb;
}

.invest-btn-icon {
  width: 1rem;
  height: 1rem;
}

.invest-stats {
  display: flex;
  gap: 3rem;
}

.invest-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.invest-stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.invest-primary-text {
  color: var(--invest-primary);
}

.invest-stat-label {
  font-size: 0.875rem;
  color: var(--invest-text-secondary);
}

/* Investment Insights Card */
.invest-insights-card {
  background-color: var(--invest-card-background);
  border-radius: 1rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  border: 1px solid var(--invest-border-color);
  height: fit-content;
  margin-left: 0; /* or remove this line entirely */
}

.invest-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.invest-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.invest-shield-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--invest-purple);
}

.invest-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--invest-text-primary);
}

.invest-live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--invest-text-secondary);
}

.invest-live-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--invest-success);
  border-radius: 50%;
}

.invest-market-trends {
  margin-bottom: 1.5rem;
}

.invest-trends-label {
  font-size: 0.875rem;
  color: var(--invest-text-secondary);
  margin-bottom: 0.75rem;
}

.invest-emerging-tech {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.75rem;
}

.invest-tech-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--invest-primary);
  margin-bottom: 0.5rem;
}

.invest-trending-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--invest-primary);
  font-size: 0.875rem;
}

.invest-trending-icon {
  width: 1rem;
  height: 1rem;
}

.invest-sectors-section {
  margin-bottom: 1rem;
}

.invest-sectors-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.invest-sectors-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--invest-text-primary);
}

.invest-view-all-btn {
  color: var(--invest-primary);
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.invest-sector-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.invest-sector-item:last-child {
  border-bottom: none;
}

.invest-sector-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.invest-sector-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.invest-tech-icon {
  background-color: #eef1ff;
  color: var(--invest-purple);
}

.invest-health-icon {
  background-color: #ecfdf5;
  color: var(--invest-success);
}

.invest-sector-icon svg {
  width: 1rem;
  height: 1rem;
}

.invest-sector-details h5 {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  color: var(--invest-text-primary);
}

.invest-sector-assets {
  font-size: 0.8rem;
  color: var(--invest-text-secondary);
}

.invest-sector-performance {
  font-weight: 600;
  font-size: 0.95rem;
}

.invest-positive {
  color: var(--invest-success);
}

.invest-chart-placeholder {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  opacity: 0.1;
}

.invest-chart-icon {
  width: 2rem;
  height: 2rem;
  color: var(--invest-text-secondary);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .app-content-area {
    flex-direction: column;
  }
  
  .app-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .invest-hero-section {
    flex-direction: column;
    min-height: auto;
    gap: 2rem;
  }
  
  .invest-hero-title {
    font-size: 2.5rem;
  }
  
  .invest-insights-card {
    max-width: 100%;
  }
  
  .invest-main-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .invest-main-content {
    padding: 1rem;
  }
  
  .invest-hero-actions {
    flex-direction: column;
  }
  
  .invest-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .invest-hero-title {
    font-size: 2rem;
  }
  
  .invest-insights-card {
    padding: 1.5rem;
  }
}
</style>