const express = require('express')
const router = express.Router()
const middleware = require("../auth/middleware")
const Book = require('../models/bookModel')

router.get("/books", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const sortField = req.query.sort || "release_year";
        const sortOrder = req.query.order || "asc";

        let query = {}

        if (search) {
            query = {
                $or: [
                    { book_name: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                    { release_year: { $regex: search, $options: "i" } }
                ]
            };
        }

        const sortBy = {};
        sortBy[sortField] = sortOrder;
        console.log(sortBy);


        if(category){
            query.category = { $regex: categoryFilter, $options: "i" };
        }

        const books = await Book.find(query)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Book.countDocuments({
            $or: [
                { book_name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { release_year: { $regex: search, $options: "i" } }
            ]
        });

        const response = {
            error: false,
            total,
            page,
            limit,
            books,
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});






router.post('/create', middleware, async (req, res) => {
    try {
        const newBook = await Book.create({ ...req.body, creator: req.userId });

        res.status(200).json({ message: 'New Book created', book: newBook });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating book' });
    }
});

router.post('/create', middleware, async (req, res) => {
    try {
        const newBook = await Book.create({ ...req.body, creator: req.userId })

        res.status(200).json({ message: "New Book created", Book: newBook });

    } catch (error) {
        res.status(500).json({ message: "Book not created" });
    }
})

module.exports = router