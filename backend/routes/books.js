import express from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";

const router = express.Router();

function typeId(id) {
    if (id.length >= 24)
        return new ObjectId(id)
    else
        return parseInt(id)
}

function makeInfo(documentCount, pageCount, baseURL, currentPage) {
    return {
        count: documentCount,
        pages: pageCount,
        next: currentPage < pageCount ? baseURL + (currentPage + 1) : null,
        prev: currentPage > 1 ? baseURL + (currentPage - 1) : null,
    };
}

// Para o frontend
router.get("/all", async (req, res) => {
    try {

        let results = await db
            .collection("books")
            .find({})
            .toArray();

        if (results.length == 0) {
            return res.status(400).send("No results");
        }

        res.status(200).send(results);
    } catch (e) {
        res.status(400).send("Could not fetch books");
    }
});

//  Alínea 1
router.get("/", async (req, res) => {
    const docCount = await db.collection("books").countDocuments();

    const defaultDocPerPage = 20;

    const pageCount = Math.ceil(docCount / defaultDocPerPage);

    let page = req.query.page;

    try {
        if (typeof page === "undefined") page = 1;
        else page = Number(page);

        if (isNaN(page)) return res.status(400).send("Bad user input");

        let results = await db
            .collection("books")
            .find({})
            .limit(defaultDocPerPage)
            .skip((page - 1) * defaultDocPerPage)
            .toArray();

        if (results.length == 0) {
            return res.status(400).send("No results");
        }

        if (page < 1) return res.status(400).send("Bad user input");
        else if (page > pageCount)
            return res.status(400).send("Bad user input");

        let message = {
            info: makeInfo(
                docCount,
                pageCount,
                "http://localhost:3000/books/?page=",
                page
            ),
            results,
        };

        res.status(200).send(message);
    } catch (e) {
        res.status(400).send("Could not fetch books");
    }
});

//  Alínea 3
router.post('/', async (req, res) => {

    try {

        let result;

        if (!Array.isArray(req.body)) {
            if (req.body.title === undefined) {
                return res.status(400).send({ error: "Title not defined" });
            }

            const insertFields = {};

            insertFields.title = req.body.title;
            insertFields.isbn = req.body.isbn;
            insertFields.pageCount = req.body.pageCount;
            insertFields.publishedDate = req.body.publishedDate;
            insertFields.thumbnailUrl = req.body.thumbnailUrl;
            insertFields.shortDescription = req.body.shortDescription;
            insertFields.longDescription = req.body.longDescription;
            insertFields.status = req.body.status;
            insertFields.authors = req.body.authors;
            insertFields.categories = req.body.categories;
            insertFields.price = req.body.price;

            result = await db.collection('books').insertOne(insertFields);
        } else {
            if (Object.keys(req.body).length == 0) {
                return res.status(400).send({ error: "Request body array is empty" });
            }
            if (req.body.some(item => item.title === undefined)) {
                return res.status(400).send({ error: "One or more books don't have a title" });
            }

            const insertFields = req.body.map(book => ({
                title: book.title,
                isbn: book.isbn,
                pageCount: book.pageCount,
                publishedDate: book.publishedDate,
                thumbnailUrl: book.thumbnailUrl,
                shortDescription: book.shortDescription,
                longDescription: book.longDescription,
                status: book.status,
                authors: book.authors,
                categories: book.categories,
                price: book.price
            }));
            result = await db.collection('books').insertMany(insertFields);
        }

        if (result.insertedCount == 0) {
            return res.status(404).send({ error: "Book(s) not inserted" });
        }

        res.send(result).status(200);

    } catch (error) {
        res.send(error).status(500);
    }

});

//  Alínea 7
router.delete('/:id', async (req, res) => {

    try {

        const id = typeId(req.params.id);
        const result = await db.collection('books').deleteOne({ _id: id });

        if (result.deletedCount == 0) {
            return res.status(404).send({ error: "Book not found" });
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error);
    }

});

//  Alínea 9
router.put('/:id', async (req, res) => {

    try {

        const id = typeId(req.params.id);

        const updateFields = {};

        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.isbn) updateFields.isbn = req.body.isbn;
        if (req.body.pageCount) updateFields.pageCount = req.body.pageCount;
        if (req.body.publishedDate) updateFields.publishedDate = req.body.publishedDate;
        if (req.body.thumbnailUrl) updateFields.thumbnailUrl = req.body.thumbnailUrl;
        if (req.body.shortDescription) updateFields.shortDescription = req.body.shortDescription;
        if (req.body.longDescription) updateFields.longDescription = req.body.longDescription;
        if (req.body.status) updateFields.status = req.body.status;
        if (req.body.authors) updateFields.authors = req.body.authors;
        if (req.body.categories) updateFields.categories = req.body.categories;
        if (req.body.price) updateFields.price = req.body.price;

        const result = await db.collection('books')
            .updateOne(
                { _id: id },
                { $set: updateFields }
            );

        if (result.modifiedCount == 0) {
            return res.status(400).send({ error: "No Changes" });
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error);
    }

});

