import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';
const bytes = utf8ToBytes('foo'); 
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let [user, setUser] = useState([]);

  const getUser = async (id) => {
    try {
      const response = await fetch('http://localhost:3000/users/$id', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      console.log(data)
      setUser(data);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    let id = params.id;
    console.log(id);
    getUser(params.id);

  }, []);

  return (
    <div className="container pt-5 pb-5">
      <h2>Users</h2>
      return (
              <BookInfo 
                key={user._id} 
                {...user}
              />
            );
    </div>
  )
}