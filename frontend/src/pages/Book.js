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
import CommentCard from "../components/CommentCard";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const bytes = utf8ToBytes('foo'); 
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let navigate = useNavigate();
  let [book, setBook] = useState(1);
  let [comments, setComments] = useState([]);
  let [users, setUsers] = useState([]);

  const getBook = async (id) => {
    try {
      const response = await fetch('http://localhost:3000/books/' + id, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setBook(data[0]);
      setComments(data[0].comments)

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/all/', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setUsers(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    let id = params.id;
    console.log(id);
    getBook(params.id);
    getUsers();
  }, []);

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
  }

  const userFromComment = comments.map((comment) => {
    const user = users.find((user) => user._id.toString() === comment.user_id.toString());
    return {
      ...comment,
      user_name: user ? user.first_name + " " + user.last_name : ""
    };
  });

  const title = book.title?.length > 0 ? book.title : "N/A";
  const isbn = book.isbn?.length > 0 ? book.isbn : "N/A";
  const pageCount = (book.pageCount && book.pageCount > 0) ? book.pageCount : "N/A";
  const publishedDate = book.publishedDate?.length > 0 ? formatDate(book.publishedDate) : "N/A";
  const thumbnailUrl = book.thumbnailUrl?.length > 0 ? book.thumbnailUrl : "https://media.istockphoto.com/id/1500807425/vector/image-not-found-icon-vector-design.jpg?s=612x612&w=0&k=20&c=SF3EoL0zSi3XUwFzduMo3xdJFEk8V5IUsGqRocgPEtU=";
  const shortDescription = book.shortDescription?.length > 0 ? book.shortDescription : "N/A";
  const longDescription = book.longDescription?.length > 0 ? book.longDescription : "N/A";
  const status = book.status?.length > 0 ? book.status : "N/A";
  const authors = book.authors?.length > 0 ? book.authors.join(", ") : "N/A";
  const categories = book.categories?.length > 0 ? book.categories.join(", ") : "N/A";
  const price = (book.price && book.price > 0) ? book.price : "N/A";
  const average_score = book.average_score ? Math.round(book.average_score * 1000) / 1000 : "N/A";

  return (
    <div className="container pt-5 pb-5">
      {/* <Button onClick={() => navigate(-1)} variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button> */}
      <br></br><br></br>
      <h2>{title}</h2>
      <br></br>
      <img src={thumbnailUrl}></img>
      <br></br><br></br>
      <p><strong>ISBN: </strong>{isbn}</p>
      <p><strong>Page Count: </strong>{pageCount}</p>
      <p><strong>Published Date: </strong>{publishedDate}</p>
      <p><strong>Short Description: </strong>{shortDescription}</p>
      <p><strong>Long Description: </strong>{longDescription}</p>
      <p><strong>Status: </strong>{status}</p>
      <p><strong>Authors: </strong>{authors}</p>
      <p><strong>Categories: </strong>{categories}</p>
      <p><strong>Price: </strong>{price}€</p>
      <p><strong>Average Score: </strong>{average_score}</p>
      { comments.length === 0 ? (
        <div>
          <br></br>
          <p>No Comments!</p>
        </div>
      ) : (
        <div>
          <br></br>
          <CardGroup>
          <Row xs={1} md={1} className="d-flex justify-content-around">
          {userFromComment.map((comment) => (
            <CommentCard 
                key={comment._id} 
                {...comment} 
            />
          ))}
          </Row>
        </CardGroup>
        </div>
      )}
    </div>
  )
}