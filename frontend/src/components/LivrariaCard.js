import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faExternalLink,
	faPenToSquare,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

function LivrariaCard(props) {
	const nome =
		props.properties?.INF_NOME?.length > 0
			? props.properties.INF_NOME
			: "N/A";
	const morada =
		props.properties?.INF_MORADA?.length > 0
			? props.properties.INF_MORADA
			: "N/A";
	const freguesia =
		props.properties?.FREGUESIA?.length > 0
			? props.properties.FREGUESIA
			: "N/A";
	const telefone =
		props.properties?.INF_TELEFONE?.length > 0
			? props.properties.INF_TELEFONE
			: "N/A";
	const descricao =
		props.properties?.INF_DESCRICAO?.length > 0
			? props.properties.INF_DESCRICAO
			: "N/A";
	const fonte =
		props.properties?.INF_FONTE?.length > 0
			? props.properties.INF_FONTE
			: "N/A";

	return (
		<Card style={{ width: "18rem" }} className="mb-3">
			<Card.Body>
				<Card.Title>{nome}</Card.Title>
				<br></br>
				<Card.Text>
					<strong>Address: </strong>
					{morada + " " + freguesia}
				</Card.Text>
				<Card.Text>
					<strong>Phone Number: </strong>
					{telefone}
				</Card.Text>
				<Card.Text>
					<strong>Website: </strong>
					{fonte}
				</Card.Text>
				<br></br>
				<div className="d-flex justify-content-between">
					<Button
						href={"/livraria/" + props._id}
						target="_blank"
						variant="outline-primary"
					>
						<FontAwesomeIcon icon={faExternalLink} />
					</Button>
				</div>
			</Card.Body>
		</Card>
	);
}

export default LivrariaCard;
