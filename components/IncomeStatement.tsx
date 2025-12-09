// Raymond Code Block Start
"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

type Report = { [key: string]: string };
type FinancialData = {
  annualReports: Report[];
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
  font-size: calc(1vh + 1.2vw);
  font-weight: 600;
  color: #ffffff;
  margin-bottom: calc(1vh + 0.5vw);
  padding-bottom: calc(0.3vh + 0.2vw);
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: calc(2vh + 1vw);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background-color: rgba(2, 8, 36, 0.6);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

// styled table header (ex: used for metric dates)
const Th = styled.th`
  padding: calc(0.5vh + 0.3vw) calc(0.8vw + 0.5vh);
  text-align: left;
  font-size: calc(0.8vh + 0.9vw);
  font-weight: 600;
  color: #9ca3af;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  white-space: nowrap;
  background-color: rgba(1, 12, 43, 0.8);
  &:first-child { position: sticky; left: 0; z-index: 1; } //added this to make the first column sticky
`;

// styled table data (regular cell)
const Td = styled.td`
  padding: calc(0.5vh + 0.3vw) calc(0.8vw + 0.5vh);
  font-size: calc(0.9vh + 1vw);
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


const Message = styled.div<{ $error?: boolean }>`    //optionally styled as error
  text-align: center;
  color: ${(p) => (p.$error ? "#fca5a5" : "#9ca3af")}; // error messages are red, others are gray
  padding: calc(2vh + 1.5vw);
`;

const formatNumber = (value?: string) => { 
  if (!value || value === "None") return "-"; // if no value or value is "None", return "-"
  const num = parseFloat(value);
  return isNaN(num) ? "-" : num.toLocaleString(); // if the number is not a number, return "-"
};

export function IncomeStatement({ ticker }: { ticker: string }) {
  const [data, setData] = useState<FinancialData>({ annualReports: [] }); // initial state is an empty array
  const [error, setError] = useState<string>(""); // initial state is an empty string

  useEffect(() => {
    async function fetchData() {
      try {
        setError("");
        const response = await fetch(`/api/income-statement/${ticker}`); // fetch the income statement data from the API
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
  if (data.annualReports === undefined) return <Message>Loading income statement...</Message>; // if the data is undefined, show a loading message

  const reports = (data.annualReports || []) // get the annual reports
    .sort((a, b) => {
      const dateA = a.fiscalDateEnding || "";
      const dateB = b.fiscalDateEnding || "";
      return dateB.localeCompare(dateA);
    })
    .slice(0, 10); // slice the data to the first 10 items

  return (
    <div>
      <SectionTitle>Income Statement</SectionTitle>
      {reports.length === 0 ? ( // if the reports length is 0, show a message
        <Message>No data available</Message>
      ) : (
        <TableWrapper> {/* wrap the table in a wrapper */}
          <StyledTable> {/* styled table */}
            <thead>
              <tr>
                <Th>Metric</Th> {/* styled table header (ex: used for metric dates) */}
                {/* Map over reports to create table header cells for each fiscal date */}
                {reports.map((r) => <Th key={r.fiscalDateEnding}>{r.fiscalDateEnding}</Th>)}
              </tr>
            </thead>
            <tbody>
              {/* Map over METRICS array to create a table row for each financial metric */}
              {METRICS.map((m) => (
                <tr key={m.key}>
                  <Td>{m.label}</Td>
                  {/* Map over reports to create data cells showing the metric value for each fiscal period */}
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
// Raymond Code Block End