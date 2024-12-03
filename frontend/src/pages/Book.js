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

import CommentCard from "../components/CommentCard";

const bytes = utf8ToBytes('foo'); 
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let [book, setBook] = useState(1);
  let [comments, setComments] = useState([]);

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

  useEffect(() => {
    let id = params.id;
    console.log(id);
    getBook(params.id);

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
  const average_score = (book.average_score && book.average_score > 0) ? Math.round(book.average_score * 1000) / 1000 : 0;
/*   const comments = book.comments?.length > 0 ? book.comments : "N/A";
 */
  return (
    <div className="container pt-5 pb-5">
      <h2>{book.title}</h2>
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
      <p><strong>Price: </strong>{price}</p>
      <p><strong>Average Score: </strong>{average_score}</p>
      {<p><strong>Comments: </strong></p>}
      <CardGroup>
          <Row xs={1} md={1} className="d-flex justify-content-around">
          {comments && comments.map((comment) => {
              return (
                  <CommentCard 
                      key={comment._id} 
                      {...comment}
                  />
              );
          })}
          </Row>
      </CardGroup>
    </div>
  )
}