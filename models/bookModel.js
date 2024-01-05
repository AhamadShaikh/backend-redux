const { default: mongoose } = require("mongoose");

const bookSchema = mongoose.Schema({
    no_of_chapters: { type: Number, required: true },
    author: { type: String, required: true },
    cover_photo: { type: String, required: true },
    book_name: { type: String, required: true },
    category: { type: String, required: true },
    release_year: { type: String, required: true },
    chapters: [
        {
            name: { type: String, required: true },
            pages: { type: Number, required: true }
        },
        {
            name: { type: String, required: true },
            pages: { type: Number, required: true }
        }
    ],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
})

const Book = mongoose.model("books", bookSchema)

module.exports = Book