//  Alínea 11
router.get("/top/:limit", async (req, res) => {
    try {
        const defaultDocPerPage = 20;
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.params.limit);
        let results = await db.collection('users').aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$reviews.book_id",
                    average_score: { $avg: "$reviews.score" }
                }
            },
            {
                $sort: {
                    "average_score": -1
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            },
            {
                $unwind: "$book_info"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$book_info", { average_score: "$average_score" }]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    isbn: 1,
                    pageCount: 1,
                    publishedDate: 1,
                    thumbnailUrl: 1,
                    shortDescription: 1,
                    longDescription: 1,
                    status: 1,
                    authors: 1,
                    categories: 1,
                    price: 1,
                    average_score: 1
                }
            }
        ])
            .limit(limit)
            .skip((page - 1) * defaultDocPerPage)
            .limit(defaultDocPerPage)
            .toArray();

        let docSize = await db.collection('users').aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$reviews.book_id",
                    average_score: { $avg: "$reviews.score" }
                }
            },
            {
                $sort: {
                    "average_score": -1
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            }
        ])
            .limit(limit)
            .toArray();
        if (docSize.length == 0) {
            return res.status(404).send({ error: "There are no books that match this search." });
        }
        const docCount = docSize.length;
        const pageCount = Math.ceil(docCount / defaultDocPerPage);
        if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/books/top/" + limit + "?page=",
                    page
                ),
                results,
            };
            res.send(message).status(200);
        } else {
            res.send(results).status(200);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//  Alínea 12
router.get("/ratings/:order", async (req, res) => {
    try {
        const ordem = req.params.order == "asc" ? 1 : -1;
        const defaultDocPerPage = 20;
        let page = parseInt(req.query.page) || 1;
        let results = await db.collection('users').aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$reviews.book_id",
                    total_reviews: { $count: {} }
                }
            },
            {
                $sort: {
                    "total_reviews": ordem
                }
            },
            {
                $lookup:
                {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            },
            {
                $unwind: "$book_info"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$book_info", { total_reviews: "$total_reviews" }]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    isbn: 1,
                    pageCount: 1,
                    publishedDate: 1,
                    thumbnailUrl: 1,
                    shortDescription: 1,
                    longDescription: 1,
                    status: 1,
                    authors: 1,
                    categories: 1,
                    price: 1,
                    total_reviews: 1
                }
            },
            {
                $sort: {
                    "total_reviews": ordem, "_id": -1
                }
            }
        ])
            .skip((page - 1) * defaultDocPerPage)
            .limit(defaultDocPerPage)
            .toArray();
        let docSize = await db.collection('users').aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$reviews.book_id",
                    total_reviews: { $count: {} }
                }
            },
            {
                $sort: {
                    "total_reviews": ordem
                }
            },
            {
                $lookup:
                {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            }
        ])
            .toArray();
        if (req.params.order !== "asc" && req.params.order !== "dsc") {
            return res.status(404).send({ error: "Invalid order." });
        }
        if (results.length == 0) {
            return res.status(404).send({ error: "Books not found." });
        }
        const docCount = docSize.length;
        const pageCount = Math.ceil(docCount / defaultDocPerPage);
        if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/books/ratings/" + req.params.order + "?page=",
                    page
                ),
                results,
            };
            res.send(message).status(200);
        } else {
            res.send(results).status(200);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//  Alínea 13
router.get("/star", async (req, res) => {
    try {
        const defaultDocPerPage = 20;
        let page = parseInt(req.query.page) || 1;
        let results = await db.collection('users').aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $match: {
                    "reviews.score": 5
                }
            },
            {
                $group: {
                    _id: "$reviews.book_id",
                    total_5_star_reviews: { $count: {} }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            },
            {
                $unwind: "$book_info"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$book_info", { total_5_star_reviews: "$total_5_star_reviews" }]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    isbn: 1,
                    pageCount: 1,
                    publishedDate: 1,
                    thumbnailUrl: 1,
                    shortDescription: 1,
                    longDescription: 1,
                    status: 1,
                    authors: 1,
                    categories: 1,
                    price: 1,
                    total_5_star_reviews: 1
                }
            },
            {
                $sort: {
                    "total_5_star_reviews": -1, "_id": -1
                }
            }
        ])
            .skip((page - 1) * defaultDocPerPage)
            .limit(defaultDocPerPage)
            .toArray();

        let docSize = await db.collection('users').aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $match: {
                    "reviews.score": 5
                }
            },
            {
                $group: {
                    _id: "$reviews.book_id",
                    total_5_star_reviews: { $count: {} }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            }
        ])
            .toArray();
        if (docSize.length == 0) {
            return res.status(404).send({ error: "There are no books that match this search." });
        }
        const docCount = docSize.length;
        const pageCount = Math.ceil(docCount / defaultDocPerPage);
        if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/books/star?page=",
                    page
                ),
                results,
            };
            res.send(message).status(200);
        } else {
            res.send(results).status(200);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//  Alínea 15
router.get("/comments", async (req, res) => {
    try {
        const defaultDocPerPage = 20;
        let page = parseInt(req.query.page) || 1;
        let results = await db.collection('comments').aggregate([
            {
                $group: {
                    _id: "$book_id",
                    total_comms: { $count: {} }
                }
            },
            {
                $sort: {
                    "total_comms": 1
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            }
        ]
        ).skip((page - 1) * defaultDocPerPage)
            .limit(defaultDocPerPage)
            .toArray();

        let docSize = await db.collection('comments').aggregate([
            {
                $group: {
                    _id: "$book_id",
                    total_comms: { $count: {} }
                }
            },
            {
                $sort: {
                    "total_comms": 1
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            }
        ]
        ).toArray();
        if (results.length == 0) {
            return res.status(404).send({ error: "There are no books that match this search." });
        }
        const docCount = docSize.length;
        const pageCount = Math.ceil(docCount / defaultDocPerPage);
        if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/books/comments?page=",
                    page
                ),
                results,
            };
            res.send(message).status(200);
        } else {
            res.send(results).status(200);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//  Alínea 16
// GET /books/job: Find the total number of reviews by job with pagination.
router.get("/job", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const jobReviewCounts = await db.collection("users").aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$job",
                    totalReviews: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 0,
                    job: "$_id",
                    totalReviews: 1
                }
            }
        ]).toArray();

        const jobReviewCountsSize = await db.collection("users").aggregate([
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$job",
                    totalReviews: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    job: "$_id",
                    totalReviews: 1
                }
            }
        ]).toArray();

        const totalPages = Math.ceil(jobReviewCountsSize.length / limit);
        const baseUrl = `http://localhost:3000/books/job`;

        const buildPageUrl = (newPage) => {
            const queryParams = new URLSearchParams(req.query);
            queryParams.set('page', newPage);
            return `${baseUrl}?${queryParams.toString()}`;
        };

        const paginationInfo = jobReviewCountsSize.length >= limit ? {
            count: jobReviewCountsSize.length,
            pages: totalPages,
            next: jobReviewCounts.length < limit ? null : buildPageUrl(page + 1),
            prev: page > 1 ? buildPageUrl(page - 1) : null
        } : null;

        const response = {
            ...(paginationInfo && { info: paginationInfo }),
            results: jobReviewCounts
        };

        if (jobReviewCountsSize.length === 0) {
            return res.status(404).send({ error: "No job review counts found matching the criteria." });
        }

        res.status(200).send(response);

    } catch (error) {
        console.error("Error fetching job review counts:", error);
        res.status(500).send({ error: "An error occurred while fetching job review counts." });
    }
});

