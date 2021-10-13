const express = require('express') //#2 express_module을 가져온다
const app = express() //#2 express 앱 생성
const port = 5000 //#2 포트 설정
const mongoose = require('mongoose') //#3 mongoose 가져온다
const bodyParser = require('body-parser') //#7 package.json에 추가된 body-parser를 가져온다 -> (express에서 지원해줘서 필요없음)
const { User } = require("./models/User") //#7 User 모델을 가져온다
const config = require('./config/key') //#9 비밀정보
const { reset } = require('nodemon')

mongoose.connect(config.mongoURI, {})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//#7 강의에선 express부분이 bodyParser였음
//application/x-www-form-urlencoded 형식을 분석해서 가져올수있게
app.use(express.urlencoded({extended: true}))
//application/json 형식을 분석해서 가져올수있게
app.use(express.json())

//#2 루트 디렉토리에 오면 문구 출력되도록 -> get method 사용한 route임
app.get('/', (req, res) => { res.send('Hello World! Hello World!') })

//#7 post method 사용한 route임
//endpoint : /register
app.post('/register', (req, res) => {
  //회원가입할때 필요한 정보들을 client에서 가져오면, 그것들을 DB에 넣어준다
  //express에서 parsing을 해줘서 바로 가져올수있는것임
  const user = new User(req.body)

  //여기서 User.js에서의 bcrypt암호화가 됨

  //user모델에 저장해줌 - save는 monogDB의 함수임
  user.save((err, userInfo) => {
    if(err) return res.json({ succcess: false, err}) //실패, error -> json형식으로 전달
    return res.status(200).json({ success: true})    //성공(status(200)은 성공했다는 표시) -> json형식으로 전달
  })
})

//#11
app.post('/login', (req, res) => {
  //1. 요청된 email이 DB에 있는지 확인
  User.findOne/* mongoDB의 메소드 */({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  })

  //2. 비밀번호가 일치하는지 확인 -> User.js에서 생성
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

    //3. token 생성
    
  })




})




//#2 5000번 listen하면 => 다음을 실행하라
app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })