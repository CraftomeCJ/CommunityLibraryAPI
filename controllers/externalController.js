const axios = require("axios");

async function searchOpenLibrary(req, res) {
  const { title, author, isbn } = req.query;
  if (!title && !author && !isbn) {
    return res.status(400).json({ message: "Provide title, author, or isbn" });
  }
  const q = [
    title ? `title:${title}` : "",
    author ? `author:${author}` : "",
    isbn ? `isbn:${isbn}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`;
    const { data } = await axios.get(url);
    res.json(data.docs || []);
  } catch (err) {
    res.status(500).json({ error: "External API error" });
  }
}

module.exports = { searchOpenLibrary };