//  Alínea 17
// GET /books/filter: filter books by price, categories, and/or authors, with pagination.
/* 
1. Single Price Range:
GET /books/filter?price_min=10&price_max=50

2. Single Category:
GET /books/filter?categories=Web%20Development

3. Single Author:
GET /books/filter?authors=Robi%20Sen

4. Multiple Categories:
GET /books/filter?categories=Web%20Development,Data%20Science

5. Multiple Authors:
GET /books/filter?authors=Robi%20Sen,J.K.%20Rowling 

6. Multiple Authors and Price Range:
GET /books/filter?authors=J.K.%20Rowling,George%20Orwell&price_min=10&price_max=50

7. All Filters:
GET /books/filter?categories=Web%20Development,Data%20Science&authors=J.K.%20Rowling&price_min=15
*/
router.get("/filter", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const price = req.query.price;
        const price_min = req.query.price_min;
        const price_max = req.query.price_max;
        const categories = req.query.categories;
        const authors = req.query.authors;

        const filters = {};

        if (price) {
            filters.price = parseFloat(price);
        } else {
            if (price_min) filters.price = { ...filters.price, $gte: parseFloat(price_min) };
            if (price_max) filters.price = { ...filters.price, $lte: parseFloat(price_max) };
        }

        if (categories) {
            const categoryList = decodeURIComponent(categories).split(",");
            filters.categories = { $in: categoryList };
        }

        if (authors) {
            const authorList = decodeURIComponent(authors).split(",");
            filters.authors = { $in: authorList };
        }

        // Fetch paginated books
        const books = await db.collection("books").find(filters).skip(skip).limit(limit).toArray();

        // Get total document count (without pagination)
        const totalDocs = await db.collection("books").countDocuments(filters);
        const totalPages = Math.ceil(totalDocs / limit);

        // Pagination logic
        const baseUrl = `http://localhost:3000/books/filter`;
        const buildPageUrl = (newPage) => {
            const queryParams = new URLSearchParams(req.query);
            queryParams.set("page", newPage);
            return `${baseUrl}?${queryParams.toString()}`;
        };

        // Include pagination info only if there are multiple pages
        const paginationInfo = totalPages > 1 ? {
            count: totalDocs, // Total books matching the filters
            pages: totalPages, // Total number of pages
            next: page < totalPages ? buildPageUrl(page + 1) : null,
            prev: page > 1 ? buildPageUrl(page - 1) : null,
        } : null;

        // Response structure
        const response = {
            ...(paginationInfo && { info: paginationInfo }),
            results: books
        };

        // Return 404 if no books found
        if (books.length === 0) {
            return res.status(404).send({ error: "No books found matching the filter criteria." });
        }

        res.status(200).send(response);

    } catch (error) {
        console.error("Error fetching filtered books:", error);
        res.status(500).send({ error: "An error occurred while fetching books." });
    }
});



