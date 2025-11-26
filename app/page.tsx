"use client";

import styled from "styled-components";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TopMovers } from "@/components/TopMovers";
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

const topMovers = [
  { ticker: "TSLA", change: "+5.67%" },
  { ticker: "AAPL", change: "-2.45%" },
  { ticker: "MSFT", change: "+2.45%" },
  { ticker: "AMZN", change: "-2.45%" },
  { ticker: "META", change: "-2.45%" },
];

export default function HomePage() {
  return (
    <PageWrapper>
      <Navbar />
      <ContentWrapper>
        <Hero />
        <TopMovers movers={topMovers} />
      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
}
