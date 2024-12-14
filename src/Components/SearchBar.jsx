//to be honest i got this all from chat

import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState(""); // State to store the search query
  const [results, setResults] = useState([]); // State to store API results
  const debounceDelay = 500; // Delay in milliseconds

  useEffect(() => {
    // Only make API call if query is not empty
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchData(query); // Call API after the debounce delay
    }, debounceDelay);

    // Cleanup function to cancel previous timer
    return () => clearTimeout(timer);
  }, [query]);

  // Function to fetch data from API
  const fetchData = async (searchQuery) => {
    try {
      const response = await axios.get(`https://api.example.com/search?q=${searchQuery}`);
      setResults(response.data.results); // Update results with API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="border p-2 rounded w-full"
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result.name}</li> // Render API results
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
