import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function BookCard(props) {
  const thumbnailUrl = props.thumbnailUrl?.length > 0 ? props.thumbnailUrl : "https://media.istockphoto.com/id/1500807425/vector/image-not-found-icon-vector-design.jpg?s=612x612&w=0&k=20&c=SF3EoL0zSi3XUwFzduMo3xdJFEk8V5IUsGqRocgPEtU=";
  const authors = props.authors?.length > 0 ? props.authors.join(", ") : "N/A";
  const categories = props.categories?.length > 0 ? props.categories.join(", ") : "N/A";
  const price = (props.price && props.price > 0) ? props.price : "N/A";

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:3000/books/" + props._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Book deleted successfully!');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to delete the book: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card style={{ width: '18rem' }} className="mb-3">
      <Card.Body>
        <Card.Img variant="top" src={thumbnailUrl} />
        <Card.Title>{props.title}</Card.Title>
        <br></br>
        <Card.Text><strong>Authors: </strong>{authors}</Card.Text>
        <Card.Text><strong>Categories: </strong>{categories}</Card.Text>
        <Card.Text><strong>Price: </strong>{price}</Card.Text>
        <br></br>
        <div className="d-flex justify-content-between">
          <Button href={"/book/" + props._id} variant="outline-primary">
            <FontAwesomeIcon icon={faExternalLink} />
          </Button>
          <Button href={"/book/" + props._id} variant="outline-warning">
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

export default BookCard;