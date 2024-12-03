import Card from 'react-bootstrap/Card';

function ReviewCard(props) {
  const book_title = props.book_title?.length > 0 ? props.book_title : "Unknown Book";
  const score = props.score ? props.score : "N/A";
  let recommendation = props.recommendation !== undefined ? props.recommendation : "N/A";
  if (recommendation !== "N/A") {
    if (recommendation === true) {
        recommendation = "Buy"
    } else if (recommendation === false) {
        recommendation = "Don't Buy"
    }
  }
  const review_date = props.review_date?.length > 0 ? new Date(parseInt(props.review_date)).toGMTString() : "N/A";
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{book_title}</Card.Title>
        <br></br>
        <Card.Text><strong>Score: </strong>{score}</Card.Text>
        <Card.Text><strong>Recommendation: </strong>{recommendation}</Card.Text>
        <Card.Text><strong>Review Date: </strong>{review_date}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ReviewCard;