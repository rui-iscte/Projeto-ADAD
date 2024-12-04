import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';

import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ReviewCard from "../components/ReviewCard";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const bytes = utf8ToBytes('foo'); 
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let navigate = useNavigate();
  let [user, setUser] = useState([]);
  let [reviews, setReviews] = useState([]);
  let [books, setBooks] = useState([]);

  const getUser = async (id) => {
    try {
      const response = await fetch('http://localhost:3000/users/' + id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setUser(data[0]);
      setReviews(data[0].reviews)

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/books/all/', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setBooks(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    let id = params.id;
    console.log(id);
    getUser(params.id);
    getBooks();
  }, []);

  const bookFromReview = reviews.map((review) => {
    const book = books.find((book) => book._id.toString() === review.book_id.toString());
    return {
      ...review,
      book_title: book ? book.title : ""
    };
  });

  const first_name = user.first_name?.length > 0 ? user.first_name : "";
  const last_name = user.last_name?.length > 0 ? user.last_name : "";
  const list = [first_name, last_name];
  let name = list.join(" ");
  if (name === " ") {
    name = "N/A"
  }
  const year_of_birth = (user.year_of_birth && user.year_of_birth > 0) ? user.year_of_birth : "N/A";
  const job = user.job?.length > 0 ? user.job : "N/A";
  
  return (
    <div className="container pt-5 pb-5">
      {/* <Button onClick={() => navigate(-1)} variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button> */}
      <br></br><br></br>
      <h2>{name}</h2>
      <br></br><br></br>
      <p><strong>Name: </strong>{name}</p>
      <p><strong>Year of Birth: </strong>{year_of_birth}</p>
      <p><strong>Job: </strong>{job}</p>
      { reviews.length === 0 ? (
        <div>
          <br></br>
          <p>No Reviews!</p>
        </div>
      ) : (
        <div>
          <br></br>
          <CardGroup>
          <Row xs={1} md={1} className="d-flex justify-content-around">
          {bookFromReview.map((review) => (
            <ReviewCard 
                key={review.book_id} 
                {...review} 
            />
          ))}
          </Row>
        </CardGroup>
        </div>
      )}
    </div>
  )
}