const http = require('http');
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Dummy Node App</title>
        </head>
        <body>
          <main>
            <h1>Hello from Dummy Node App!</h1>
          </main>
        </body>
      </html>
    `);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});