import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    let id = params.id;
    console.log(id);
    getBook(params.id);
  }, []);

  const title = book.title?.length > 0 ? book.title : "N/A";
  const isbn = book.isbn?.length > 0 ? book.isbn : "N/A";
  const pageCount = (book.pageCount && book.pageCount > 0) ? book.pageCount : "N/A";
  const publishedDate = book.publishedDate?.length > 0 ? book.publishedDate : "N/A";
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
      <Form>
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>Title*</Form.Label>
          <Form.Control type="title" placeholder="Enter title" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicISBN">
          <Form.Label>ISBN</Form.Label>
          <Form.Control type="isbn" placeholder="Enter isbn" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Disabled select menu</Form.Label>
          <Form.Select>
            <option>Disabled select</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}