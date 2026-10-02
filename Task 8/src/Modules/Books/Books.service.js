import mongoose from "mongoose";
import BooksModel from "./../../DB/Models/Books.js";


// 1. Create a Single Book

export const createBook = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, content } = req.body;

    const book = await BooksModel.create({
      title,
      content,
      userId: id,
    });

    return res.status(201).json({
      message: "Book created successfully",
      book,
    });

  } catch (error) {
    console.error("Error creating book:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 2. Update a Single Book

export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { id } = req.query;
    const { title, content } = req.body;

    const book = await BooksModel.findOneAndUpdate(
      {
        _id: bookId,
        userId: id,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found or you are not the owner",
      });
    }

    return res.status(200).json({
      message: "Book updated successfully",
      book,
    });

  } catch (error) {
    console.error("Error updating book:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 3. Replace Entire Book

export const replaceBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { id } = req.query;
    const { title, content } = req.body;

    const book = await BooksModel.findOneAndReplace(
      {
        _id: bookId,
        userId: id,
      },
      {
        title,
        content,
        userId: id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found or you are not the owner",
      });
    }

    return res.status(200).json({
      message: "Book replaced successfully",
      book,
    });

  } catch (error) {
    console.error("Error replacing book:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 4. Update Title of All Books for Logged-in User

export const updateAllBooksTitles = async (req, res) => {
  try {
    const { id } = req.query;
    const { title } = req.body;

    const result = await BooksModel.updateMany(
      {
        userId: id,
      },
      {
        title,
      },
      {
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "All books titles updated successfully",
      result,
    });

  } catch (error) {
    console.error("Error updating books titles:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 6. Delete a Single Book

export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { id } = req.query;

    const book = await BooksModel.findOneAndDelete({
      _id: bookId,
      userId: id,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found or you are not the owner",
      });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
      book,
    });

  } catch (error) {
    console.error("Error deleting book:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 7. Get Paginated Books + Sort by createdAt DESC


export const getBooksPaginated = async (req, res) => {
  try {
    const { id, page = 1, limit = 3 } = req.query;

    const books = await BooksModel.find({
      userId: id,
    })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      books,
    });

  } catch (error) {
    console.error("Error getting paginated books:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 8. Get a Book By ID

export const getBookById = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { id: userId } = req.query;

    const book = await BooksModel.findOne({
      _id: bookId,
      userId: userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found or you are not the owner",
      });
    }

    return res.status(200).json({
      book,
    });

  } catch (error) {
    console.error("Error getting book:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 9. Get Book By Content

export const getBookByContent = async (req, res) => {
  try {
    const { id, content } = req.query;

    const book = await BooksModel.findOne({
      userId: id,
      content,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      book,
    });

  } catch (error) {
    console.error("Error getting book by content:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 10. Get All Books With User Information
// Select: title, userId, createdAt
// User: email

export const getBooksWithUser = async (req, res) => {
  try {
    const { id } = req.query;

    const books = await BooksModel.find({
      userId: id,
    })
      .select("title userId createdAt")
      .populate("userId", "email");

    return res.status(200).json({
      books,
    });

  } catch (error) {
    console.error("Error getting books with user:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 11. Aggregation


export const aggregateBooks = async (req, res) => {
  try {
    const { id, title } = req.query;

    const match = {
      userId: new mongoose.Types.ObjectId(id),
    };

    if (title) {
      match.title = title;
    }

    const books = await BooksModel.aggregate([
      {
        $match: match,
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          title: 1,
          content: 1,
          createdAt: 1,
          "user.Name": 1,
          "user.email": 1,
        },
      },
    ]);

    return res.status(200).json({
      books,
    });

  } catch (error) {
    console.error("Error aggregating books:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// 12. Delete All Books for Logged-in User

export const deleteAllBooks = async (req, res) => {
  try {
    const { id } = req.query;

    const result = await BooksModel.deleteMany({
      userId: id,
    });

    return res.status(200).json({
      message: "All books deleted successfully",
      result,
    });

  } catch (error) {
    console.error("Error deleting all books:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};