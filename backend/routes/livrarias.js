import express, { json } from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";
import turf from "turf";

const router = express.Router();

function typeId(id) {
	if (id.length >= 24) return ObjectId(id);
	else return parseInt(id);
}

function makeInfo(documentCount, pageCount, baseURL, currentPage) {
	return {
		count: documentCount,
		pages: pageCount,
		next: currentPage < pageCount ? baseURL + (currentPage + 1) : null,
		prev: currentPage > 1 ? baseURL + (currentPage - 1) : null,
	};
}

router.get("/near/", async (req, res) => {
	let longitude = req.body.long;
	let latitude = req.body.lat;
	let maxDistance = req.body.max;
	let minDistance = req.body.min;

	let page = req.query.page;

	if (!longitude || !latitude) {
		return res.status(400).send("Bad user input");
	}

	longitude = Number(longitude);
	latitude = Number(latitude);
	maxDistance = Number(maxDistance);
	minDistance = Number(minDistance);

	if (isNaN(longitude) || isNaN(latitude)) {
		return res.status(400).send("Bad user input");
	}
	if (isNaN(maxDistance)) maxDistance = 1000;

	if (isNaN(minDistance)) minDistance = 0;

	if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
		return res.status(400).send("Invalid latitude/longitude values");
	}

	if (typeof page === "undefined") page = 1;
	else page = Number(page);

	if (isNaN(page)) return res.status(400).send("Bad user input");

	try {
		const defaultDocPerPage = 20;

		const docCount = await db
			.collection("livrarias")
			.find({
				geometry: {
					$nearSphere: {
						$geometry: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
						$maxDistance: maxDistance,
						$minDistance: minDistance,
					},
				},
			})
			.toArray().length;

		let results = await db
			.collection("livrarias")
			.find({
				geometry: {
					$nearSphere: {
						$geometry: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
						$maxDistance: maxDistance,
						$minDistance: minDistance,
					},
				},
			})
			.limit(defaultDocPerPage)
			.skip((page - 1) * defaultDocPerPage)
			.toArray();

		const pageCount = Math.ceil(docCount / defaultDocPerPage);

		if (results.length == 0) {
			return res.status(400).send("No results");
		}

		if (page < 1) return res.status(400).send("Bad user input");
		else if (page > pageCount)
			return res.status(400).send("Bad user input");

        if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/livrarias/near/?page=",
                    page
                ),
                results,
            };
    
            res.status(200).send(message);
        } else {
            res.status(200).send(results);
        }
		
	} catch (e) {
		res.status(500).send("Internal Error");
	}
});

router.get("/near/route", async (req, res) => {
	let longitude1 = req.body.long1;
	let latitude1 = req.body.lat1;
	let longitude2 = req.body.long2;
	let latitude2 = req.body.lat2;

	let page = req.query.page;

	if (!longitude1 || !latitude1 || !longitude2 || !latitude2) {
		return res.status(400).send("Bad user input");
	}

	longitude1 = Number(longitude1);
	latitude1 = Number(latitude1);
	longitude2 = Number(longitude2);
	latitude2 = Number(latitude2);

	if (
		isNaN(longitude1) ||
		isNaN(latitude1) ||
		isNaN(longitude2) ||
		isNaN(latitude2)
	) {
		return res.status(400).send("Bad user input");
	}

	if (
		Math.abs(latitude1) > 90 ||
		Math.abs(longitude1) > 180 ||
		Math.abs(latitude2) > 90 ||
		Math.abs(longitude2) > 180
	) {
		return res.status(400).send("Invalid latitude/longitude values");
	}

	if (typeof page === "undefined") page = 1;
	else page = Number(page);

	if (isNaN(page)) return res.status(400).send("Bad user input");

	try {
		const defaultDocPerPage = 20;

		let line = turf.lineString([
			[longitude1, latitude1],
			[longitude2, latitude2],
		]);

		let polygon = turf.buffer(line, 0.01);

		const docCount = await db
			.collection("livrarias")
			.find({
				geometry: {
					$geoIntersects: {
						$geometry: polygon.geometry,
					},
				},
			})
			.toArray().length;

		let results = await db
			.collection("livrarias")
			.find({
				geometry: {
					$geoIntersects: {
						$geometry: polygon.geometry,
					},
				},
			})
			.limit(defaultDocPerPage)
			.skip((page - 1) * defaultDocPerPage)
			.toArray();

		const pageCount = Math.ceil(docCount / defaultDocPerPage);

		if (results.length == 0) {
			return res.status(400).send("No results");
		}

		if (page < 1) return res.status(400).send("Bad user input");
		else if (page > pageCount)
			return res.status(400).send("Bad user input");

		if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/livrarias/near/route/?page=",
                    page
                ),
                results,
            };
    
            res.status(200).send(message);
        } else {
            res.status(200).send(results);
        }

	} catch (e) {
		console.log(e);
		res.status(500).send("Internal Error");
	}
});

