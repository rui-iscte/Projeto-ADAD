import React, { useState, useEffect } from "react";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import LivrariaCard from "../components/LivrariaCard";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default function App() {
	let navigate = useNavigate();
	let [long, setLong] = useState(0);
	let [lat, setLat] = useState(0);
	let [long2, setLong2] = useState(0);
	let [lat2, setLat2] = useState(0);
	let [max, setMax] = useState(1000);
	let [min, setMin] = useState(0);
	let [livrarias, setLivrarias] = useState([]);
	let [page, setPage] = useState(1);
	let [totalPages, setTotalPages] = useState(1);
	let [dropdownOption, setDropdownOption] = useState(0);
	let [insideFeiraDoLivro, setInsideFeiraDoLivro] = useState(true);

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
			else if (data.error) livs = [];
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

	const getLivrariasNearRoute = async (currentPage = 1) => {
		try {
			if (isNaN(Number(currentPage))) currentPage = 1;
			const response = await fetch(
				"http://localhost:3000/livrarias/near/route/?page=" +
					Number(currentPage) +
					"&long1=" +
					long +
					"&lat1=" +
					lat +
					"&long2=" +
					long2 +
					"&lat2=" +
					lat2,
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
			else if (data.error) livs = [];
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

	const getInFeiraDoLivro = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/livrarias/feiradolivro/?" +
					"long=" +
					long +
					"&lat=" +
					lat,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const data = await response.json();
			console.log(data);
			setInsideFeiraDoLivro(data.inside_Feira_do_Livro);
			console.log(insideFeiraDoLivro);
		} catch (error) {
			console.error("Error:", error);
			setInsideFeiraDoLivro(false);
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
		if (dropdownOption === 0) {
			getLivrariasNear();
		} else if (dropdownOption === 1) {
			getLivrariasNearRoute();
		} else if (dropdownOption === 2) {
			getInFeiraDoLivro();
		}
	}, [long, lat, long2, lat2, max, min, dropdownOption]);

	const selectionChanged = (eventKey, event) => {
		if (event.target.id === "option_0") {
			setDropdownOption(0);
		} else if (event.target.id === "option_1") {
			setDropdownOption(1);
		} else if (event.target.id === "option_2") {
			setDropdownOption(2);
		}
	};

	let pageForm = 0;

	let pageContent = 0;

	if (dropdownOption === 0) {
		pageForm = (
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
						Minimum Distance:&nbsp;
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
						Maximum Distance:&nbsp;
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
		);

		pageContent = (
			<div>
				<CardGroup>
					<Row
						xs={1}
						md={2}
						className="d-flex justify-content-around"
					>
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
						<Button
							onClick={handleNextPage}
							variant="outline-primary"
						>
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
	} else if (dropdownOption === 1) {
		pageForm = (
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
						Longitude 2:&nbsp;
						<input
							type="text"
							onChange={(e) => {
								setLong2(e.target.value);
							}}
							value={long2}
						/>
					</label>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<label>
						Latitude 2:&nbsp;
						<input
							type="text"
							onChange={(e) => {
								setLat2(e.target.value);
							}}
							value={lat2}
						/>
					</label>
				</form>
			</div>
		);

		pageContent = (
			<div>
				<CardGroup>
					<Row
						xs={1}
						md={2}
						className="d-flex justify-content-around"
					>
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
						<Button
							onClick={handleNextPage}
							variant="outline-primary"
						>
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
	} else if (dropdownOption === 2) {
		pageForm = (
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
				</form>
			</div>
		);
		pageContent = (
			<p>
				{insideFeiraDoLivro
					? "The coordinates are inside Feira do Livro"
					: "The coordinates are not inside Feira do Livro"}
			</p>
		);
	}
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
			<div>
				<DropdownButton onSelect={selectionChanged} title="Options">
					<Dropdown.Item id="option_0">Search Near</Dropdown.Item>
					<Dropdown.Item id="option_1">
						Search Near Route
					</Dropdown.Item>
					<Dropdown.Item id="option_2">
						Is Inside Feira Do Livro
					</Dropdown.Item>
				</DropdownButton>
			</div>
			<br></br>
			{pageForm}
			<br></br>
			<br></br>
			{pageContent}
		</div>
	);
}
