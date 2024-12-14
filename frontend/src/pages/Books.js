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
  let [books, setBooks] = useState([]);
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  let [limit, setLimit] = useState();

  const getBooks = async (currentPage = 1) => {
    try {
      let response;
      if (limit !== undefined) {
        console.log("tenho limit")
        response = await fetch('http://localhost:3000/books/top/' + limit + '?page=' + currentPage, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      } else {
        console.log("nao tenho limit")
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

      if (totalbooks.length > 20) {
        if (limit === undefined) {
          console.log(data)
          setBooks(data.results);
          setPage(currentPage);
          setTotalPages(data.info.pages)
        } else if (limit > 20) {
          console.log(data)
          setBooks(data.results);
          setPage(currentPage);
          setTotalPages(data.info.pages);
        } else {
          console.log(data)
          setBooks(data);
          setTotalPages(1);
        }
      } else {
        console.log(data)
        setBooks(data);
        setTotalPages(1);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

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
    const newLimit = e.target.elements.limit.value;
    if (newLimit.length > 0) {
      setPage(1);
      e.preventDefault();
      setLimit(newLimit);
      console.log(typeof newLimit)
    } else {
      alert('Enter valid limit!');
    }
  };

  return (
    <div className="container pt-5 pb-5">
      <Button href={"/"}/* onClick={() => navigate(-1)} */ variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br></br><br></br>
      <h2>Books</h2>
      <Button href={"/postbook"} variant="outline-success">
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <form onSubmit={handleChange}>
        <label htmlFor="limit">Limit:</label>
        <input type="number" step="0" min="1" /* pattern="[1-9][0-9]{0,10}" */ id="limit" name="limit" defaultValue={limit || ""}></input>
        <Button type="submit" variant="outline-success" >
          <FontAwesomeIcon icon={faFilter} />
        </Button>
      </form>
      <br></br><br></br>
      <CardGroup>
        <Row xs={1} md={2} className="d-flex justify-content-around">
          {books && Array.isArray(books) && books.map((book) => {
            return (
              <BookCard
                key={book._id}
                {...book}
              />
            );
          })}
        </Row>
      </CardGroup>
      <div className="d-flex justify-content-between mt-4">
        {page !== 1 ? (
          <Button onClick={handlePreviousPage} variant="outline-primary">
            Previous Page
          </Button>
        ) : (
          <Button onClick={handlePreviousPage} variant="outline-secundary" disabled={page === 1}>
            Previous Page
          </Button>
        )}
        <span>Page {page} of {totalPages}</span>
        {page !== totalPages ? (
          <Button onClick={handleNextPage} variant="outline-primary">
            Next Page
          </Button>
        ) : (
          <Button onClick={handleNextPage} variant="outline-secundary" disabled={page === totalPages}>
            Next Page
          </Button>
        )}
      </div>
    </div>

  )
}