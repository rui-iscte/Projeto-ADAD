import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function UserCard(props) {
  const first_name = props.first_name?.length > 0 ? props.first_name : "";
  const last_name = props.last_name?.length > 0 ? props.last_name : "";
  const list = [first_name, last_name];
  let name = list.join(" ");
  if (name === " ") {
    name = "N/A"
  }
  const job = props.job?.length > 0 ? props.job : "N/A";
  const reviews = props.reviews?.length > 0 ? props.reviews.length : null;

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/" + props._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('User deleted successfully!');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to delete the user: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        <br></br>
        <div className="d-flex justify-content-between">
          <Button href={"/user/" + props._id} target="_blank" variant="outline-primary">
            <FontAwesomeIcon icon={faExternalLink} />
          </Button>
          <Button href={"/user/" + props._id} variant="outline-warning">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button onClick={handleDelete} variant="outline-danger">
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserCard;