"use client";

import { useState } from "react";

export default function JobSearchSection() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Handle job search logic
    console.log("Searching for:", jobTitle, "in", location);
  };

  return (
    <section className="job-search-section">
      <div className="container">
        {/* Search Card */}
        <div className="search-card">
          <h2 className="search-title">Search for jobs around you</h2>
          
          <div className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Job Title: Software Engineer, Nurse, Manager, Carpenter, etc."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <div className="search-icon">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="location-input-group">
              <input
                type="text"
                className="location-input"
                placeholder="Enter a location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="location-icon">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            <button 
              className="search-btn"
              onClick={handleSearch}
            >
              Search Jobs
            </button>
          </div>
          
          {/* Popular Job Categories */}
          <div className="popular-categories">
            {/* Per-category job counts removed Aug 2026: "12,500+ jobs" and friends
                were invented, and implausible against the real size of the marketplace.
                Wire these to a live count or leave them off. */}
            <h3 className="categories-title">Popular Job Categories</h3>
            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon">💻</div>
                <div className="category-info">
                  <h4>Technology</h4>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">🏥</div>
                <div className="category-info">
                  <h4>Healthcare</h4>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">📊</div>
                <div className="category-info">
                  <h4>Finance</h4>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">🎨</div>
                <div className="category-info">
                  <h4>Creative</h4>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">🔧</div>
                <div className="category-info">
                  <h4>Skilled Trades</h4>
                </div>
              </div>
              <div className="category-card">
                <div className="category-icon">📈</div>
                <div className="category-info">
                  <h4>Sales & Marketing</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
