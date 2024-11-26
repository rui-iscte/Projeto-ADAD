import express from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";

const router = express.Router();

function typeId(id){
    if (id.length >=24)
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

//  Alínea 2
router.get("/", async (req, res) => {
    const docCount = await db.collection("users").countDocuments();

    const defaultDocPerPage = 20;

    const pageCount = Math.ceil(docCount / defaultDocPerPage);

    let page = req.query.page;

    try {
        if (typeof page === "undefined") page = 1;
        else page = Number(page);

        if (isNaN(page)) return res.status(400).send("Bad user input");

        let results = await db
            .collection("users")
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
                "http://localhost:3000/users/?page=",
                page
            ),
            results,
        };

        res.status(200).send(message);
    } catch (e) {
        res.status(400).send("Could not fetch users");
    }
});

//  Alínea 4
router.post('/', async (req, res) => {

    try {

        let result;

        if (!Array.isArray(req.body)) {
            if (req.body.first_name === undefined) {
                return res.status(400).send({ error: "First name not defined" });
            }

            const insertFields = {};

            insertFields.first_name = req.body.first_name;
            insertFields.last_name = req.body.last_name;
            insertFields.year_of_birth = req.body.year_of_birth;
            insertFields.job = req.body.job;
            insertFields.reviews = req.body.reviews;

            result = await db.collection('users').insertOne(insertFields);
        } else {
            if (Object.keys(req.body).length == 0) {
                return res.status(400).send({ error: "Request body array is empty" });
            }
            if (req.body.some(item => item.first_name === undefined)) {
                return res.status(400).send({ error: "One or more users don't have a first name" });
            }

            const insertFields = req.body.map(user => ({
                first_name: user.first_name,
                last_name: user.last_name,
                year_of_birth: user.year_of_birth,
                job: user.job,
                reviews: user.reviews
            }));
            result = await db.collection('users').insertMany(insertFields);
        }
        
        if (result.insertedCount == 0) {
            return res.status(404).send({ error: "User(s) not inserted" });
        }

        res.send(result).status(200);

    } catch (error) {
        res.send(error).status(500);
    }

});

//  Alínea 6
router.get("/:id", async (req, res) => {

    try {

        const id = typeId(req.params.id);

        let result = await db.collection('users')
            .aggregate([
                { $match: { _id: id } },
                { $addFields: { reviews: { $ifNull: ["$reviews", []] } } },
                { $unwind: { path: "$reviews", preserveNullAndEmptyArrays: true } },
                { $sort: { "reviews.score": -1 } },
                { $limit: 3 },
                { $group: {
                    _id: "$_id",
                    first_name: { $first: "$first_name" },
                    last_name: { $first: "$last_name" },
                    year_of_birth: { $first: "$year_of_birth" },
                    job: { $first: "$job" },
                    reviews: { $push: "$reviews" }
                }}
            ])
            .toArray();

        if (result.length == 0) {
            return res.status(404).send({ error: "User not found" });
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error);
    }
    
});

//  Alínea 8
router.delete('/:id', async (req, res) => {

    try {

        const id = typeId(req.params.id);
        const result = await db.collection('users').deleteOne({ _id: id });

        if (result.deletedCount == 0) {
            return res.status(404).send({ error: "User not found" });
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error);
    }

});

//  Alínea 10
router.put('/:id', async (req, res) => {

    try {

        const id = typeId(req.params.id);

        const updateFields = {};

        if (req.body.first_name) updateFields.first_name = req.body.first_name;
        if (req.body.last_name) updateFields.last_name = req.body.last_name;
        if (req.body.year_of_birth) updateFields.year_of_birth = req.body.year_of_birth;
        if (req.body.job) updateFields.job = req.body.job;
        if (req.body.reviews) updateFields.reviews = req.body.reviews;

        const result = await db.collection('users')
            .updateOne(
                { _id: id },
                { $set: updateFields }
            );

        if (result.modifiedCount == 0) {
            return res.status(400).send({ error: "User not found or not updated" });
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(error);
    }

});

export default router;