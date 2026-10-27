import { useEffect, useRef, useState, type FormEvent } from "react";
import "./App.css";

const PAGE_SIZE = 10;

const areaNames = [
  "Ayesha Park Colony",
  "Bhiki Road",
  "Ghang Road",
  "Gloria Colony",
  "Housing Colony",
  "Khalid Road",
  "Nabi Pura",
  "Officer Colony",
  "Tariq Road",
  "VIP Town Sheikhupura",
];

interface Listing {
  _id: string;
  title: string;
  purpose: "buy" | "rent";
  propertyType: "house" | "flat" | "plot";
  priceRs: number;
  bedrooms: number;
  sizeMarla: number;
  description: string;
}

type SearchDefinition =
  | { kind: "natural"; query: string }
  | { kind: "filters"; filters: Record<string, string> };

interface SearchResult {
  results: Listing[];
  notice?: string;
  interpretedAs?: Record<string, unknown>;
  availableAreas?: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isListing(value: unknown): value is Listing {
  return (
    isRecord(value) &&
    typeof value._id === "string" &&
    typeof value.title === "string" &&
    (value.purpose === "buy" || value.purpose === "rent") &&
    (value.propertyType === "house" ||
      value.propertyType === "flat" ||
      value.propertyType === "plot") &&
    typeof value.priceRs === "number" &&
    typeof value.bedrooms === "number" &&
    typeof value.sizeMarla === "number" &&
    typeof value.description === "string"
  );
}

function parseSearchResult(payload: unknown): SearchResult {
  if (Array.isArray(payload) && payload.every(isListing)) {
    return { results: payload };
  }

  if (
    isRecord(payload) &&
    Array.isArray(payload.results) &&
    payload.results.every(isListing)
  ) {
    return {
      results: payload.results,
      notice: typeof payload.notice === "string" ? payload.notice : undefined,
      interpretedAs: isRecord(payload.interpretedAs)
        ? payload.interpretedAs
        : undefined,
      availableAreas: Array.isArray(payload.availableAreas)
        ? payload.availableAreas.filter(
            (area): area is string => typeof area === "string",
          )
        : undefined,
    };
  }

  throw new Error("The server returned listings in an unexpected format.");
}

function buildUrl(search: SearchDefinition, page: number): string {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  if (search.kind === "natural") {
    params.set("q", search.query);
    return `/api/listings/search?${params.toString()}`;
  }

  for (const [key, value] of Object.entries(search.filters)) {
    if (value) params.set(key, value);
  }

  return `/api/listings?${params.toString()}`;
}

async function requestListings(
  search: SearchDefinition,
  page: number,
  signal: AbortSignal,
): Promise<SearchResult> {
  const apiBaseUrl: string = import.meta.env.VITE_API_URL ?? "";
  const response = await fetch(`${apiBaseUrl}${buildUrl(search, page)}`, {
    signal,
  });
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : `Search failed (${response.status}). Please try again.`;
    throw new Error(message);
  }

  return parseSearchResult(payload);
}

