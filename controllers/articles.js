const fs = require("fs");

const DATA_PATH = "articles.json";


function readall(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  fs.readFile(DATA_PATH, (error, buffer) => {
    const data = JSON.parse(buffer);
    const articlesWithComments = data.articles?.map(({ comments, ...rest }) => {
      const fullComments = comments.map((commentId) =>
        data.comments.find((comment) => comment.id === commentId)
      );
      return { ...rest, comments: fullComments };
    });
    res.write(JSON.stringify(articlesWithComments));
    res.end();
  });
}
// function read(req, res) {
//   res.setHeader("Content-Type", "application/json; charset=utf-8");

//   let id = req.;
  
//   fs.readFile(DATA_PATH, (error, buffer) => {
//     if (error) {
//       res.statusCode = 500;
//       res.end(JSON.stringify({ error: "Failed to read data" }));
//       return;
//     }

//     const data = JSON.parse(buffer);
//    const article = data.articles.find(article => article.id === id);
//         if (!article) {
//       res.statusCode = 404;
//       res.end(JSON.stringify({ error: "Article not found" }));
//       return;
//     }

//     const fullComments = article.comments.map(commentId =>
//       data.comments.find(comment => comment.id === commentId)
//     );

//     const articleWithComments = { ...article, comments: fullComments };
//     res.write(JSON.stringify(articleWithComments));
//     res.end();
//   });
// }

module.exports = {
  readall,
  read
};
