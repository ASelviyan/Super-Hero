
const db = require('./models')

const hi = async() => {
    await db.comment.create({
        name: 'ASelviyan',
        comment: 'hi',
        rating: 1,
        userId: 1,
        teamId: 1
    })
}


hi()