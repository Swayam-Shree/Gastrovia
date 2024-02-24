import express from 'express';

const app = express();
const port = 6969;

app.use(express.static('dist'));

app.listen(port, () => {
  	console.log(`server starting on ${port}`);
});