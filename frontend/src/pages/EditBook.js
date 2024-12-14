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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: name === "pageCount" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      ...book,
      authors: !Array.isArray(book.authors) ? (book.authors || "N/A").split(',').map((author) => author.trim()) : book.authors,
      categories: !Array.isArray(book.categories) ? (book.categories || "N/A").split(',').map((category) => category.trim()) : book.categories
    };

    try {
      const response = await fetch('http://localhost:3000/books/' + params.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });

      if (response.ok) {
        alert('Book updated successfully!');
        navigate('/books');
      } else {
        const error = await response.json();
        alert(`Failed to update the book: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const title = book.title?.length > 0 ? book.title : '';
  const isbn = book.isbn?.length > 0 ? book.isbn : '';
  const pageCount = (book.pageCount && book.pageCount > 0) ? Number(book.pageCount) : '';
  const publishedDate = book.publishedDate?.length > 0 ? new Date(book.publishedDate).toISOString().split(".")[0] : '';
  const thumbnailUrl = book.thumbnailUrl?.length > 0 ? book.thumbnailUrl : '';
  const shortDescription = book.shortDescription?.length > 0 ? book.shortDescription : '';
  const longDescription = book.longDescription?.length > 0 ? book.longDescription : '';
  const status = book.status?.length > 0 ? book.status : '';
  const price = (book.price && book.price > 0) ? Number(book.price) : '';
  const authors = Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || '';
  const categories = Array.isArray(book.categories) ? book.categories.join(", ") : book.categories || '';

  return (
    <div className="container pt-5 pb-5">
      <Button href={"/books"}/* onClick={() => navigate(-1)} */ variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br></br><br></br>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title*</Form.Label>
          <Form.Control name="title" type="text" placeholder="Enter title" value={title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ISBN</Form.Label>
          <Form.Control name="isbn" type="text" pattern="[0-9]{10}" placeholder="Enter isbn" value={isbn} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Page Count</Form.Label>
          <Form.Control name="pageCount" type="number" step="0" min="1" /* pattern="[0-9]{}" */ placeholder="Enter page count" value={pageCount} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Published Date</Form.Label>
          <Form.Control name="publishedDate" type="datetime-local" id="birthdaytime" value={publishedDate} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thumbnail URL</Form.Label>
          <Form.Control name="thumbnailUrl" type="url" placeholder="Enter thumbnail url" value={thumbnailUrl} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Short Description</Form.Label>
          <Form.Control name="shortDescription" type="text" placeholder="Enter short description" value={shortDescription} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Long Description</Form.Label>
          <Form.Control name="longDescription" type="text" placeholder="Enter long description" value={longDescription} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Control name="status" type="text" pattern="[A-Z]{0,10}" placeholder="Enter status" value={status} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control name="price" type="number" step="0.01" min="0" /* pattern="[0-9]+([\.][0-9]{0,2})?" */ placeholder="Enter price" value={price} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Authors</Form.Label>
          <Form.Control name="authors" type="text" placeholder="Enter authors" value={authors} onChange={handleChange} />
          <Form.Text className="text-muted">
            Write the names of the authors, splitted with a ' , '.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categories</Form.Label>
          <Form.Control name="categories" type="text" placeholder="Enter categories" value={categories} onChange={handleChange} />
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