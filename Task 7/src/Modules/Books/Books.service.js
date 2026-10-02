import { db } from "../../DB/connections.js";
import BooksModel from "../../DB/Models/Books.js";


// 1. Create explicit books collection with validation
export const createBooksCollection = async () => {

    const result = await db.createCollection("books", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["title"],
                properties: {
                    title: {
                        bsonType: "string",
                        minLength: 1
                    }
                }
            }
        }
    });

    return result;
};


// 2. Create implicit authors collection
export const createAuthorsCollection = async (data) => {

    const AuthorsModel = db.collection("authors");

    const result = await AuthorsModel.insertOne(data);

    return result;
};


// 3. Create capped logs collection
export const createLogsCollection = async () => {

    const result = await db.createCollection("logs", {
        capped: true,
        size: 1024 * 1024
    });

    return result;
};


// 4. Create index on books.title
export const createBooksIndex = async () => {

    const result = await BooksModel.createIndex({
        title: 1
    });

    return result;
};


// 5. Insert one book
export const createBook = async (data) => {

    const result = await BooksModel.insertOne(data);

    return result;
};


// 6. Insert multiple books
export const createBooks = async (data) => {

    const result = await BooksModel.insertMany(data);

    return result;
};


// 7. Insert a new log
export const createLog = async (data) => {

    const LogsModel = db.collection("logs");

    const result = await LogsModel.insertOne(data);

    return result;
};


// 8. Update Future year to 2022
export const updateFutureBook = async () => {

    const result = await BooksModel.updateOne(
        {
            title: "Future"
        },
        {
            $set: {
                year: 2022
            }
        }
    );

    return result;
};


// 9. Find book by title
export const getBookByTitle = async (title) => {

    const result = await BooksModel.findOne({
        title: title
    });

    return result;
};


// 10. Find books between two years
export const getBooksByYear = async (from, to) => {

    const result = await BooksModel
        .find({
            year: {
                $gte: Number(from), //1990
                $lte: Number(to) //2010 maslan 
            }
        })
        .toArray();

    return result;
};


// 11. Find books where genre includes the given genre
export const getBooksByGenre = async (genre) => {

    const result = await BooksModel
        .find({
            genres: genre // ["Science Fiction"] maslan
        })
        .toArray();

    return result;
};


// 12. Skip 2, limit 3, sort year descending
export const getBooksSkipLimit = async () => {

    const result = await BooksModel
        .find({})
        .sort({
            year: -1
        })
        .skip(2)
        .limit(3)
        .toArray();

    return result;
};


// 13. Find books where year is integer
export const getBooksYearInteger = async () => {

    const result = await BooksModel
        .find({
            year: {
                $type: "int"
            }
        })
        .toArray();

    return result;
};


// 14. Exclude Horror and Science Fiction
export const getBooksExcludeGenres = async () => {

    const result = await BooksModel
        .find({
            genres: {
                $nin: [
                    "Horror",
                    "Science Fiction"
                ]
            }
        })
        .toArray();

    return result;
};


// 15. Delete books before 2000
export const deleteBooksBeforeYear = async (year) => {

    const result = await BooksModel.deleteMany({
        year: {
            $lt: Number(year)
        }
    });

    return result;
};


// 16. Aggregate: books after 2000 and sort descending
export const aggregate1 = async () => {

    const result = await BooksModel
        .aggregate([
            {
                $match: {
                    year: {
                        $gt: 2000
                    }
                }
            },
            {
                $sort: {
                    year: -1
                }
            }
        ])
        .toArray();

    return result;
};


// 17. Aggregate: after 2000, only title author year
export const aggregate2 = async () => {

    const result = await BooksModel
        .aggregate([
            {
                $match: {
                    year: {
                        $gt: 2000
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    author: 1,
                    year: 1
                }
            }
        ])
        .toArray();

    return result;
};


// 18. Aggregate: separate genres
export const aggregate3 = async () => {

    const result = await BooksModel
        .aggregate([
            {
                $unwind: "$genres"
            }
        ])
        .toArray();

    return result;
};


// 19. Aggregate: join books with logs
export const aggregate4 = async () => {

    const result = await BooksModel
        .aggregate([
            {
                $lookup: {
                    from: "logs",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "logs"
                }
            }
        ])
        .toArray();

    return result;
};