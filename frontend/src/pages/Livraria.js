import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from "@stacks/connect";
import { bufferCV } from "@stacks/transactions";
import { utf8ToBytes } from "@stacks/common";
import { userSession } from "../auth";

import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import BookCard from "../components/BookCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const bytes = utf8ToBytes("foo");
const bufCV = bufferCV(bytes);

export default function App() {
	let params = useParams();
	let navigate = useNavigate();
	let [books, setBooks] = useState([]);

	const getBook = async (id) => {
		try {
			const response = await fetch(
				"http://localhost:3000/livrarias/" + id,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const data = await response.json();
			let bookData = [];
			for (let i = 0; i < data.length; i++) {
				const response2 = await fetch(data[i].url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				bookData.push((await response2.json())[0]);
			}
			setBooks(bookData);
			console.log(bookData);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		let id = params.id;
		console.log(id);
		getBook(id);
	}, []);

	function formatDate(date) {
		var d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [day, month, year].join("-");
	}

	return (
		<div className="container pt-5 pb-5">
			{/* <Button onClick={() => navigate(-1)} variant="outline-secundary">
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button> */}
			<br></br>
			<br></br>
			<CardGroup>
				<Row xs={1} md={2} className="d-flex justify-content-around">
					{books &&
						Array.isArray(books) &&
						books.map((book) => {
							return <BookCard key={book._id} {...book} />;
						})}
				</Row>
			</CardGroup>
		</div>
	);
}
