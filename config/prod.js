//production 개발환경에서 비밀정보 가져가는곳
module.exports = {
    //heroku에서 설정한 값
    mongoURI: process.env.MONGO_URI
}