function formatPrice(price: number): string {
  if (price >= 10_000_000) {
    return `Rs ${(price / 10_000_000).toLocaleString("en-PK", {
      maximumFractionDigits: 2,
    })} crore`;
  }

  if (price >= 100_000) {
    return `Rs ${(price / 100_000).toLocaleString("en-PK", {
      maximumFractionDigits: 2,
    })} lakh`;
  }

  return `Rs ${price.toLocaleString("en-PK")}`;
}

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [areaName, setAreaName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [interpretedAs, setInterpretedAs] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [activeSearch, setActiveSearch] = useState<SearchDefinition>({
    kind: "filters",
    filters: {},
  });
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;
    requestRef.current = controller;

    requestListings({ kind: "filters", filters: {} }, 1, controller.signal)
      .then((result) => {
        if (!isCurrent) return;
        setListings(result.results);
        setHasMore(result.results.length === PAGE_SIZE);
        setNotice(result.notice ?? "");
        setAvailableAreas(result.availableAreas ?? []);
        setInterpretedAs(result.interpretedAs ?? null);
      })
      .catch((requestError: unknown) => {
        if (
          !isCurrent ||
          (requestError instanceof Error && requestError.name === "AbortError")
        ) {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, []);

  function runSearch(
    search: SearchDefinition,
    requestedPage = 1,
    append = false,
  ) {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError("");
    setNotice("");
    setAvailableAreas([]);
    setInterpretedAs(null);
    if (!append) setListings([]);

    void requestListings(search, requestedPage, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setListings((current) =>
          append ? [...current, ...result.results] : result.results,
        );
        setHasMore(result.results.length === PAGE_SIZE);
        setPage(requestedPage);
        setNotice(result.notice ?? "");
        setAvailableAreas(result.availableAreas ?? []);
        setInterpretedAs(result.interpretedAs ?? null);
      })
      .catch((requestError: unknown) => {
        if (
          controller.signal.aborted ||
          (requestError instanceof Error && requestError.name === "AbortError")
        ) {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }

  function handleNaturalSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Enter a description of the home you are looking for.");
      return;
    }

    const search: SearchDefinition = { kind: "natural", query: trimmedQuery };
    setActiveSearch(search);
    runSearch(search);
  }

  function handleFilterSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search: SearchDefinition = {
      kind: "filters",
      filters: { purpose, propertyType, maxPrice, minBedrooms, areaName },
    };
    setActiveSearch(search);
    setQuery("");
    runSearch(search);
  }

  function handleClearFilters() {
    setPurpose("");
    setPropertyType("");
    setMaxPrice("");
    setMinBedrooms("");
    setAreaName("");
    setQuery("");
    const search: SearchDefinition = { kind: "filters", filters: {} };
    setActiveSearch(search);
    runSearch(search);
  }

  return (
    <div className="site">
      <header className="site-header">
        <a className="site-name" href="#top">
          Nexa Estates
        </a>
        <nav aria-label="Main navigation">
          <a href="#search">Search</a>
          <a href="#listings">Listings</a>
        </nav>
      </header>

      <main className="main-content" id="top">
        <section className="search-section" id="search">
          <h1>Find a home in Sheikhupura</h1>
          <p className="intro">
            Search listings using a description or a few simple filters.
          </p>

          <form className="natural-search" onSubmit={handleNaturalSearch}>
            <label htmlFor="home-search">
              Describe what you are looking for
            </label>
            <div className="search-controls">
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. a quiet 5 marla house near schools"
                maxLength={200}
              />
              <button type="submit" disabled={loading}>
                Search
              </button>
            </div>
            <p className="example">
              Example: “A peaceful house for rent with 3 bedrooms”
            </p>
          </form>

          <details className="filter-details">
            <summary>Search with filters</summary>
            <form className="filter-form" onSubmit={handleFilterSearch}>
              <label>
                Purpose
                <select
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                >
                  <option value="">Buy or rent</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
              </label>
              <label>
                Property type
                <select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                >
                  <option value="">Any type</option>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="plot">Plot</option>
                </select>
              </label>
              <label>
                Minimum bedrooms
                <select
                  value={minBedrooms}
                  onChange={(event) => setMinBedrooms(event.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1 or more</option>
                  <option value="2">2 or more</option>
                  <option value="3">3 or more</option>
                  <option value="4">4 or more</option>
                  <option value="5">5 or more</option>
                </select>
              </label>
              <label>
                Maximum price
                <select
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                >
                  <option value="">No limit</option>
                  <option value="5000000">Rs 50 lakh</option>
                  <option value="10000000">Rs 1 crore</option>
                  <option value="20000000">Rs 2 crore</option>
                  <option value="50000000">Rs 5 crore</option>
                </select>
              </label>
              <label>
                Area
                <select
                  value={areaName}
                  onChange={(event) => setAreaName(event.target.value)}
                >
                  <option value="">All areas</option>
                  {areaNames.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>
              <div className="filter-actions">
                <button type="submit" disabled={loading}>
                  Apply filters
                </button>
                <button
                  className="text-button"
                  type="button"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </form>
          </details>
        </section>

        <section className="listings-section" id="listings">
          <div className="section-heading">
            <h2>Listings</h2>
            {!loading && (
              <span>
                {listings.length}
                {hasMore ? "+" : ""} found
              </span>
            )}
            {loading && <span>Searching…</span>}
          </div>

          {error && (
            <p className="message message-error" role="alert">
              {error}
            </p>
          )}
          {notice && <p className="message">{notice}</p>}
          {availableAreas.length > 0 && (
            <p className="message">
              Areas covered: {availableAreas.join(", ")}.
            </p>
          )}
          {interpretedAs && Object.keys(interpretedAs).length > 0 && (
            <p className="search-interpretation">
              Search interpreted as:{" "}
              {Object.entries(interpretedAs)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(", ")}
            </p>
          )}

          {loading && listings.length === 0 ? (
            <p className="status-message" role="status">
              Loading listings…
            </p>
          ) : listings.length > 0 ? (
            <ul className="listing-list">
              {listings.map((listing) => (
                <li key={listing._id}>
                  <article className="listing">
                    <div className="listing-info">
                      <h3>{listing.title}</h3>
                      <p>{listing.description}</p>
                      <p className="listing-details">
                        {listing.propertyType}
                        {listing.propertyType !== "plot" &&
                          ` · ${listing.bedrooms} ${
                            listing.bedrooms === 1 ? "bedroom" : "bedrooms"
                          }`}
                        {" · "}
                        {listing.sizeMarla} marla
                        {" · "}
                        {listing.purpose === "buy" ? "For sale" : "For rent"}
                      </p>
                    </div>
                    <p className="listing-price">
                      {formatPrice(listing.priceRs)}
                      {listing.purpose === "rent" && <span> / month</span>}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            !loading && (
              <p className="status-message">
                No listings found. Try another description or adjust your
                filters.
              </p>
            )
          )}

          {hasMore && !loading && (
            <button
              className="more-button"
              type="button"
              onClick={() => runSearch(activeSearch, page + 1, true)}
            >
              Load more listings
            </button>
          )}
        </section>
      </main>

      <footer className="site-footer">
        Nexa Estates · Property listings for Sheikhupura
      </footer>
    </div>
  );
}

export default App;
