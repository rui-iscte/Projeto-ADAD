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
	let [user, setUser] = useState(1);

	/* useEffect(() => {
    let id = params.id;
    console.log(id);
    getBook(params.id);
  }, []); */

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newReviews = user.reviews.split(";").map((reviewString) => {
			const parts = reviewString.split(",").map((part) => part.trim());
			return {
				book_id: parts[0]?.split(":")[1]?.trim() || "",
				score: Number(parts[1]?.split(":")[1]?.trim()) || "",
				recommendation: parts[2]?.split(":")[1]?.trim() === "true",
				review_date: parts[3]?.split(":")[1]?.trim() || "",
			};
		});

		const newUser = {
			...user,
			reviews: newReviews,
		};

		try {
			const response = await fetch("http://localhost:3000/users/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newUser),
			});

			if (response.ok) {
				alert("User added successfully!");
				navigate("/users");
			} else {
				const error = await response.json();
				alert(`Failed to add the user: ${error.error}`);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="container pt-5 pb-5">
			<Button
				href={"/users"}
				/* onClick={() => navigate(-1)} */ variant="outline-secundary"
			>
				<FontAwesomeIcon icon={faAngleLeft} />
			</Button>
			<br></br>
			<br></br>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>First Name*</Form.Label>
					<Form.Control
						name="first_name"
						type="text"
						pattern="[\p{L}\s]+"
						placeholder="Enter first name"
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Last Name</Form.Label>
					<Form.Control
						name="last_name"
						type="text"
						pattern="[\p{L}\s]+"
						placeholder="Enter last name"
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Year of Birth</Form.Label>
					<Form.Control
						name="year_of_birth"
						type="number"
						step="0"
						min="1"
						placeholder="Enter year of birth"
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Job</Form.Label>
					<Form.Control
						name="job"
						type="text"
						pattern="[\p{L}\s]+"
						placeholder="Enter job"
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Reviews</Form.Label>
					<Form.Control
						name="reviews"
						type="text"
						placeholder="Enter reviews"
						onChange={handleChange}
					/>
					<Form.Text className="text-muted">
						Separate reviews with a ` ; `. Each review should have
						the format:
						<br></br>
						<code>
							Book ID: &lt;id&gt;, Score: &lt;score&gt;,
							Recommendation: &lt;true/false&gt;, Review Date:
							&lt;Unix Timestamp (e.g., 1586584290000)&gt;
						</code>
					</Form.Text>
				</Form.Group>

				<Button variant="primary" type="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
}
