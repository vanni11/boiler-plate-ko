const express = require('express') //2 express_module을 가져온다
const app = express() //2 express 앱 생성
const port = 5000 //2 포트 설정

const mongoose = require('mongoose') //3 mongoose 가져온다
mongoose.connect('mongodb+srv://yuntaehun:123qwe@boilerplate.cop5u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//2 루트 디렉토리에 오면 문구 출력되도록
app.get('/', (req, res) => {
  res.send('Hello World! Hello World!')
})

//2 5000번 listen하면 => 다음을 실행하라
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