router.get("/near/count/", async (req, res) => {
	let longitude = req.body.long;
	let latitude = req.body.lat;
	let maxDistance = req.body.max;
	let minDistance = req.body.min;

	if (!latitude || !latitude) {
		return res.status(400).send("Bad user input");
	}
	longitude = Number(longitude);
	latitude = Number(latitude);
	maxDistance = Number(maxDistance);
	minDistance = Number(minDistance);

	if (isNaN(longitude) || isNaN(latitude)) {
		return res.status(400).send("Bad user input");
	}
	if (isNaN(maxDistance)) maxDistance = 1000;

	if (isNaN(minDistance)) minDistance = 0;

	if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
		return res.status(400).send("Invalid latitude/longitude values");
	}
	try {
		let result = await db
			.collection("livrarias")
			.find({
				geometry: {
					$nearSphere: {
						$geometry: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
						$maxDistance: maxDistance,
						$minDistance: minDistance,
					},
				},
			})
			.toArray();

		res.status(200).send({ count: result.length });
	} catch (e) {
		console.log(e);
		res.status(500).send("Internal Error");
	}
});

router.get("/feiradolivro/", async (req, res) => {
	let longitude = req.body.long;
	let latitude = req.body.lat;

	if (!latitude || !latitude) {
		return res.status(400).send("Bad user input");
	}
	longitude = Number(longitude);
	latitude = Number(latitude);

	if (isNaN(longitude) || isNaN(latitude)) {
		return res.status(400).send("Bad user input");
	}

	if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
		return res.status(400).send("Invalid latitude/longitude values");
	}
	try {
		let result = await db
			.collection("livrarias")
			.find({
				geometry: {
					$geoIntersects: {
						$geometry: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
					},
				},
			})
			.toArray();

		let dentroDaFeira = false;

		let i = 0;
		while (i < result.length) {
			if (result[i].name == "Feira do Livro") dentroDaFeira = true;
			i++;
		}

		res.status(200).send({ inside_Feira_do_Livro: dentroDaFeira });
	} catch (e) {
		console.log(e);
		res.status(500).send("Internal Error");
	}
});

router.get("/:id", async (req, res) => {
	try {
		let results = await db
			.collection("livrarias")
			.find({ _id: typeId(req.params.id) })
			.toArray();

		const defaultDocPerPage = 20;

		let page = req.query.page;

		if (typeof page === "undefined") page = 1;
		else page = Number(page);

		if (isNaN(page)) return res.status(400).send("Bad user input");

		if (!results) {
			return res.status(400).send("Library not found");
		}

		let libraryBooks = results[0].books;

		if (libraryBooks) {
			let books = [];
			for (let arrayId in libraryBooks) {
				let result = await db
					.collection("books")
					.find({ _id: typeId(libraryBooks[arrayId]) })
					.toArray();

				books.push({
					title: result[0].title,
					url: "http://localhost:3000/books/" + result[0]._id,
				});
			}

			const pageCount = Math.ceil(
				libraryBooks.length / defaultDocPerPage
			);

			if (page < 1) return res.status(400).send("Bad user input");
			else if (page > pageCount)
				return res.status(400).send("Bad user input");

		if (libraryBooks.length > 20) {
            let message = {
                info: makeInfo(
                    libraryBooks.length,
                    pageCount,
                    "http://localhost:3000/livrarias/" + typeId(req.params.id) + "?page=",
                    page
                ),
                results,
            };
    
            res.status(200).send(message);
        } else {
            res.status(200).send(books);
        }
		} else {
			res.status(400).send("Library does not have books");
		}
	} catch (e) {
        console.log(e)
		res.status(500).send("Internal Error");
	}
});

router.put("/:id", async (req, res) => {
	try {
		let booksArray = req.body.books;

		let libraryId = typeId(req.params.id);

		if (!booksArray || booksArray.length == 0) {
			return res
				.send(`\"${booksArray}\" is not a valid JSON array.`)
				.status(400);
		}

		let wrongIds = [];

		let bookIds = [];

		for (let arrayId in booksArray) {
			let result = await db
				.collection("books")
				.find({ _id: typeId(booksArray[arrayId]) })
				.toArray();

			if (result.length == 0) wrongIds.push(booksArray[arrayId]);
		}

		if (wrongIds.length > 0) {
			return res.status(400).send("Books not found");
		}

		let result = await db
			.collection("livrarias")
			.find({ _id: libraryId })
			.toArray();

		if (result.length == 0) {
			return res.status(400).send("Library not found");
		}

		if (result[0].books) bookIds = booksArray.concat(result[0].books);
		else bookIds = booksArray;

		// Filter Duplicates
		bookIds = bookIds.filter(
			(item, index) => bookIds.indexOf(item) === index
		);

		bookIds.sort(function (a, b) {
			return a - b;
		});

		let status = await db.collection("livrarias").updateOne(
			{ _id: libraryId },
			{
				$set: {
					books: bookIds,
				},
			}
		);

		if (status.modifiedCount == 1) {
			res.status(200).send("Books added to library");
		} else {
			res.status(400).send("Books not added to library");
		}
	} catch (e) {
		console.log(e);
		res.status(500).send("Internal Error");
	}
});

export default router;