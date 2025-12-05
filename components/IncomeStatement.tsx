"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

type Report = { [key: string]: string };
type FinancialData = {
  annualReports?: Report[];
};

const METRICS = [
  { key: "totalRevenue", label: "Total Revenue" },
  { key: "costOfRevenue", label: "Cost of Revenue" },
  { key: "grossProfit", label: "Gross Profit" },
  { key: "operatingExpenses", label: "Operating Expenses" },
  { key: "operatingIncome", label: "Operating Income" },
  { key: "netIncome", label: "Net Income" },
  { key: "ebitda", label: "EBITDA" },
];

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background-color: rgba(2, 8, 36, 0.6);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9ca3af;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  white-space: nowrap;
  background-color: rgba(1, 12, 43, 0.8);
  &:first-child { position: sticky; left: 0; z-index: 1; }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #ffffff;
  white-space: nowrap;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  &:first-child {
    position: sticky;
    left: 0;
    background-color: rgba(2, 8, 36, 0.6);
    z-index: 1;
    font-weight: 500;
    color: #d0e3cc;
  }
`;

const Message = styled.div<{ $error?: boolean }>`
  text-align: center;
  color: ${(p) => (p.$error ? "#fca5a5" : "#9ca3af")};
  padding: 2rem;
`;

const formatNumber = (value?: string) => {
  if (!value || value === "None") return "-";
  const num = parseFloat(value);
  return isNaN(num) ? "-" : num.toLocaleString();
};

export function IncomeStatement({ ticker }: { ticker: string }) {
  const [data, setData] = useState<FinancialData>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        setError("");
        const response = await fetch(`/api/income-statement/${ticker}`);
        const result = await response.json();
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch {
        setError("Failed to load income statement");
      }
    }

    fetchData();
  }, [ticker]);

  if (error) return <Message $error>Error: {error}</Message>;
  if (data.annualReports === undefined) return <Message>Loading income statement...</Message>;

  const reports = (data.annualReports || [])
    .sort((a, b) => {
      const dateA = a.fiscalDateEnding || "";
      const dateB = b.fiscalDateEnding || "";
      return dateB.localeCompare(dateA);
    })
    .slice(0, 10);

  return (
    <div>
      <SectionTitle>Income Statement</SectionTitle>
      {reports.length === 0 ? (
        <Message>No data available</Message>
      ) : (
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>Metric</Th>
                {reports.map((r) => <Th key={r.fiscalDateEnding}>{r.fiscalDateEnding}</Th>)}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => (
                <tr key={m.key}>
                  <Td>{m.label}</Td>
                  {reports.map((r) => (
                    <Td key={`${m.key}-${r.fiscalDateEnding}`}>{formatNumber(r[m.key])}</Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      )}
    </div>
  );
}
