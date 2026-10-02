import { Router } from "express";
import * as BooksService from "./Books.service.js";

const router = Router();

// 1. Create single book
router.post("/", BooksService.createBook);

// 4. Update title of all books
router.patch("/all", BooksService.updateAllBooksTitles);

// 7. Pagination + sort
router.get("/paginate-sort", BooksService.getBooksPaginated);

// 9. Get book by content
router.get("/book-by-content", BooksService.getBookByContent);

// 10. Get books with user using populate
router.get("/book-with-user", BooksService.getBooksWithUser);

// 11. Aggregation
router.get("/aggregate", BooksService.aggregateBooks);

// 3. Replace entire book
router.put("/replace/:bookId", BooksService.replaceBook);

// 2. Update single book
router.patch("/:bookId", BooksService.updateBook);

// 6. Delete single book
router.delete("/:bookId", BooksService.deleteBook);

// 8. Get book by ID
router.get("/:id", BooksService.getBookById);

// 12. Delete all books
router.delete("/", BooksService.deleteAllBooks);

export default router;