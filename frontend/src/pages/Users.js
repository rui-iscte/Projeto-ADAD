import React, {useState, useEffect} from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  let navigate = useNavigate();
  let [users, setUsers] = useState([]);
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);

  const getUsers = async (currentPage = 1) => {
    try {
      const response = await fetch('http://localhost:3000/users?page=' + currentPage, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setUsers(data.results);
      setPage(currentPage);
      setTotalPages(data.info.pages)

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      getUsers(page + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      getUsers(page - 1);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container pt-5 pb-5">
      <Button onClick={() => navigate(-1)} variant="outline-secundary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br></br><br></br>
      <h2>Users</h2>
      <br></br><br></br>
      <CardGroup>
          <Row xs={1} md={2} className="d-flex justify-content-around">
          {users && users.map((user) => {
              return (
                  <UserCard 
                      key={user._id} 
                      {...user}
                  />
              );
          })}
          </Row>
      </CardGroup>
      <div className="d-flex justify-content-between mt-4">
        { page !== 1 ? (
          <Button onClick={handlePreviousPage} variant="outline-primary">
            Previous Page
          </Button>
        ) : (
          <Button onClick={handlePreviousPage} variant="outline-secundary" disabled={page === 1}>
            Previous Page
          </Button>
        )}
        <span>Page {page} of {totalPages}</span>
        { page !== totalPages ? (
          <Button onClick={handleNextPage} variant="outline-primary">
            Next Page
          </Button>
        ) : (
          <Button onClick={handleNextPage} variant="outline-secundary" disabled={page === totalPages}>
            Next Page
          </Button>
        )}
      </div>
    </div>
  )
}