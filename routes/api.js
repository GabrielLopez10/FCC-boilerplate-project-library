/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

module.exports = function (app, Books) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        const docs = await Books.find();
        const response = docs.map((v) => ({
          _id: v._id,
          title: v.title,
          commentcount: v.comments.length,
        }));
        res.json(response);
      } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred while fetching books.");
      }
    })


    .post(async function (req, res) {
      let title = req.body.title;

      if (!title) {
        return res.json("missing required field title");
      }

      try {
        const createdBook = await Books.create({ title: title });
        res.json({ title: createdBook.title, _id: createdBook._id });
      } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred while creating the book.");
      }
    })

    .delete(async function (req, res) {
      try {
        await Books.deleteMany();
        res.json("complete delete successful");
      } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred while deleting all books.");
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;

      if (!bookid) {
        return res.json("missing required field id");
      }

      try {
        const doc = await Books.findById(bookid);
        if (!doc) {
          return res.json("no book exists");
        }
        res.json(doc);
      } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred while fetching the book.");
      }
    })


    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!bookid) {
        return res.json("missing required field id");
      }
      if (!comment) {
        return res.json("missing required field comment");
      }

      try {
        const updatedBook = await Books.findByIdAndUpdate(
          bookid,
          {
            $push: {
              comments: comment,
            },
          },
          { new: true }
        ).exec();

        if (!updatedBook) {
          return res.json("no book exists");
        }

        res.json(updatedBook);
      } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred while updating the book.");
      }
    })


    .delete(async function (req, res) {
      let bookid = req.params.id;

      if (!bookid) {
        return res.json("no book exists");
      }

      try {
        const deletedBook = await Books.findByIdAndDelete(bookid);
        if (!deletedBook) {
          return res.json("no book exists");
        }
        res.json("delete successful");
      } catch (err) {
        console.error(err);
        res.status(500).json("An error occurred while deleting the book.");
      }
    });

};
