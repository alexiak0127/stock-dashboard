"use client"; // This is a Client Component for usestate & useeffect
//Charles Yao. Favorite page that shows the user their saved watchlist from mongodb and fetches data from the stock API to show real time updated data.
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react"; // NextAuth hook for authentication
import { StockModal } from "@/components/StockModal";
// literally reusing all styled components from search page, also the data type
import {
  PageWrapper,
  CloseButton,
  Title,
  Subtitle,
  ResultsWrapper,
  ResultsTitle,
  ResultsGrid,
  Card,
  Symbol,
  Company,
  Message,
  Meta,
  Price,
  SearchResult
} from "@/app/search/page";

export default function FavoritesPage() {
  // nav & route
  const router = useRouter(); 
  const params = useParams();
  //useSession gets current login user info
  const { data: session, status } = useSession();
  const [results, setResults] = useState<SearchResult[]>([]); // stores fav stocks with prices
  // Stores clicked stock for modal display
  const [selectedStock, setSelectedStock] = useState<{ ticker: string; name: string; region?: string; currency?: string } | null>(null);

  // validate user
  useEffect(() => {
    if (status === "loading") return;
    // no user just jo back to login
    if (!session?.user) {
      router.push("/login");
      return;
    }
    // prevent other user peaking
    if (params.id !== session.user.id) {
      router.push(`/user/${session.user.id}/favorites`);
    }
  }, [session, status, params.id, router]);

  //fetch favorite stocks from mongodb and get their prices from stock API
  useEffect(() => {
    async function loadWatchlist() {
      // fetch user's saved watchlist from db with backend api call
      const res = await fetch("/api/wishlist");
      if (!res.ok) return; //failed case return
      const { wishlist } = await res.json(); //array from response

      // get the price for each stock in wishlist
      const stocksWithData = await Promise.all(
        //map stocks to price
        wishlist.map(async (item: { ticker: string; name: string; region: string; currency: string }) => {
          // Fetch 
          const priceRes = await fetch(`/api/price/${item.ticker}`);
          const data = await priceRes.json();

          // data from mongodb and price from api
          return {
            symbol: item.ticker,
            name: item.name,
            region: item.region || "N/A",
            currency: item.currency || "USD", // these above four are from mongodb return
            price: data.latestClose || null   //from api
          };
        })
      );
      setResults(stocksWithData); // re-render with new data
    }

    loadWatchlist();
  }, []);

  // JSX RETURN: Render the UI
  // Reuses styled components from search page for consistent design
  return (
    <PageWrapper>
      <CloseButton onClick={() => router.back()}>×</CloseButton>
      <Title>My Watchlist</Title>
      <Subtitle>Track your favorite stocks in one place</Subtitle>

      <ResultsWrapper>
        {/*show no stock if you just, emm have nothing in wishlist*/}
        {results.length === 0 ? (
          <Message>No stocks in your watchlist yet.</Message>
        ) : (
  
          <>
            <ResultsTitle>Your Stocks</ResultsTitle>
            <ResultsGrid>
              {/* Render all Card component with all the same component as search actually */}
              {results.map((r) => (
                <Card
                  key={r.symbol}
                  onClick={() => setSelectedStock({
                    ticker: r.symbol,
                    name: r.name,
                    region: r.region,
                    currency: r.currency
                  })}
                >
                  <Symbol>{r.symbol}</Symbol>
                  <Company>{r.name}</Company>
                  <Meta>
                    {/*region and currency from MongoDB */}
                    {r.region} · {r.currency}
                  </Meta>
                  <Price>
                    {/* N/A if db have no response */}
                    {r.price != null ? `$${r.price.toFixed(2)}` : "Price N/A"}
                  </Price>
                </Card>
              ))}
            </ResultsGrid>
          </>
        )}
      </ResultsWrapper>

      {/* LINK TO DETAILED STOCKMODAL page */}
      <StockModal
        ticker={selectedStock?.ticker || ""}
        companyName={selectedStock?.name} // ? allow for null to prevent crashing
        region={selectedStock?.region}
        currency={selectedStock?.currency}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)} // Close by setting selectedStock back to null
      />
    </PageWrapper>
  );
}
