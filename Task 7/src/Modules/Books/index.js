import { Router } from "express";

import * as BooksController from "./Books.controller.js";

const router = Router();


// 1
router.post("/collection/books", BooksController.createBooksCollection);

// 2
router.post("/collection/authors", BooksController.createAuthorsCollection);

// 3
router.post("/collection/logs/capped", BooksController.createLogsCollection);

// 4
router.post("/collection/books/index", BooksController.createBooksIndex);

// 5
router.post("/", BooksController.createBook);

// 6
router.post("/batch", BooksController.createBooks);

// 7
router.post("/logs", BooksController.createLog);

// 8
router.patch("/Future", BooksController.updateFutureBook);

// 9
router.get("/title", BooksController.getBookByTitle);

// 10
router.get("/year", BooksController.getBooksByYear);

// 11
router.get("/genre", BooksController.getBooksByGenre);

// 12
router.get("/skip-limit", BooksController.getBooksSkipLimit);

// 13
router.get("/year-integer", BooksController.getBooksYearInteger);

// 14
router.get("/exclude-genres", BooksController.getBooksExcludeGenres);

// 15
router.delete("/before-year", BooksController.deleteBooksBeforeYear);

// 16
router.get("/aggregate1", BooksController.aggregate1);

// 17
router.get("/aggregate2", BooksController.aggregate2);

// 18
router.get("/aggregate3", BooksController.aggregate3);

// 19
router.get("/aggregate4", BooksController.aggregate4);

export default router;