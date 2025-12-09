"use client";
// Done collectively by the group
// styling and modal logic by Alexia Kim
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
  position: relative;
`;

const ChartTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  background: rgba(2, 8, 36, 0.95);
  border: 1px solid rgba(208, 227, 204, 0.5);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  pointer-events: none;
  color: #ffffff;
  font-size: 0.85rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export function StockModal({ ticker, companyName, region, currency, isOpen, onClose }: StockModalProps) {
  // Track which tab is currently active (Overview, Financials, or Price)
  const [activeTab, setActiveTab] = useState<"overview" | "financials" | "price">("overview");
  // Store price data (current price, change, chart points) fetched from API
  const [stockData, setStockData] = useState<StockData | null>(null);
  // Store company overview data (description, sector, financial metrics) from API
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  // Track any errors that occur during data fetching
  const [error, setError] = useState<string | null>(null);
  // Track whether this stock is in the user's wishlist
  const [isInWishlist, setIsInWishlist] = useState(false);
  // Track the currently hovered point on the price chart for tooltip display
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; date: string } | null>(null);

  // Start of Charles duplicate wishlist check
  // Runs whenever the ticker changes to update the wishlist button state
  useEffect(() => {
    // Async function to fetch user's wishlist from the API
    async function checkWishlist() {
      try {
        // Fetch the user's wishlist from MongoDB
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const { wishlist } = await res.json();
          // Array.isArray() prevents errors if wishlist is undefined or null
          // .some() returns true if any item in the array matches the current ticker
          setIsInWishlist(Array.isArray(wishlist) && wishlist.some((item: { ticker: string }) => item.ticker === ticker));
        }
      } catch (err) {
        // console log errors without breaking the UI
        console.error(err);
      }
    }
    // Execute the check when the modal opens or ticker changes
    checkWishlist();
  }, [ticker]); // Re-run this effect whenever the ticker prop changes
  // end of charles for wishlist part functionality
  useEffect(() => {
    // Don't fetch data if modal is closed
    if (!isOpen) return;

    async function fetchData() {
      try {
        setError(null);
        // Fetch both price data and overview data in parallel for better performance
        const [priceRes, overviewRes] = await Promise.all([
          fetch(`/api/price/${ticker}`),
          fetch(`/api/overview/${ticker}`),
        ]);
        const priceData = await priceRes.json();
        const overviewDataRes = await overviewRes.json();
        
        // Handle price data response
        if (priceData.error) {
          setError(priceData.error);
        } else {
          setStockData(priceData);
        }
    
        // Handle overview data response
        if (!overviewDataRes.error) {
          setOverviewData(overviewDataRes);
        }
      } catch {
        setError("Failed to load data");
      }
    }

    fetchData();
  }, [ticker, isOpen]);

  // Start Charles Yao, add/remove stock from user's wishlist
  // This function toggles the wishlist state, making API calls to add or remove stocks
  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        //remove from wishlist
        const res = await fetch(`/api/wishlist?ticker=${ticker}`, {
          method: "DELETE",
        });
        // If removal was successful, update the local state to reflect removal 
        if (res.ok) {
          setIsInWishlist(false);
        }
      } else {
        // ADD TO WISHLIST FLOW
        // Send POST request with stock details to save to user's MongoDB wishlist
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Include all stock information needed to display in the favorites page
          body: JSON.stringify({
            ticker: ticker,    //stock refering symbol
            name: companyName || ticker, // company name
            region: region || "N/A",     //stock region
            currency: currency || "USD", 
          }),
        });

        //update the local state to reflect addition, if successful
        if (res.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (err) {
      // Log errors without breaking the UI
      console.error("Failed to toggle wishlist:", err);
    }
  };

  if (!isOpen) return null;
  // charles yao the overview part, uses similar logic as the team
  const renderContent = () => {
    if (error) {
      return <ErrorMessage>Error: {error}</ErrorMessage>;
    }
    //no data error
    if (!stockData) {
      return <ErrorMessage>No data available</ErrorMessage>;
    }
    //only return when on the tab, and
    if (activeTab === "overview") {
      if (!overviewData) {
        return <ErrorMessage>Overview data not available</ErrorMessage>;
      }
      // the overview page, copy, paste styling with one polished box.
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
                      {/*we want to show with b so the bracket could fit and looks better*/}
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
                      {/*make it shows with percentage and 2 digits*/}
                    {(parseFloat(overviewData.dividendYield) * 100).toFixed(2)}%
                  </div>
                </div>
              )}
              {overviewData.profitMargin !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Profit Margin</div>
                  <div className="text-xs font-medium text-white">
                    {(parseFloat(overviewData.profitMargin) * 100).toFixed(2)}%
                  </div>
                </div>
              )}
              {overviewData.beta !== "N/A" && (
                <div className="rounded-lg bg-slate-900 bg-opacity-60 border border-slate-700 border-opacity-40 p-3">
                  <div className="text-xs text-slate-400 mb-1">Beta</div>
                  <div className="text-xs font-medium text-white">
                    {parseFloat(overviewData.beta).toFixed(2)}
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
                    {parseFloat(overviewData.forwardPE).toFixed(2)}
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

    // start Raymond's financials tab
    if (activeTab === "financials") {
      return <IncomeStatement ticker={ticker} />;
    }
    // end Raymond's financials tab
    
    // start of Alexia Kim's price tab
    if (activeTab === "price") {
      // Price tab - display current price, changes, and 60-day chart
      const { latestClose, prevClose, diff, pct, high, low, latestDate, chartData } = stockData;
      const positive = diff >= 0; // Determine if stock price went up (green) or down (red)

      // Prepare chart data: normalize prices to fit within SVG viewBox because SVG viewBox uses arbitrary coordinate system
      const closes = chartData.map((p) => p.close); // Extract all closing prices
      const minClose = Math.min(...closes); // Find lowest price for scaling
      const maxClose = Math.max(...closes); // Find highest price for scaling
      const range = maxClose - minClose || 1; // Calculate price range

      // Convert each data point to SVG coordinates
      const points = chartData
        .map((point, index) => {
          // X coordinate: spread data points evenly from 0 to 100
          const x = (index / Math.max(chartData.length - 1, 1)) * 100;
          // Y coordinate: normalize price to 0-1 range, then scale to fit chart height
          const normalized = (point.close - minClose) / range;
          // Flip Y axis because SVG has Y=0 at top, but we want high prices at top visually
          const y = 90 - normalized * 70;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" "); // Join into space-separated string for SVG polyline

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
              // Track mouse movement over the chart to show price at hovered position
              // This provides interactive feedback to help users read exact values from the chart
              onMouseMove={(e) => {
                const svg = e.currentTarget;
                const rect = svg.getBoundingClientRect();
                // Convert mouse X position to percentage relative to SVG viewBox
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                // Map X percentage to the nearest data point index
                const index = Math.round((x / 100) * (chartData.length - 1));
                
                // Validate index is within chart data bounds to prevent errors
                if (index >= 0 && index < chartData.length) {
                  const point = chartData[index];
                  // Calculate Y position on the chart for this price
                  const normalized = (point.close - minClose) / range;
                  const y = 90 - normalized * 70;
                  // Update hover state with position and price data for tooltip display
                  setHoveredPoint({ x, y, price: point.close, date: point.date });
                }
              }}
              // Clear hover state when mouse leaves the chart to hide tooltip
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Horizontal baseline at bottom of chart */}
              <line
                x1="0"
                y1="90"
                x2="100"
                y2="90"
                stroke="rgba(148,163,184,0.4)"
                strokeWidth="0.3"
              />
              {/* Main price line chart */}
              <polyline
                fill="none"
                stroke="#D0E3CC"
                strokeWidth="1.5"
                points={points}
              />
              {/* Show hover indicator when hovering over chart */}
              {hoveredPoint && (
                <>
                  {/* Blue dot at hovered position */}
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="1.2"
                    fill="#3b82f6"
                  />
                  {/* Vertical dashed line at hovered position */}
                  <line
                    x1={hoveredPoint.x}
                    y1="10"
                    x2={hoveredPoint.x}
                    y2="90"
                    stroke="rgba(208,227,204,0.3)"
                    strokeWidth="0.3"
                    strokeDasharray="2,2"
                  />
                </>
              )}
            </svg>
            {/* Tooltip showing price and date at hovered position */}
            {hoveredPoint && (
              <ChartTooltip style={{ left: `${hoveredPoint.x}%` }}>
                <div style={{ fontWeight: 600 }}>${hoveredPoint.price.toFixed(2)}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{hoveredPoint.date}</div>
              </ChartTooltip>
            )}
          </ChartContainer>
        </>
      );
    }
    // end of Alexia Kim's price tab
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
