const fs = require("fs");
const helpers = require("../helpers");

const DATA_PATH = "articles.json";

function create(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const newComment = JSON.parse(body);
    if (
      !newComment ||
      typeof newComment.articleId !== "string" ||
      typeof newComment.text !== "string" ||
      typeof newComment.date !== "number" ||
      typeof newComment.author !== "string" ||
      isNaN(new Date(newComment.date))
    ) {
      helpers.send400();
      return;
    }

    fs.readFile(DATA_PATH, (error, buffer) => {
      if (error) {
        helpers.send500();
        return;
      }
      const data = JSON.parse(buffer);

      const article = data.articles.find(
        ({ id }) => id === newComment.articleId
      );
      if (!article) {
        helpers.send400();
        return;
      }

      const id = (Number(data.comments?.at(-1)?.id) + 1).toString();
      newComment.id = id;
      data.comments.push(newComment);
      article.comments.push(newComment.id);

      fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
      res.write(JSON.stringify(newComment));
      res.end();
    });
  });
}

function deleteComment(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const dataObj = JSON.parse(body);
    if (
      !dataObj ||
      (typeof dataObj.id !== "number" && typeof dataObj.id !== "string")
    ) {
      helpers.send400();
      return;
    }

    fs.readFile(DATA_PATH, (error, buffer) => {
      if (error) {
        helpers.send500();
        return;
      }

      const data = JSON.parse(buffer);
      const index = data.comments.findIndex(
        (item) => item.id === dataObj.id.toString()
      );
      const oldComment = data.comments[index];

      if (!oldComment) {
        helpers.send400();
        return;
      }
      const article = data.articles.find(
        ({ id }) => id === oldComment.articleId
      );

      data.comments.splice(index, 1);
      article.comments = article.comments.filter(
        (commentId) => commentId !== oldComment.id
      );

      fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
      res.write(JSON.stringify(`Comment id=${dataObj.id} deleted`));
      res.end();
    });
  });
}

module.exports = {
  create,
  deleteComment,
};
