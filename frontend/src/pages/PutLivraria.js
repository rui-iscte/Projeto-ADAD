import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from "@stacks/connect";
import { bufferCV } from "@stacks/transactions";
import { utf8ToBytes } from "@stacks/common";
import { userSession } from "../auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const bytes = utf8ToBytes("foo");
const bufCV = bufferCV(bytes);

export default function App() {
	let params = useParams();
	let navigate = useNavigate();
	let [books, setBooks] = useState("");

	/* useEffect(() => {
    let id = params.id;
    console.log(id);
    getBook(params.id);
  }, []); */

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBooks(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let newBooks = books.split(",").map(function (book) {
			return parseInt(book.trim(), 10);
		});

		console.log(JSON.stringify({ books: newBooks }));

		try {
			const response = await fetch(
				"http://localhost:3000/livrarias/" + params.id,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ books: newBooks }),
				}
			);

			if (response.ok) {
				alert("Book(s) added with success!");
				navigate("/livraria/" + params.id);
			} else {
				const error = await response.json();
				alert(`Failed to add the book(s): ${error.error}`);
			}
		} catch (er) {
			console.error("Error:", er);
		}
	};

	return (
		<div className="container pt-5 pb-5">
			<Button
				href={"/livraria/" + params.id}
				/* onClick={() => navigate(-1)} */ variant="outline-secundary"
			>
				<FontAwesomeIcon icon={faAngleLeft} />
			</Button>
			<br></br>
			<br></br>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Books*</Form.Label>
					<Form.Control
						onChange={handleChange}
						name="books"
						type="text"
						pattern="^[0-9]+([\s]*,[\s]*[0-9]+)*$"
						placeholder="Enter book ids"
						required
					/>
					<Form.Text className="text-muted">
						Write the ids of the books, splitted with a ','.
					</Form.Text>
				</Form.Group>

				<Button variant="primary" type="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
}
