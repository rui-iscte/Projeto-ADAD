import Card from 'react-bootstrap/Card';

function CommentCard(props) {
  const book_id = (props.book_id && props.book_id > 0) ? props.book_id : "N/A";
  const comment = props.comment?.length > 0 ? props.comment : "N/A";
  const date = props.date?.length > 0 ? props.date : "N/A";
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{book_id}</Card.Title>
        <br></br>
        <Card.Text><strong>Comment: </strong>{comment}</Card.Text>
        <Card.Text><strong>Date: </strong>{date}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CommentCard;