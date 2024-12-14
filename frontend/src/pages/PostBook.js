import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const bytes = utf8ToBytes('foo');
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let navigate = useNavigate();
  let [book, setBook] = useState(1);

  /* useEffect(() => {
    let id = params.id;
    console.log(id);
    getBook(params.id);
  }, []); */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = {
      ...book,
      authors: !Array.isArray(book.authors) ? (book.authors || "N/A").split(',').map((author) => author.trim()) : book.authors,
      categories: !Array.isArray(book.categories) ? (book.categories || "N/A").split(',').map((category) => category.trim()) : book.categories
    };

    console.log(book.price)

    try {
      const response = await fetch('http://localhost:3000/books/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert('Book added successfully!');
        navigate('/books');
      } else {
        const error = await response.json();
        alert(`Failed to add the book: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container pt-5 pb-5">
      <Button href={"/books"}/* onClick={() => navigate(-1)} */ variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br></br><br></br>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title*</Form.Label>
          <Form.Control name="title" type="text" placeholder="Enter title" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ISBN</Form.Label>
          <Form.Control name="isbn" type="text" pattern="[0-9]{10}" placeholder="Enter isbn" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Page Count</Form.Label>
          <Form.Control name="pageCount" type="number" placeholder="Enter page count" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Published Date</Form.Label>
          <Form.Control name="publishedDate" type="datetime-local" id="birthdaytime" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thumbnail URL</Form.Label>
          <Form.Control name="thumbnailUrl" type="url" placeholder="Enter thumbnail url" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Short Description</Form.Label>
          <Form.Control name="shortDescription" type="text" placeholder="Enter short description" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Long Description</Form.Label>
          <Form.Control name="longDescription" type="text" placeholder="Enter long description" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Control name="status" type="text" pattern="[A-Z]{0,10}" placeholder="Enter status" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control name="price" type="number" step="0.01" min="0" placeholder="Enter price" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Authors</Form.Label>
          <Form.Control name="authors" type="text" placeholder="Enter authors" onChange={handleChange} />
          <Form.Text className="text-muted">
            Write the names of the authors, splitted with a ' , '.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categories</Form.Label>
          <Form.Control name="categories" type="text" placeholder="Enter categories" onChange={handleChange} />
          <Form.Text className="text-muted">
            Write the categories, splitted with a ' , '.
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}