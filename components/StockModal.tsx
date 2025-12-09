"use client";
//Done collectively by the group
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

type OverviewData = {
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  eps: string;
  profitMargin: string;
  trailingPE: string;
  forwardPE: string;
  priceToSalesRatio: string;
  bookValue: string;
  fiftyTwoWeekHigh: string;
  fiftyTwoWeekLow: string;
  fiftyTwoWeekChange: string;
  beta: string;
};

type StockModalProps = {
  ticker: string;
  companyName?: string;
  region?: string;
  currency?: string;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

const WishlistButton = styled.button`
  background: transparent;
  border: 2px solid lightgreen;
  color: lightgreen;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.added {
    background-color: lightgreen;
    color: black;
  }
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

export function StockModal({ ticker, companyName, region, currency, isOpen, onClose }: StockModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "financials" | "price">("overview");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  //Start of Charles check wishlist not to duplicate item (all the styles here are to match the existing style of the team)
  useEffect(() => {
    async function checkWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const { wishlist } = await res.json();
          setIsInWishlist(wishlist.some((item: { ticker: string }) => item.ticker === ticker));
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkWishlist();
  }, [ticker]);
  // end of charles for wishlist part functionality
  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      try {
        setError(null);
        const [priceRes, overviewRes] = await Promise.all([
          fetch(`/api/price/${ticker}`),
          fetch(`/api/overview/${ticker}`),
        ]);
        const priceData = await priceRes.json();
        const overviewDataRes = await overviewRes.json();
        
        if (priceData.error) {
          setError(priceData.error);
        } else {
          setStockData(priceData);
        }
    
        if (!overviewDataRes.error) {
          setOverviewData(overviewDataRes);
        }
      } catch {
        setError("Failed to load data");
      }
    }

    fetchData();
  }, [ticker, isOpen]);

  // start Charles Yao Function to add/remove stock in wishlist
  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        //remove from wishlist
        const res = await fetch(`/api/wishlist?ticker=${ticker}`, {
          method: "DELETE",
        });
        
        if (res.ok) {
          setIsInWishlist(false);
        }
      } else {
        // add to wishlist
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticker: ticker,
            name: companyName || ticker,
            region: region || "N/A",
            currency: currency || "USD",
          }),
        });
        
        if (res.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  if (!isOpen) return null;
  // charles yao the overview part, uses similar logic as the team
  const renderContent = () => {
    if (error) {
      return <ErrorMessage>Error: {error}</ErrorMessage>;
    }

    if (!stockData) {
      return <ErrorMessage>No data available</ErrorMessage>;
    }

    if (activeTab === "overview") {
      if (!overviewData) {
        return <ErrorMessage>Overview data not available</ErrorMessage>;
      }
      // the overview page, copy paste style.
      return (
        <div className="space-y-6">
          {overviewData.description !== "N/A" && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">About</h3>
              <p className="text-slate-400 leading-relaxed">
                {overviewData.description}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {overviewData.sector !== "N/A" && (
              <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3.5">
                <div className="text-xs text-slate-400 mb-1">Sector</div>
                <div className="text-sm font-medium text-white">
                  {overviewData.sector}
                </div>
              </div>
            )}
            {overviewData.industry !== "N/A" && (
              <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3.5">
                <div className="text-xs text-slate-400 mb-1">Industry</div>
                <div className="text-sm font-medium text-white">
                  {overviewData.industry}
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Valuation</h3>
            <div className="grid grid-cols-3 gap-2">
              {overviewData.marketCap !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Market Cap</div>
                  <div className="text-xs font-medium text-white">
                    {typeof overviewData.marketCap === "string"
                      ? (parseFloat(overviewData.marketCap) / 1e9).toFixed(2) + "B": overviewData.marketCap}
                  </div>
                </div>
              )}
              {overviewData.peRatio !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">P/E Ratio</div>
                  <div className="text-xs font-medium text-white">
                    {parseFloat(overviewData.peRatio)}
                  </div>
                </div>
              )}
              {overviewData.eps !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">EPS</div>
                  <div className="text-xs font-medium text-white">
                    ${parseFloat(overviewData.eps)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Financial Metrics</h3>
            <div className="grid grid-cols-3 gap-2">
              {overviewData.dividendYield !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Dividend Yield</div>
                  <div className="text-xs font-medium text-white">
                    {(parseFloat(overviewData.dividendYield) * 100)}%
                  </div>
                </div>
              )}
              {overviewData.profitMargin !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Profit Margin</div>
                  <div className="text-xs font-medium text-white">
                    {(parseFloat(overviewData.profitMargin) * 100)}%
                  </div>
                </div>
              )}
              {overviewData.beta !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Beta</div>
                  <div className="text-xs font-medium text-white">
                    {parseFloat(overviewData.beta)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Forward Metrics</h3>
            <div className="grid grid-cols-3 gap-2">
              {overviewData.forwardPE !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Forward P/E</div>
                  <div className="text-xs font-medium text-white">
                    {parseFloat(overviewData.forwardPE)}
                  </div>
                </div>
              )}
              {overviewData.priceToSalesRatio !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">P/S Ratio</div>
                  <div className="text-xs font-medium text-white">
                    {parseFloat(overviewData.priceToSalesRatio).toFixed(2)}
                  </div>
                </div>
              )}
              {overviewData.bookValue !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Book Value</div>
                  <div className="text-xs font-medium text-white">
                    ${parseFloat(overviewData.bookValue).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
      //end of charles on this part
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
          <HeaderActions>
            <WishlistButton 
              onClick={toggleWishlist}
              className={isInWishlist ? "added" : ""}
            >
              {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </WishlistButton>
            <CloseButton onClick={onClose}>×</CloseButton>
          </HeaderActions>
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
