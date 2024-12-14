import React, { useState, useEffect } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import LivrariaCard from "../components/LivrariaCard";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default function App() {
	let navigate = useNavigate();
	let [long, setLong] = useState(0);
	let [lat, setLat] = useState(0);
	let [max, setMax] = useState(1000);
	let [min, setMin] = useState(0);
	let [livrarias, setLivrarias] = useState([]);
	let [page, setPage] = useState(1);
	let [totalPages, setTotalPages] = useState(1);

	const getLivrariasNear = async (currentPage = 1) => {
		try {
			if (isNaN(Number(currentPage))) currentPage = 1;
			const response = await fetch(
				"http://localhost:3000/livrarias/near/?page=" +
					Number(currentPage) +
					"&long=" +
					long +
					"&lat=" +
					lat +
					"&min=" +
					min +
					"&max=" +
					max,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const data = await response.json();
			console.log(data);
			let livs = [];
			if (data.results != null) livs = data.results;
			else livs = data;
			let toremove = [];
			for (let i = 0; i < livs.length; i++) {
				if (livs[i].geometry?.type !== "Point") {
					toremove.push(i);
				}
			}
			console.log(livs);
			let j = 0;
			toremove.forEach((i) => {
				livs.splice(i - j, 1);
			});
			setLivrarias(livs);
			setPage(currentPage);
			if (data.info == null) setTotalPages(1);
			else setTotalPages(data.info.pages);
		} catch (error) {
			console.error("Error:", error);
			setLivrarias([]);
		}
	};

	const handleNextPage = () => {
		if (page < totalPages) {
			getLivrariasNear(page + 1, long, lat);
		}
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			getLivrariasNear(page - 1, long, lat);
		}
	};

	useEffect(() => {
		getLivrariasNear();
	}, [long, lat, max, min]);

	return (
		<div className="container pt-5 pb-5">
			<Button
				href={"/"}
				/* onClick={() => navigate(-1)} */ variant="outline-secundary"
			>
				<FontAwesomeIcon icon={faAngleLeft} />
			</Button>
			<br></br>
			<br></br>
			<h2>Livrarias</h2>
			<br></br>
			<br></br>
			<div>
				<form>
					<label>
						Longitude:&nbsp;
						<input
							type="text"
							onChange={(e) => {
								setLong(e.target.value);
							}}
							value={long}
						/>
					</label>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<label>
						Latitude:&nbsp;
						<input
							type="text"
							onChange={(e) => {
								setLat(e.target.value);
							}}
							value={lat}
						/>
					</label>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<label>
						Min:&nbsp;
						<input
							type="text"
							onChange={(e) => {
								setMin(e.target.value);
							}}
							value={min}
						/>
					</label>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<label>
						Max:&nbsp;
						<input
							type="text"
							onChange={(e) => {
								setMax(e.target.value);
							}}
							value={max}
						/>
					</label>
				</form>
			</div>
			<br></br>
			<br></br>

			<CardGroup>
				<Row xs={1} md={2} className="d-flex justify-content-around">
					{livrarias &&
						livrarias.map((livraria) => {
							return (
								<LivrariaCard
									key={livraria._id}
									{...livraria}
								/>
							);
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
