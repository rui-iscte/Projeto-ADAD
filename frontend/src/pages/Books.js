import React, { useState, useEffect } from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faFilter, faPlus, faStar, fa5, faComment } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  let navigate = useNavigate();
  let [books, setBooks] = useState([]); // Store the books fetched from the backend
  let [filteredBooks, setFilteredBooks] = useState([]); // Store filtered books
  let [page, setPage] = useState(1); // Current page for pagination
  let [totalPages, setTotalPages] = useState(1); // Total number of pages for pagination
  let [limit, setLimit] = useState(); // Limit for books per page
  let [order, setOrder] = useState();
  let [year, setYear] = useState();

  let [fetchUsedGet, setFetchUsedGet] = useState("limit");

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
      setFetchUsedGet("filters");

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
  const getBooksWithLimit = async (currentPage = 1, newLimit) => {
    try {
      setFetchUsedGet("limit");

      limit = newLimit ? newLimit: limit;

      let response;
      if (limit !== undefined) {
        const limitToUse = newLimit || limit;
        response = await fetch(`http://localhost:3000/books/top/${limitToUse}?page=${currentPage}`, {
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

      console.log(filteredBooks)
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setFilteredBooks([]);
    }
  };

  const getBooksWith5Star = async (currentPage = 1) => {
    try {
      setFetchUsedGet("5Star");

      let response = await fetch(`http://localhost:3000/books/star?page=${currentPage}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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

  const getBooksWithComments = async (currentPage = 1) => {
    try {
      setFetchUsedGet("comments");

      let response = await fetch(`http://localhost:3000/books/comments?page=${currentPage}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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

  const getBooksWithOrder = async (currentPage = 1, newOrder) => {
    try {
      setFetchUsedGet("mostReviews");
      const orderToUse = newOrder || order || "asc";
      let response = await fetch(`http://localhost:3000/books/ratings/${orderToUse}?page=${currentPage}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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
      if (data.error) {
        alert(`Failed to fetch books: ${data.error}`)
        window.location.reload();
      }
    }
    catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setFilteredBooks([]);
    }
  };

  const getBooksWithYear = async (currentPage = 1, newYear) => {
    try {
      setFetchUsedGet("year");
      const yearToUse = newYear || year;
      let response = await fetch(`http://localhost:3000/books/year/${yearToUse}?page=${currentPage}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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
      if (data.error) {
        alert(`Failed to fetch books: ${data.error}`)
        window.location.reload();
      }
    }
    catch (error) {
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
      console.log("estou aqui")
      setPage(1);
      e.preventDefault();
      setLimit(newLimit); // Set new limit
      getBooksWithLimit(1, newLimit); // Trigger book fetch with new limit
    } else {
      alert('Enter valid limit!');
    }
  };

  const handle5Star = (e) => {
    setPage(1);
    e.preventDefault();
    getBooksWith5Star();
  };

  const handleComments = (e) => {
    setPage(1);
    e.preventDefault();
    getBooksWithComments();
  };

  const handleOrder = (e) => {
    const newOrder = e.target.elements.order.value;
    if (newOrder.length > 0) {
      if (!order) order = "asc";
      setPage(1);
      e.preventDefault();
      setOrder(newOrder);
      getBooksWithOrder(1, newOrder);
    } else {
      alert('Enter valid order!');
    }
  };

  const handleYear = (e) => {
    const newYear = e.target.elements.year.value;
    if (newYear.length > 0) {
      console.log(newYear)
      setPage(1);
      e.preventDefault();
      setYear(newYear);
      getBooksWithYear(1, newYear);
    } else {
      alert('Enter valid year!');
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      if (fetchUsedGet === "filters") {
        getBooksWithFilters(nextPage);
      } else if (fetchUsedGet === "limit") {
        getBooksWithLimit(nextPage);
      } else if (fetchUsedGet === "5Star") {
        getBooksWith5Star(nextPage);
      } else if (fetchUsedGet === "mostReviews") {
        getBooksWithOrder(nextPage);
      } else if (fetchUsedGet === "year") {
        getBooksWithYear(nextPage);
      } else if (fetchUsedGet === "comments") {
        getBooksWithComments(nextPage);
      }
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      if (fetchUsedGet === "filters") {
        getBooksWithFilters(previousPage);
      } else if (fetchUsedGet === "limit") {
        getBooksWithLimit(previousPage);
      } else if (fetchUsedGet === "5Star") {
        getBooksWith5Star(previousPage);
      } else if (fetchUsedGet === "mostReviews") {
        getBooksWithOrder(previousPage);
      } else if (fetchUsedGet === "year") {
        getBooksWithYear(previousPage);
      } else if (fetchUsedGet === "comments") {
        getBooksWithComments(previousPage);
      }
    }

  };


  // Trigger the fetch function based on whether limit is set or filters are present
  useEffect(() => {
    if (priceMin || priceMax || categories || authors) {
      getBooksWithFilters(); // Fetch books based on filters
    } else {
      getBooksWithLimit(); // Fetch all books when no filters and no limit are set
    }
  }, [priceMin, priceMax, categories, authors]); // Re-fetch when any filter or limit changes

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
      <br /><br /><br />
      <Button onClick={handle5Star} variant="outline-primary">
        <FontAwesomeIcon icon={fa5} /> <FontAwesomeIcon icon={faStar} />
      </Button>
      <br></br>
      <label className="text-muted">
				View books with score 5 reviews.
			</label>
      <br /><br />
      <Button onClick={handleComments} variant="outline-primary">
        <FontAwesomeIcon icon={faComment} />
      </Button>
      <br></br>
      <label className="text-muted">
				View books with descending order by total comments.
			</label>
      <br /><br />
      <form onSubmit={handleChange}>
        <input type="number" step="0" min="1" id="limit" name="limit" placeholder="Enter limit" defaultValue={limit || ""}></input>
        <Button type="submit" variant="outline-success">
          <FontAwesomeIcon icon={faFilter} />
        </Button>
        <br></br>
        <label className="text-muted">
					Limit books and get them in descending order by average review score.
				</label>
      </form>

      <br />
      <form onSubmit={handleOrder}>
        <input type="text" pattern="[a-z]{3}" id="order" name="order" placeholder="Enter order" defaultValue={order || ""}></input>
        <Button type="submit" variant="outline-success">
          <FontAwesomeIcon icon={faFilter} />
        </Button>
        <br></br>
        <label className="text-muted">
					Order books by number of reviews. Format: <code>&lt;asc/dsc&gt;</code>
				</label>
      </form>

      <br />
      <form onSubmit={handleYear}>
        <input type="number" step="0" id="year" min="1970" /* max="2030" */ name="year" placeholder="Enter year" defaultValue={year || ""}></input>
        <Button type="submit" variant="outline-success">
          <FontAwesomeIcon icon={faFilter} />
        </Button>
        <br></br>
        <label className="text-muted">
					Filter books by review year.
				</label>
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
