// Hero Component by Alexia
"use client";

import Link from "next/link";
import styled from "styled-components";

// Main hero card container
const HeroCard = styled.section`
    width: 100%;
    text-align: center;
    padding: 3rem 1.5rem;
    border-radius: 24px;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.1),  /* #ffffff */
        rgba(1, 12, 43, 0.1),      /* #010C2B */
        rgba(1, 12, 43, 0.1)       /* #010C2B */
    );

    /* medium screens and up */
    @media (min-width: 780px) {
        padding: 6.8rem 6rem 2rem;
    }
`;

// Main heading
const Heading = styled.h1`
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;

    @media (min-width: 768px) {
        font-size: 4rem;
    }
`;

// underline beneath heading
const Underline = styled.div`
  margin: 2rem auto 0;
  width: 96px;
  height: 4px;
  border-radius: 999px;
  background-color: #D0E3CC;
`;

// Subheading text
const Subtext = styled.p`
  margin: 2.5rem auto ;
  max-width: 34rem;
  font-size: 1.1rem;
  color: #e5e7eb;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Container for CTA buttons
const ButtonRow = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
`;

// Primary CTA button 
const PrimaryButton = styled(Link)`
  padding: 0.75rem 2.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 275px;    
  height: 55px; 
  border-radius: 6px;
  background-color: #D0E3CC;
  color: #020824;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 4px 12px rgba(217, 232, 196, 0.5);
  }
`;

// Secondary CTA button
const SecondaryButton = styled(Link)`
  padding: 0.75rem 2.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 275px;    
  height: 55px; 
  border-radius: 6px;
  border: 1px solid #D0E3CC;
  background: transparent;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background-color: rgba(2, 8, 36, 0.4);
    box-shadow: 0 4px 12px rgba(217, 232, 196, 0.5);
  }
`;

export function Hero() {
  return (
    <HeroCard>
      <Heading>See the market at a glance</Heading>
      <Underline />
      <Subtext>
        Search for tickers, see its price chart, and follow your watchlist in
        one clean dashboard.
      </Subtext>
      <ButtonRow>
        <PrimaryButton href="/search">Explore stocks</PrimaryButton>
        <SecondaryButton href="/watchlist">View my watchlist</SecondaryButton>
      </ButtonRow>
    </HeroCard>
  );
}
