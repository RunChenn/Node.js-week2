const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');
const Post = require('./models/posts');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// 連接資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((err) => {
    console.log(err);
  });

const reqListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/posts' && req.method === 'GET') {
    const post = await Post.find();
    handleSuccess(res, post);
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.content !== '') {
          let { name, content, image, createdAt } = data;
          const newPost = await Post.create({
            name,
            content,
            image,
            createdAt,
          });
          handleSuccess(res, newPost);
        } else {
          handleError(res, 400, '參數有誤');
        }
      } catch (error) {
        handleError(res, 400, '參數有誤');
      }
    });
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    const posts = await Post.deleteMany({});
    handleSuccess(res, posts);
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const posts = await Post.findByIdAndDelete(id);
    handleSuccess(res, posts);
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split('/').pop();
        if (data.content !== '') {
          let { content, image, likes } = data;
          const posts = await Post.findByIdAndUpdate(id, {
            $set: {
              content,
              image,
              likes,
            },
          });
          handleSuccess(res, posts);
        } else {
          handleError(res, 400, 'content必填');
        }
      } catch (err) {
        handleError(res, 400, '參數有誤');
      }
    });
  } else if (req.url === '/posts' && req.method === 'OPTIONS') {
    handleSuccess(res, 'OPTIONS');
  } else {
    handleError(res, 404, '無此網站路由');
  }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT);
