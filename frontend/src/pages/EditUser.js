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
  let [user, setUser] = useState(1);
  let [rawReviews, setRawReviews] = useState("");

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

      const reviews = (Array.isArray(data[0].reviews) && data[0].reviews.length > 0)
        ? data[0].reviews
            .map((review) => {
              const bookId = review.book_id || "";
              const score = review.score ? Number(review.score) : "";
              const recommendation = review.recommendation ? "true" : "false";
              const reviewDate = review.review_date || "";
              return `Book ID: ${bookId}, Score: ${score}, Recommendation: ${recommendation}, Review Date: ${reviewDate}`;
            })
            .join("; ")
        : "";
      setRawReviews(reviews);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    let id = params.id;
    console.log(id);
    getUser(params.id);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "reviews") {
      setRawReviews(value);
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: name === "year_of_birth" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedReviews = rawReviews
      ? rawReviews.split(";").map((reviewString) => {
        const parts = reviewString.split(",").map((part) => part.trim());
        return {
          book_id: parts[0]?.split(":")[1]?.trim() || "",
          score: Number(parts[1]?.split(":")[1]?.trim()) || "",
          recommendation: parts[2]?.split(":")[1]?.trim() === "true",
          review_date: parts[3]?.split(":")[1]?.trim() || "",
        };
      }) : [];

    const updatedUser = {
      ...user,
      reviews: updatedReviews
    };

    try {
      const response = await fetch("http://localhost:3000/users/" + params.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert("User updated successfully!");
        navigate("/users");
      } else {
        const error = await response.json();
        alert(`Failed to update the user: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const first_name = user.first_name || "";
  const last_name = user.last_name || "";
  const year_of_birth = user.year_of_birth || "";
  const job = user.job || "";
  
  return (
    <div className="container pt-5 pb-5">
      <Button href={"/users"}/* onClick={() => navigate(-1)} */ variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br></br><br></br>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name*</Form.Label>
          <Form.Control name="first_name" type="text" pattern="[\p{L}\s]+" placeholder="Enter first name" value={first_name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control name="last_name" type="text" pattern="[\p{L}\s]+" placeholder="Enter last name" value={last_name} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Year of Birth</Form.Label>
          <Form.Control name="year_of_birth" type="number" step="0" min="1" placeholder="Enter year of birth" value={year_of_birth} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job</Form.Label>
          <Form.Control name="job" type="text" pattern="[\p{L}\s]+" placeholder="Enter job" value={job} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Reviews</Form.Label>
          <Form.Control name="reviews" type="text" placeholder="Enter reviews" value={rawReviews} onChange={handleChange} />
          <Form.Text className="text-muted">
            Separate reviews with a ` ; `. Each review should have the format: 
            <br></br>
            <code>Book ID: &lt;id&gt;, Score: &lt;score&gt;, Recommendation: &lt;true/false&gt;, Review Date: &lt;Unix Timestamp (e.g., 1586584290000)&gt;</code>
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}