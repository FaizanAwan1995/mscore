const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello from Dummy Node App!');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});