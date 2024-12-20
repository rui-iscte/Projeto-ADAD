import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
	AppConfig,
	UserSession,
	AuthDetails,
	showConnect,
} from "@stacks/connect";
import { useState, useEffect } from "react";
import { userSession } from "./auth";

import "bootstrap/dist/css/bootstrap.css";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Book from "./pages/Book";
import JobReviews from "./pages/JobReviews";
import User from "./pages/User";
import EditBook from "./pages/EditBook";
import EditUser from "./pages/EditUser";
import PostBook from "./pages/PostBook";
import PostUser from "./pages/PostUser";
import Livrarias from "./pages/Livrarias";
import Footer from "./components/Footer";
import Livraria from "./pages/Livraria";
import PutLivraria from "./pages/PutLivraria";

function App() {
	const [userData, setUserData] = useState(undefined);

	useEffect(() => {
		if (userSession.isSignInPending()) {
			userSession.handlePendingSignIn().then((userData) => {
				setUserData(userData);
			});
		} else if (userSession.isUserSignedIn()) {
			setUserData(userSession.loadUserData());
		}
	}, []);

	return (
		<div className="App">
			<Router>
				<Navigation />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/books" element={<Books />} />
					<Route path="/users" element={<Users />} />
					<Route path="/book/:id" element={<Book />} />
					<Route path="/books/job" element={<JobReviews />} />
					<Route path="/user/:id" element={<User />} />
					<Route path="/editbook/:id" element={<EditBook />} />
					<Route path="/edituser/:id" element={<EditUser />} />
					<Route path="/postbook" element={<PostBook />} />
					<Route path="/postuser" element={<PostUser />} />
					<Route path="/livrarias" element={<Livrarias />} />
					<Route path="/livraria/:id" element={<Livraria />} />
					<Route path="/putlivraria/:id" element={<PutLivraria />} />
				</Routes>
				<Footer />
			</Router>
		</div>
	);
}

export default App;
