import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function formatDate(date) {
  let d;

  // Handle Unix timestamp (milliseconds)
  if (typeof date === "number") {
    d = new Date(date);
  } else if (typeof date === "string") {
    d = new Date(Number(date) || date); // Try parsing string as a number or ISO date
  } else {
    return "Invalid date"; // In case the date is not a valid type
  }

  // Check for invalid date
  if (isNaN(d.getTime())) {
    return "Invalid date";
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = d.getFullYear();

  return `${day}-${month}-${year}`; // Return the formatted date (e.g., 04-12-2024)
}

function CommentCard(props) {
  const { user_name, comment, date, deleteComment } = props;

  const formattedUserName = user_name?.length > 0 ? user_name : "Unknown User";
  const formattedComment = comment?.length > 0 ? comment : "N/A";
  const formattedDate = date ? formatDate(date) : "N/A"; // Use formatDate function or show "N/A"

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{formattedUserName}</Card.Title>
        <Card.Text><strong>Comment: </strong>{formattedComment}</Card.Text>
        <Card.Text><strong>Date: </strong>{formattedDate}</Card.Text>
        {/* Delete button */}
        <Button variant="danger" onClick={deleteComment}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CommentCard;