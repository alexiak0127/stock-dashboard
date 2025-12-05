"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { IncomeStatement } from "./IncomeStatement";

type ChartPoint = {
  date: string;
  close: number;
};

type StockData = {
  latestClose: number;
  prevClose: number;
  diff: number;
  pct: number;
  high: number;
  low: number;
  latestDate: string;
  chartData: ChartPoint[];
};

type StockModalProps = {
  ticker: string;
  companyName?: string;
  isOpen: boolean;
  onClose: () => void;
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background-color: #020824;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Ticker = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #ffffff;
`;

const CompanyName = styled.span`
  font-size: 0.95rem;
  color: #9ca3af;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #d0e3cc;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  &:hover {
    background-color: rgba(208, 227, 204, 0.1);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  padding: 0 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  background-color: rgba(1, 12, 43, 0.5);
`;

const Tab = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  color: ${({ $active }) => ($active ? "#d0e3cc" : "#9ca3af")};
  font-size: 0.95rem;
  font-weight: 600;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#d0e3cc" : "transparent")};
  transition: all 0.2s;

  &:hover {
    color: #d0e3cc;
  }
`;

const Content = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #fca5a5;
  padding: 2rem;
`;

const PriceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: 600;
  color: #ffffff;
`;

const ChangeText = styled.span<{ positive: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ positive }) => (positive ? "#86efac" : "#fca5a5")};
`;

const DateText = styled.span`
  font-size: 0.85rem;
  color: #9ca3af;
  margin-left: auto;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatBox = styled.div`
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background-color: rgba(2, 8, 36, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.3);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.3rem;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
`;

const ChartTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ffffff;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 18px;
  background-color: rgba(2, 8, 36, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 1rem 1.25rem;
  box-sizing: border-box;
`;

export function StockModal({ ticker, companyName, isOpen, onClose }: StockModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "financials" | "price">("overview");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      try {
        setError(null);
        const response = await fetch(`/api/price/${ticker}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setStockData(data);
        }
      } catch {
        setError("Failed to load data");
      }
    }

    fetchData();
  }, [ticker, isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (error) {
      return <ErrorMessage>Error: {error}</ErrorMessage>;
    }

    if (!stockData) {
      return <ErrorMessage>No data available</ErrorMessage>;
    }

    if (activeTab === "overview") {
      return null;
    }

    if (activeTab === "financials") {
      return <IncomeStatement ticker={ticker} />;
    }

    // Price tab
    const { latestClose, prevClose, diff, pct, high, low, latestDate, chartData } = stockData;
    const positive = diff >= 0;

    // chart data
    const closes = chartData.map((p) => p.close);
    const minClose = Math.min(...closes);
    const maxClose = Math.max(...closes);
    const range = maxClose - minClose || 1;

    const points = chartData
      .map((point, index) => {
        const x = (index / Math.max(chartData.length - 1, 1)) * 100;
        const normalized = (point.close - minClose) / range;
        const y = 90 - normalized * 70;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    return (
      <>
        <PriceRow>
          <Price>${latestClose.toFixed(2)}</Price>
          <ChangeText positive={positive}>
            {positive ? "+" : ""}
            {diff.toFixed(2)} ({positive ? "+" : ""}
            {pct.toFixed(2)}%)
          </ChangeText>
          <DateText>Last updated: {latestDate}</DateText>
        </PriceRow>

        <StatGrid>
          <StatBox>
            <StatLabel>Previous close</StatLabel>
            <StatValue>${prevClose.toFixed(2)}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Day high</StatLabel>
            <StatValue>${high.toFixed(2)}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Day low</StatLabel>
            <StatValue>${low.toFixed(2)}</StatValue>
          </StatBox>
        </StatGrid>

        <ChartTitle>Last 60 trading days</ChartTitle>
        <ChartContainer>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <line
              x1="0"
              y1="90"
              x2="100"
              y2="90"
              stroke="rgba(148,163,184,0.4)"
              strokeWidth="0.3"
            />
            <polyline
              fill="none"
              stroke="#D0E3CC"
              strokeWidth="1.5"
              points={points}
            />
          </svg>
        </ChartContainer>
      </>
    );
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <Header>
          <TitleSection>
            <Ticker>{ticker}</Ticker>
            {companyName && <CompanyName>{companyName}</CompanyName>}
          </TitleSection>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <TabsContainer>
          <Tab $active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            Overview
          </Tab>
          <Tab $active={activeTab === "financials"} onClick={() => setActiveTab("financials")}>
            Financials
          </Tab>
          <Tab $active={activeTab === "price"} onClick={() => setActiveTab("price")}>
            Price
          </Tab>
        </TabsContainer>

        <Content>{renderContent()}</Content>
      </ModalContainer>
    </Overlay>
  );
}
