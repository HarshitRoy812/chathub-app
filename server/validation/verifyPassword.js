const bcrypt = require('bcrypt');

const verifyPassword = async (inputPassword,userPassword) => {

    const isValidPassword = await bcrypt.compare(inputPassword,userPassword);

    return isValidPassword;
}



module.exports = verifyPassword;