//  Alínea 14
router.get("/year/:year", async (req, res) => {
    try {
        const year1 = req.params.year;
        const year2 = parseInt(req.params.year) + 1;
        const timestamp1 = new Date(year1).getTime().toString();
        const timestamp2 = new Date(year2.toString()).getTime().toString();
        const defaultDocPerPage = 20;
        let page = parseInt(req.query.page) || 1;
        let results = await db.collection('users').aggregate([
            { $unwind: "$reviews" },
            {
                $match: {
                    $and: [
                        { "reviews.review_date": { $gte: timestamp1 } },
                        { "reviews.review_date": { $lt: timestamp2 } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$reviews.book_id"
                }
            },
            {
                $lookup:
                {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            },
            {
                $unwind: "$book_info"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$book_info", { year: "$year" }]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    isbn: 1,
                    pageCount: 1,
                    publishedDate: 1,
                    thumbnailUrl: 1,
                    shortDescription: 1,
                    longDescription: 1,
                    status: 1,
                    authors: 1,
                    categories: 1,
                    price: 1,
                }
            },
            {
                $sort: {
                    "_id": -1
                }
            }
        ])
            .skip((page - 1) * defaultDocPerPage)
            .limit(defaultDocPerPage)
            .toArray();
        let docSize = await db.collection('users').aggregate([
            { $unwind: "$reviews" },
            {
                $match: {
                    $and: [
                        { "reviews.review_date": { $gte: timestamp1 } },
                        { "reviews.review_date": { $lt: timestamp2 } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$reviews.book_id"
                }
            },
            {
                $lookup:
                {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book_info"
                }
            }
        ]
        ).toArray();
        if (req.params.year.length !== 4 || isNaN(req.params.year)) {
            return res.status(404).send({ error: "Invalid year." });
        }
        if (results.length == 0) {
            return res.status(404).send({ error: "Books not found." });
        }
        const docCount = docSize.length;
        const pageCount = Math.ceil(docCount / defaultDocPerPage);
        if (docCount > 20) {
            let message = {
                info: makeInfo(
                    docCount,
                    pageCount,
                    "http://localhost:3000/books/" + year1 + "?page=",
                    page
                ),
                results,
            };
            res.send(message).status(200);
        } else {
            res.send(results).status(200);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//  Alínea 5
router.get("/:id", async (req, res) => {

    try {

        const id = typeId(req.params.id);

        let book = await db.collection('books')
            .aggregate([
                { $match: { _id: id } },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "book_id",
                        as: "comments"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { book_id: "$_id" },
                        pipeline: [
                            { $unwind: "$reviews" },
                            { $match: { $expr: { $eq: ["$reviews.book_id", "$$book_id"] } } },
                            { $group: { _id: 0, average_score: { $avg: "$reviews.score" } } }
                        ],
                        as: "average_score"
                    }
                },
                /* { $addFields: {
                    average_score: { $ifNull: [{ $arrayElemAt: ["$average_score.average_score", 0] }, 0] }
                }}, */
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        isbn: 1,
                        pageCount: 1,
                        publishedDate: 1,
                        thumbnailUrl: 1,
                        shortDescription: 1,
                        longDescription: 1,
                        status: 1,
                        authors: 1,
                        categories: 1,
                        price: 1,
                        average_score: { $ifNull: [{ $arrayElemAt: ["$average_score.average_score", 0] }, 0] },
                        comments: { $ifNull: ["$comments", []] }
                    }
                }
            ])
            .toArray();

        if (book.length == 0) {
            return res.status(404).send({ error: "Book not found" });
        }

        res.status(200).send(book);

    } catch (error) {
        res.status(500).send(error);
    }

});

export default router;