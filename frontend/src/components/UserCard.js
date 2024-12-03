import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function UserCard(props) {
  const first_name = props.first_name?.length > 0 ? props.first_name : "";
  const last_name = props.last_name?.length > 0 ? props.last_name : "";
  const list = [first_name, last_name];
  const name = list.join(" ");
  const job = props.job?.length > 0 ? props.job : "N/A";
  const reviews = props.reviews?.length > 0 ? props.reviews.length: null;
  return (
    <Card style={{ width: '18rem' }} className="mb-3">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <br></br>
        <Card.Text><strong>Job: </strong>{job}</Card.Text>
        {reviews ? (
          <Card.Text><strong>Number of Reviews: </strong>{reviews}</Card.Text>
        ) : (
          <Card.Text>No Reviews! </Card.Text>
        )
        }
        <Button href={"/user/" + props._id} variant="outline-primary">Open User</Button>
      </Card.Body>
    </Card>
  );
}

export default UserCard;