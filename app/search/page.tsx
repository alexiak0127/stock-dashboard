//Ahemed's code
// This component provides a stock search interface, allowing users to search 
// for companies or ticker symbols to view basic stock info, and open a modal 
"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styled from "styled-components";
import { StockModal } from "@/components/StockModal";

export type SearchResult = {
  symbol: string;
  name: string;
  region: string;
  currency: string;
};

export const PageWrapper = styled.main`
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #d0e3cc;
  font-size: 1.8rem;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const Subtitle = styled.p`
  color: #e5e7eb;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
`;

export const SearchForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background-color: #020824;
  color: #e5e7eb;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #d0e3cc;
  }
`;

export const SearchButton = styled.button`
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  border: none;
  background-color: #d0e3cc;
  color: #020824;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const ResultsWrapper = styled.section`
  margin-top: 1.5rem;
`;

export const ResultsTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
`;

export const ResultsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 18rem;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background-color: #020824;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d0e3cc;
    transform: translateY(-2px);
  }
`;

export const Symbol = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

export const Company = styled.span`
  font-size: 1rem;
  color: #e5e7eb;
`;

export const Meta = styled.span`
  font-size: 0.9rem;
  color: #9ca3af;
`;

export const Message = styled.p`
  margin-top: 0.75rem;
  color: #9ca3af;
`;

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ ticker: string; name: string; region?: string; currency?: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return; //if empty search doesn't search

    setLoading(true); //starts loading while searching
    setError(null);
    setHasSearched(true); //sets that it is searching 

    //searches using the keyword like pharma or ticker like AAPL
    try {
      //makes the call to the API who then returns the result
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setResults(data.results ?? []); //data is set to a list which is then
                                   // mapped over when displayed to show all results

    } catch (err) {
      setError("Something went wrong.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper>
      <CloseButton onClick={() => router.back()}>×</CloseButton>

      <Title>Search stocks</Title>
      <Subtitle>
        Search by company name or ticker symbol and see the latest closing price.
      </Subtitle>

      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          placeholder="e.g. AAPL, MSFT, Tesla, banking..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchButton type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </SearchButton>
      </SearchForm>

      <ResultsWrapper>
        {error && <Message>{error}</Message>}

        {!error && hasSearched && results.length === 0 && !loading && (
          <Message>No results found.</Message>
        )}

        {results.length > 0 && (
          <>
            <ResultsTitle>Results</ResultsTitle>
            <ResultsGrid>
              {results.map((r) => (
                <Card key={r.symbol} onClick={() => setSelectedStock({ ticker: r.symbol, name: r.name })}>
                  <Symbol>{r.symbol}</Symbol>
                  <Company>{r.name}</Company>
                  <Meta>
                    {r.region} · {r.currency}
                  </Meta>
                </Card>
              ))}
            </ResultsGrid>
          </>
        )}
      </ResultsWrapper>

      <StockModal
        ticker={selectedStock?.ticker || ""}
        companyName={selectedStock?.name}
        region={selectedStock?.region}
        currency={selectedStock?.currency}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      />
    </PageWrapper>
  );
}
