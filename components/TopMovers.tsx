"use client";
// Top Movers component by Alexia Kim
// Shows clickable cards that open detailed stock modal on click

import { useState } from "react";
import styled from "styled-components";
import { StockModal } from "@/components/StockModal";

export type TopMover = {
  ticker: string;
  change: string; // Formatted with sign and percentage
};

type Props = {
  movers: TopMover[];
};

const Section = styled.section`
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2.2rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
`;

const Card = styled.div`
  width: 11rem; /* ~128px */
  height: 8rem; /* ~112px */
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background-color: #020824;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d0e3cc;
    transform: translateY(-2px);
  }
`;

const Ticker = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Change = styled.span<{ $positive: boolean }>`
  margin-top: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#86efac" : "#fca5a5")};
`;

export function TopMovers({ movers }: Props) {
  // Track which stock ticker is selected to show in modal
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <Section>
      <Title>Top movers</Title>
      <Row>
        {movers.map((m, idx) => {
          // Determine color based on whether change is positive or negative
          const isPositive = m.change.trim().startsWith("+");

          return (
            <Card key={`${m.ticker}-${idx}`} onClick={() => setSelectedStock(m.ticker)}>
              <Ticker>{m.ticker}</Ticker>
              <Change $positive={isPositive}>{m.change}</Change>
            </Card>
          );
        })}
      </Row>

      {/* Modal to show detailed stock information when a card is clicked */}
      <StockModal
        ticker={selectedStock || ""}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </Section>
  );
}
