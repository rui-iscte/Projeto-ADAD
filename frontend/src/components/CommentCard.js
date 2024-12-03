import Card from 'react-bootstrap/Card';

function CommentCard(props) {
  const user_name = props.user_name?.length > 0 ? props.user_name : "Unknown User";
  const comment = props.comment?.length > 0 ? props.comment : "N/A";
  const date = props.date?.length > 0 ? new Date(parseInt(props.date)).toGMTString() : "N/A";
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{user_name}</Card.Title>
        <br></br>
        <Card.Text><strong>Comment: </strong>{comment}</Card.Text>
        <Card.Text><strong>Date: </strong>{date}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CommentCard;