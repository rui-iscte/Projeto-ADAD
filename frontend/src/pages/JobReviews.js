import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

function JobReviews() {
  const [jobReviews, setJobReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // New state for total pages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch job reviews with pagination
  const getJobReviews = async (currentPage = 1) => {
    try {
      const response = await fetch(`http://localhost:3000/books/job?page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job reviews');
      }
      const data = await response.json();
      setJobReviews(data.results); // Set the job reviews
      setTotalPages(data.info.pages); // Set total pages  
      setPage(currentPage); // Update current page
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch job reviews when the component is mounted or when pagination changes
  useEffect(() => {
    getJobReviews();
  }, []);

  // Handle next page
  const handleNextPage = () => {
    if (page < totalPages) {
      getJobReviews(page + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      getJobReviews(page - 1);
    }
  };

  return (
    <div className="container pt-5 pb-5">
      <Button href={"/books"} variant="outline-secondary">
        <FontAwesomeIcon icon={faAngleLeft} />
      </Button>
      <br></br><br></br>
      <h2 className="mb-4">Job Reviews</h2>
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && (
        <Alert variant="danger">
          <strong>Error:</strong> {error}
        </Alert>
      )}
      {jobReviews.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Job</th>
              <th>Number of Reviews</th>
            </tr>
          </thead>
          <tbody>
            {jobReviews.map((job, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{job.job}</td>
                <td>{job.totalReviews}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {!loading && jobReviews.length === 0 && !error && (
        <Alert variant="info">No job reviews found.</Alert>
      )}
      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          onClick={handlePreviousPage}
          variant="outline-primary"
          disabled={page <= 1} // Disable if on the first page
        >
          Previous Page
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          onClick={handleNextPage}
          variant="outline-primary"
          disabled={page >= totalPages} // Disable if on the last page
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}

export default JobReviews;