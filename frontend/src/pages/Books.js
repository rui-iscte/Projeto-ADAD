import React, {useState, useEffect} from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import BookCard from "../components/BookCard";

export default function App() {
  let [books, setBooks] = useState([]);
  let [page, setPage] = useState(1);

  const getBooks = async (currentPage = 1) => {
    try {
      const response = await fetch('http://localhost:3000/books?page=' + currentPage, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setBooks(data.results);
      setPage(currentPage);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleNextPage = () => {
    getBooks(page + 1);
  };
  
  const handlePreviousPage = () => {
    getBooks(page - 1);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="container pt-5 pb-5">
      <h2>Books</h2>
      <CardGroup>
          <Row xs={1} md={2} className="d-flex justify-content-around">
          {books && books.map((book) => {
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
        <Button onClick={handlePreviousPage} variant="outline-primary">
          Previous Page
        </Button>
        <span>Page {page}</span>
        <Button onClick={handleNextPage} variant="outline-primary">
          Next Page
        </Button>
      </div>
    </div>
    
  )
}