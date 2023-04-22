var users = [];

const addUser = (socketID,userDetails) => {
    users[socketID] = userDetails;
}
const getUser = (socketID) => {
    return users[socketID];
}
const deleteUser = (socketID) => {
    delete users[socketID];
}

const getUserCount = (room) => {

    let userCount = 0;

    Object.keys(users).forEach((ele) => {
        if (users[ele][1] == room)
        {
            userCount++;
        }
    })

    return userCount;
}


module.exports = {
    addUser,
    getUser,
    deleteUser,
    getUserCount
}