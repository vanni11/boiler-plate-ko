const mongoose = require('mongoose');

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

//위의 schema를 model로 감싸줌
const User = mongoose.model('User', userSchema)

//다른 파일에서도 쓸 수 있도록 export
module.exports = { User }