const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 //비밀번호 길이
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백을 없애줌
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { //사용자 권한(관리자, 사용자 등)
        type: Number,
        default: 0
    },
    image: String, //이런 방식으로 type만 가능
    token :{ //토큰으로 유효성 관리
        type: String
    },
    tokenExp :{ //토큰 사용할 수 있는유효기간(Expiry)
        type: Number
    },
})

//#10 .pre('save', ) : save하기 전에 실행하라는 뜻 (mongoose의 메소드)
userSchema.pre('save', function( next ){
    var user = this //위의 userSchema를 가리킴

    //비밀번호가 변경됐을때만 암호화 처리 - 안하면 저장할때마다 처리됨
    if(user.isModified('password')){
        //비밀번호를 암호화시킨다
        /* 공홈(https://www.npmjs.com/package/bcrypt) technique 1 참고
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
                // Store hash in your password DB.
            });
        });
        */

        //salt를 이용해서 암호화함 
        bcrypt.genSalt(saltRounds,function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash //암호화된 비밀번호로 바꿔줌
                next();니
            })
        })
    } else {
        next(); //다른게 수정돼도 next로는 가야함
    }
})

//this를 바인딩 하므로 화살표함수 못씀
userSchema.methods.comparePassword  = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err); //같지않으면 콜백에 err전달
        cb(null, isMatch); //같으면 err부분은 null이고 isMatch는 true로 전달
    });
}

//#12 
userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    /* 설명 
    user._id + 'secretToken' = token (두개를 합쳐서 토큰이됨)
    토큰해석할때 'secretToken'을 넣으면 -> user._id가 나옴 
    */

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

//위의 schema를 model로 감싸줌
const User = mongoose.model('User', userSchema);

//다른 파일에서도 쓸 수 있도록 export
module.exports = { User };