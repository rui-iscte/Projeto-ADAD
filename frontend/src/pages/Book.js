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
  let [newComment, setNewComment] = useState("");
  let [userId, setUserId] = useState("");
  let [commentPosted, setCommentPosted] = useState(false);

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

  const addComment = async (event) => {
    event.preventDefault();

    // Ensure the user ID and comment text are not empty
    if (newComment.trim() && userId.trim()) {
      try {
        const response = await fetch('http://localhost:3000/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            book_id: book._id,   // Using snake_case for backend compatibility
            user_id: userId,     // Using snake_case for backend compatibility
            comment: newComment
          })
        });

        if (response.ok) {
          setNewComment(""); // Clear the input field
          setUserId(""); // Clear the user ID input field
          getBook(book._id); // Refresh comments after adding
          setCommentPosted(true); // Set success state to true
          setTimeout(() => setCommentPosted(false), 3000); // Hide the message after 3 seconds
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      alert('Please enter a comment and a valid user ID.');
    }
  };

  // Function to delete a comment
  const deleteComment = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        getBook(book._id); // Refresh comments after deletion
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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
      
      <h3>Comments:</h3> <br></br>
      {/* Success Message After Posting Comment */}
      {commentPosted && (
        <div className="alert alert-success" role="alert">
          You've posted a comment successfully!
        </div>
      )}

      {/* Comment Input Form */}
      <form onSubmit={addComment}>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">User ID</label>
          <input 
            type="number" 
            id="userId" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Comment</label>
          <textarea 
            id="comment" 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            className="form-control" 
            rows="4" 
            required 
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Comment</button>
      </form>
      <br></br>

      {/* Display Comments */}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div>
          {userFromComment.map((comment) => (
            <CommentCard key={comment._id} {...comment} deleteComment={() => deleteComment(comment._id)}/>
          ))}
        </div>
      )}
    </div>
  );
}