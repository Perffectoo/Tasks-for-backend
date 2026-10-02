import * as BooksService from "./Books.service.js";


// 1
export const createBooksCollection = async (req, res) => {

    const result = await BooksService.createBooksCollection();

    return res.status(201).json({
        message: "Books collection created successfully",
        result
    });
};


// 2
export const createAuthorsCollection = async (req, res) => {

    const result = await BooksService.createAuthorsCollection(req.body);

    return res.status(201).json({
        message: "Author inserted successfully",
        result
    });
};


// 3
export const createLogsCollection = async (req, res) => {

    const result = await BooksService.createLogsCollection();

    return res.status(201).json({
        message: "Logs collection created successfully",
        result
    });
};


// 4
export const createBooksIndex = async (req, res) => {

    const result = await BooksService.createBooksIndex();

    return res.status(201).json({
        message: "Books index created successfully",
        result
    });
};


// 5
export const createBook = async (req, res) => {

    const result = await BooksService.createBook(req.body);

    return res.status(201).json({
        message: "Book created successfully",
        result
    });
};


// 6
export const createBooks = async (req, res) => {

    const result = await BooksService.createBooks(req.body);

    return res.status(201).json({
        message: "Books created successfully",
        result
    });
};


// 7
export const createLog = async (req, res) => {

    const result = await BooksService.createLog(req.body);

    return res.status(201).json({
        message: "Log created successfully",
        result
    });
};


// 8
export const updateFutureBook = async (req, res) => {

    const result = await BooksService.updateFutureBook();

    return res.json({
        message: "Future book updated successfully",
        result
    });
};


// 9
export const getBookByTitle = async (req, res) => {

    const { title } = req.query;

    const result = await BooksService.getBookByTitle(title);

    return res.json(result);
};


// 10
export const getBooksByYear = async (req, res) => {

    const { from, to } = req.query;

    const result = await BooksService.getBooksByYear(from, to);

    return res.json(result);
};


// 11
export const getBooksByGenre = async (req, res) => {

    const { genre } = req.query;

    const result = await BooksService.getBooksByGenre(genre);

    return res.json(result);
};


// 12
export const getBooksSkipLimit = async (req, res) => {

    const result = await BooksService.getBooksSkipLimit();

    return res.json(result);
};


// 13
export const getBooksYearInteger = async (req, res) => {

    const result = await BooksService.getBooksYearInteger();

    return res.json(result);
};


// 14
export const getBooksExcludeGenres = async (req, res) => {

    const result = await BooksService.getBooksExcludeGenres();

    return res.json(result);
};


// 15
export const deleteBooksBeforeYear = async (req, res) => {

    const { year } = req.query;

    const result = await BooksService.deleteBooksBeforeYear(year);

    return res.json({
        message: "Books deleted successfully",
        result
    });
};


// 16
export const aggregate1 = async (req, res) => {

    const result = await BooksService.aggregate1();

    return res.json(result);
};


// 17
export const aggregate2 = async (req, res) => {

    const result = await BooksService.aggregate2();

    return res.json(result);
};


// 18
export const aggregate3 = async (req, res) => {

    const result = await BooksService.aggregate3();

    return res.json(result);
};


// 19
export const aggregate4 = async (req, res) => {

    const result = await BooksService.aggregate4();

    return res.json(result);
};