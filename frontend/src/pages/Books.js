import React, { useState, useEffect, useCallback } from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  let navigate = useNavigate();
  let [books, setBooks] = useState([]);
  let [filteredBooks, setFilteredBooks] = useState([]);
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  let [limit, setLimit] = useState();
  
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [categories, setCategories] = useState('');
  const [authors, setAuthors] = useState('');
  
  const [filtersVisible, setFiltersVisible] = useState(false);

  const getBooks = useCallback(async (currentPage = 1) => {
    try {
      let response;
      if(limit !== undefined) {
        response = await fetch('http://localhost:3000/books/top/' + limit + '?page=' + currentPage, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      } else {
        response = await fetch('http://localhost:3000/books?page=' + currentPage, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }

      const totalBooks = await fetch('http://localhost:3000/books/all', {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json'
          },
        });

      const data = await response.json();
      const totalbooks = await totalBooks.json();
      
      if(totalbooks.length > 20) {
        setBooks(data.results);
        setPage(currentPage);
        setTotalPages(data.info.pages);
      } else {
        setBooks(data);
        setTotalPages(1);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }, [limit]);

  const handleNextPage = () => {
    if (page < totalPages) {
      getBooks(page + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      getBooks(page - 1);
    }
  };

  useEffect(() => {
    getBooks();
  }, [limit]);

  const handleChange = (e) => {
    e.preventDefault();
    const newLimit = e.target.elements.limit.value;
    setLimit(newLimit);
  };

  const applyFilters = () => {
    let filtered = books;
  
    // Price filter
    if (priceMin) {
      filtered = filtered.filter((book) => book.price >= priceMin);
    }
    if (priceMax) {
      filtered = filtered.filter((book) => book.price <= priceMax);
    }
  
    // Categories filter
    if (categories) {
      const categoryArray = categories.split(',').map((category) => category.trim().toLowerCase());
      filtered = filtered.filter((book) =>
        book.categories && Array.isArray(book.categories) && book.categories.some((category) => 
          categoryArray.includes(category.toLowerCase())
        )
      );
    }
  
    // Authors filter
    if (authors) {
      const authorsArray = authors.split(',').map((author) => authors.trim().toLowerCase());
      filtered = filtered.filter((book) =>
        book.authors && Array.isArray(book.authors) && book.authors.some((author) => 
          authorsArray.includes(author.toLowerCase())
        )
      );
    }
  
    setFilteredBooks(filtered);
  };
  

  // Trigger filter on any change in filter states
  useEffect(() => {
    applyFilters();
  }, [priceMin, priceMax, categories, authors, books]);

  // Reset filter states
  const resetFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setCategories('');
    setAuthors('');
  };

  return (
    <div className="container pt-5 pb-5">
      <Button onClick={() => navigate(-1)} variant="outline-secondary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br /><br />
      <h2>Books</h2>
      <Button href={"/book/"} target="_blank" variant="outline-success">
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <form onSubmit={handleChange}>
        <label htmlFor="limit">Limit:</label>
        <input type="text" id="limit" name="limit" defaultValue={limit || ""} />
        <Button type="submit" variant="outline-success">
          <FontAwesomeIcon icon={faFilter} />
        </Button>
      </form>

      {/* Job Reviews Button */}
      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/books/job')}>
          View Job Reviews
        </Button>
      </div>

      {/* Toggle Filter Button */}
      <Button 
        variant="outline-primary" 
        onClick={() => setFiltersVisible(!filtersVisible)} 
        className="mt-4"
      >
        {filtersVisible ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <br></br>

      {/* Filters (Visible when filtersVisible is true) */}
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
      {filteredBooks.length === 0 ? (
        <div className="alert alert-info mt-4">No books found.</div>
      ) : (
        <CardGroup>
          <Row xs={1} md={2} className="d-flex justify-content-around">
            {filteredBooks.map((book) => {
              return (
                <BookCard 
                  key={book._id} 
                  {...book}
                />
              );
            })}
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
        <span>Page {page} of {totalPages}</span>
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