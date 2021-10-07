//#9 process.env.NODE_ENV : 개발환경에 따라 달라지는 환경변수임
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod')
} else {
    module.exports = require('./dev')
}