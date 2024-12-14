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
import {
	faAngleLeft,
	faFilter,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";

const bytes = utf8ToBytes("foo");
const bufCV = bufferCV(bytes);

export default function App() {
	let params = useParams();
	let navigate = useNavigate();
	let [page, setPage] = useState(1);
	let [totalPages, setTotalPages] = useState(1);
	let [books, setBooks] = useState([]);

	const getBook = async (id, currentPage = 1) => {
		try {
			if (isNaN(Number(currentPage))) currentPage = 1;
			const response = await fetch(
				"http://localhost:3000/livrarias/" +
					id +
					"?page=" +
					Number(currentPage),
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
			setPage(currentPage);
			if (data.info == null) setTotalPages(1);
			else setTotalPages(data.info.pages);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleNextPage = () => {
		if (page < totalPages) {
			getBook(params.id, page + 1);
		}
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			getBook(params.id, page - 1);
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
			<Button
				href={"/putlivraria/" + params.id}
				variant="outline-success"
			>
				<FontAwesomeIcon icon={faPlus} />
			</Button>
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
			<div className="d-flex justify-content-between mt-4">
				{page !== 1 ? (
					<Button
						onClick={handlePreviousPage}
						variant="outline-primary"
					>
						Previous Page
					</Button>
				) : (
					<Button
						onClick={handlePreviousPage}
						variant="outline-secundary"
						disabled={page === 1}
					>
						Previous Page
					</Button>
				)}
				<span>
					Page {page} of {totalPages}
				</span>
				{page !== totalPages ? (
					<Button onClick={handleNextPage} variant="outline-primary">
						Next Page
					</Button>
				) : (
					<Button
						onClick={handleNextPage}
						variant="outline-secundary"
						disabled={page === totalPages}
					>
						Next Page
					</Button>
				)}
			</div>
		</div>
	);
}
