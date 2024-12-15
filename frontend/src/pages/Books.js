import React, { useState, useEffect } from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  let navigate = useNavigate();
  let [books, setBooks] = useState([]); // Store the books fetched from the backend
  let [filteredBooks, setFilteredBooks] = useState([]); // Store filtered books
  let [page, setPage] = useState(1); // Current page for pagination
  let [totalPages, setTotalPages] = useState(1); // Total number of pages for pagination
  let [limit, setLimit] = useState(); // Limit for books per page

  const [priceMin, setPriceMin] = useState(''); // Minimum price filter
  const [priceMax, setPriceMax] = useState(''); // Maximum price filter
  const [categories, setCategories] = useState(''); // Categories filter
  const [authors, setAuthors] = useState(''); // Authors filter

  const [filtersVisible, setFiltersVisible] = useState(false); // Toggle for filters visibility

  // Helper function to update filters in the API request
  const constructFilterParams = () => {
    const params = new URLSearchParams();
    if (priceMin) params.append('price_min', priceMin); // Updated key to price_min
    if (priceMax) params.append('price_max', priceMax); // Updated key to price_max
    if (categories) params.append('categories', categories);
    if (authors) params.append('authors', authors);
    return params;
  };
  

  const getBooksWithFilters = async (currentPage = 1) => {
    try {
      const params = constructFilterParams();
      params.append('page', currentPage);

      console.log("Fetching books with filters:", params.toString());

      const response = await fetch(`http://localhost:3000/books/filter?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data && Array.isArray(data.results)) {
        setFilteredBooks(data.results);
        setPage(currentPage); // Update the current page
        
        // Update totalPages dynamically, defaulting to 1 if not provided
        if (data.info && data.info.pages) {
          setTotalPages(data.info.pages); // Correctly set totalPages
        } else {
          console.error("Missing 'pages' field in response metadata");
          setTotalPages(1); // Fallback to 1 if totalPages is missing
        }
      } else {
        setFilteredBooks([]);
        setTotalPages(1);
        console.error("Invalid response structure:", data);
      }
    } catch (error) {
      console.error('Error fetching filtered books:', error);
      setFilteredBooks([]);
      setTotalPages(1);
    }
};


  // Fetch books with limit applied
  const getBooksWithLimit = async (currentPage = 1) => {
    try {
      let response;
      if (limit !== undefined) {
        response = await fetch(`http://localhost:3000/books/top/${limit}?page=${currentPage}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response = await fetch(`http://localhost:3000/books?page=${currentPage}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setBooks(data); // Ensure books is always an array
        setFilteredBooks(data); // Reset filteredBooks when books are fetched
        setTotalPages(1); // If not paginated, set totalPages to 1
      } else if (data.results && Array.isArray(data.results)) {
        setBooks(data.results);
        setFilteredBooks(data.results);
        setPage(currentPage);
        setTotalPages(data.info?.pages || 1);
      } else {
        setBooks([]);
        setFilteredBooks([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setFilteredBooks([]);
    }
  };

  // Reset all filter states and fetch unfiltered books
  const resetFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setCategories('');
    setAuthors('');
    setFiltersVisible(false); // Hide filter options after reset
    setLimit(null); // Optional: Reset limit if desired
    getBooksWithLimit(); // Fetch all books without filters
  };

  // Handle limit change and trigger data fetch
  const handleChange = (e) => {
    const newLimit = e.target.elements.limit.value;
    if (newLimit.length > 0) {
      setPage(1);
      e.preventDefault();
      setLimit(newLimit); // Set new limit
      getBooksWithLimit(1); // Trigger book fetch with new limit
    } else {
      alert('Enter valid limit!');
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      // Pass the current page + 1 and filters to the fetch function
      getBooksWithFilters(page + 1); 
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      // Pass the current page - 1 and filters to the fetch function
      getBooksWithFilters(page - 1);
    }
  };
  

  // Trigger the fetch function based on whether limit is set or filters are present
  useEffect(() => {
    if (priceMin || priceMax || categories || authors) {
      getBooksWithFilters(); // Fetch books based on filters
    } else if (limit) {
      getBooksWithLimit(); // Fetch books based on limit
    } else {
      getBooksWithLimit(); // Fetch all books when no filters and no limit are set
    }
  }, [limit, priceMin, priceMax, categories, authors]); // Re-fetch when any filter or limit changes

  return (
    <div className="container pt-5 pb-5">
      <Button href={"/"} variant="outline-secondary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br /><br />
      <h2>Books</h2>
      <Button href={"/postbook/"} target="_blank" variant="outline-success">
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <form onSubmit={handleChange}>
        <label htmlFor="limit">Limit:</label>
        <input type="number" step="0" min="1" id="limit" name="limit" defaultValue={limit || ""}></input>
        <Button type="submit" variant="outline-success">
          <FontAwesomeIcon icon={faFilter} />
        </Button>
      </form>

      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/books/job')}>
          View Job Reviews
        </Button>
      </div>

      <Button 
        variant="outline-primary" 
        onClick={() => setFiltersVisible(!filtersVisible)} 
        className="mt-4"
      >
        {filtersVisible ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <br></br>

      {filtersVisible && (
        <div className="filters mt-4">
          <h5>Filter Books</h5>
          <div>
            <label>Price Min:</label>
            <input 
              type="number" 
              value={priceMin} 
              onChange={(e) => setPriceMin(e.target.value)} 
              className="form-control mb-2"
            />
          </div>
          <div>
            <label>Price Max:</label>
            <input 
              type="number" 
              value={priceMax} 
              onChange={(e) => setPriceMax(e.target.value)} 
              className="form-control mb-2"
            />
          </div>
          <div>
            <label>Categories:</label>
            <input 
              type="text" 
              value={categories} 
              onChange={(e) => setCategories(e.target.value)} 
              className="form-control mb-2" 
              placeholder="Comma separated categories"
            />
          </div>
          <div>
            <label>Authors:</label>
            <input 
              type="text" 
              value={authors} 
              onChange={(e) => setAuthors(e.target.value)} 
              className="form-control mb-2" 
              placeholder="Comma separated authors"
            />
          </div>
          <Button variant="outline-secondary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )}

      <br></br>

      {/* Book Cards */}
      {Array.isArray(filteredBooks) && filteredBooks.length === 0 ? (
        <div className="alert alert-info mt-4">No books found.</div>
      ) : (
        <CardGroup>
          <Row xs={1} md={2} className="d-flex justify-content-around">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} {...book} />
            ))}
          </Row>
        </CardGroup>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <Button 
          onClick={handlePreviousPage} 
          variant={page === 1 ? "outline-secondary" : "outline-primary"} 
          disabled={page === 1}
        >
          Previous Page
        </Button>
        <span>Page {page} of {totalPages}</span> {/* Updated to show dynamic totalPages */}
        <Button 
          onClick={handleNextPage} 
          variant={page === totalPages ? "outline-secondary" : "outline-primary"} 
          disabled={page === totalPages}
        >
          Next Page
        </Button>
      </div>

    </div>
  );
}
