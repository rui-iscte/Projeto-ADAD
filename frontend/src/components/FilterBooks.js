import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

const FilterBooks = ({ onFilter }) => {
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [categories, setCategories] = useState('');
  const [authors, setAuthors] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      price_min: priceMin,
      price_max: priceMax,
      categories,
      authors
    };
    onFilter(filters);  // Pass filters back to parent component
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Filter Books</h2>
      
      {/* Price Range */}
      <Form.Group controlId="priceMin">
        <Form.Label>Price Min</Form.Label>
        <Form.Control
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          placeholder="Min price"
        />
      </Form.Group>
      
      <Form.Group controlId="priceMax">
        <Form.Label>Price Max</Form.Label>
        <Form.Control
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          placeholder="Max price"
        />
      </Form.Group>
      
      {/* Categories */}
      <Form.Group controlId="categories">
        <Form.Label>Categories</Form.Label>
        <Form.Control
          type="text"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="e.g. Web Development, Data Science"
        />
      </Form.Group>

      {/* Authors */}
      <Form.Group controlId="authors">
        <Form.Label>Authors</Form.Label>
        <Form.Control
          type="text"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          placeholder="e.g. J.K. Rowling, Robi Sen"
        />
      </Form.Group>

      <Button variant="primary" type="submit">Filter</Button>
    </Form>
  );
};

export default FilterBooks;