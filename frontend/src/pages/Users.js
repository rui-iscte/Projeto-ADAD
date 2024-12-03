import React, {useState, useEffect} from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import UserCard from "../components/UserCard";

export default function App() {
  let [users, setUsers] = useState([]);
  let [page, setPage] = useState(1);

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

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleNextPage = () => {
    getUsers(page + 1);
  };
  
  const handlePreviousPage = () => {
    getUsers(page - 1);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container pt-5 pb-5">
      <h2>Users</h2>
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
        <Button onClick={handlePreviousPage} variant="outline-primary">
          Previous Page
        </Button>
        <span>Page {page}</span>
        <Button onClick={handleNextPage} variant="outline-primary">
          Next Page
        </Button>
      </div>
    </div>
  )
}