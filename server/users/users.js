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

module.exports = {
    addUser,
    getUser,
    deleteUser
}