/**
 * HomePage by Alexia
 * 
 * This is the main entry point of the stock market dashboard application.
 * Displays a hero section with search functionality, view watchlist functionality, and top market movers.
 */

"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Hero } from "@/components/Hero";
import { TopMovers, TopMover } from "@/components/TopMovers";
import { Footer } from "@/components/Footer";

const PageWrapper = styled.main`
  min-height: 100vh;
  background-color: #010C2B;
  color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1650px;
  margin: 0 auto;
  padding: 4rem 3rem 3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Fallback data in case API fails - was initially placeholders before API integration
const fallbackMovers: TopMover[] = [
  { ticker: "TSLA", change: "+5.67%" },
  { ticker: "AAPL", change: "-2.45%" },
  { ticker: "MSFT", change: "+2.45%" },
  { ticker: "AMZN", change: "-2.45%" },
  { ticker: "META", change: "-2.45%" },
];

export default function HomePage() {
  // store top movers data fetched from API
  const [movers, setMovers] = useState<TopMover[]>(fallbackMovers);

  // Fetch top movers data 
  useEffect(() => {
    async function fetchTopMovers() {
      try {
        const response = await fetch("/api/top-movers");
        const data = await response.json();
        
        // Use API data if successful
        if (data.movers && data.movers.length > 0) {
          setMovers(data.movers);
        }
      } catch (error) {
        console.error("Failed to fetch top movers:", error);
        // Keep fallback data on error
      }
    }

    fetchTopMovers();
  }, []); // Run once on mount

  return (
    <PageWrapper>
      <ContentWrapper>
        <Hero />
        <TopMovers movers={movers} />
      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
}
