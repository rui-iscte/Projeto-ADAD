import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function BookCard(props) {
  const thumbnailUrl = props.thumbnailUrl?.length > 0 ? props.thumbnailUrl : "https://media.istockphoto.com/id/1500807425/vector/image-not-found-icon-vector-design.jpg?s=612x612&w=0&k=20&c=SF3EoL0zSi3XUwFzduMo3xdJFEk8V5IUsGqRocgPEtU=";
  const authors = props.authors?.length > 0 ? props.authors.join(", ") : "N/A";
  const categories = props.categories?.length > 0 ? props.categories.join(", ") : "N/A";
  return (
    <Card style={{ width: '18rem' }} className="mb-3">
      <Card.Body>
        <Card.Img variant="top" src={thumbnailUrl} />
        <Card.Title>{props.title}</Card.Title>
        <br></br>
        <Card.Text><strong>Authors: </strong>{authors}</Card.Text>
        <Card.Text><strong>Categories: </strong>{categories}</Card.Text>
        <Button href={"/book/" + props._id} variant="outline-primary">Open Book</Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard;