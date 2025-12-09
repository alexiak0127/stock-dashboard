"use client";
//Charles Yao. Favorite page that shows the user their saved watchlist from mongodb and fetches data from the stock API to show real time updated data.
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { StockModal } from "@/components/StockModal";
import {
  PageWrapper,CloseButton,Title,Subtitle,ResultsWrapper,ResultsTitle,ResultsGrid,
  Card,Symbol,Company,Message,Meta,Price,SearchResult
} from "@/app/search/page";

export default function FavoritesPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<{ ticker: string; name: string; region?: string; currency?: string } | null>(null);

  // Validate that the URL parameter matches the logged-in user
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Redirect if URL doesn't match logged-in user's ID
    if (params.id !== session.user.id) {
      router.push(`/user/${session.user.id}/favorites`);
    }
  }, [session, status, params.id, router]);

    // THE USE EFFECT, is to take data from the mongodb and fetch API CALLS to get the data! its not static like others normal projects!
  useEffect(() => {
    async function loadWatchlist() {
     //user saved watchlist taken from mongodb TO BE IMPLEMENTED
      const res = await fetch("/api/wishlist");
      if (!res.ok) return;

      const { wishlist } = await res.json();
      
      //fetch data same as the search page for saved stocks :)
      const stocksWithData = await Promise.all(
        wishlist.map(async (item: { ticker: string; name: string; region: string; currency: string }) => {
          const priceRes = await fetch(`/api/price/${item.ticker}`);
          const data = await priceRes.json();
          return {
            symbol: item.ticker,
            name: item.name,
            region: item.region || "N/A",
            currency: item.currency || "USD",
            price: data.latestClose || null
          };
        })
      );

      setResults(stocksWithData);
    }

    loadWatchlist();
  }, []);

  // reuse the styling from the search page to display the watchlist but instead of search results, its the tickers from mongodb binded to the current user.
  return (
    <PageWrapper>
      <CloseButton onClick={() => router.back()}>×</CloseButton>
      <Title>My Watchlist</Title>
      <Subtitle>Track your favorite stocks in one place</Subtitle>

      <ResultsWrapper>
        {results.length === 0 ? (
          <Message>No stocks in your watchlist yet.</Message>
        ) : (
          <>
            <ResultsTitle>Your Stocks</ResultsTitle>
            <ResultsGrid>
              {results.map((r) => (
                <Card key={r.symbol} onClick={() => setSelectedStock({ ticker: r.symbol, name: r.name, region: r.region, currency: r.currency })}>
                  <Symbol>{r.symbol}</Symbol>
                  <Company>{r.name}</Company>
                  <Meta>
                    {r.region} · {r.currency}
                  </Meta>
                  <Price>
                    {r.price != null ? `$${r.price.toFixed(2)}` : "Price N/A"}
                  </Price>
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
