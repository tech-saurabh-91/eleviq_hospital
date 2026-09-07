const bcrypt = require("bcryptjs");

const User = require("./user.model");
const Role = require("../roles/role.model");

const createUser = async ({
    username,
    mobile,
    password,
    role,
}) => {
    const existingUser = await User.findOne({
        $or: [
            { username },
            { mobile },
        ],
    });

    if (existingUser) {
        if (existingUser.username === username) {
            throw new Error("Username already exists");
        }

        if (existingUser.mobile === mobile) {
            throw new Error("Mobile number already exists");
        }
    }

    const roleDocument = await Role.findOne({
        name: role,
    });

    if (!roleDocument) {
        throw new Error("Role not found");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        username,
        mobile,
        passwordHash,
        roles: [roleDocument._id],
    });

    return {
        id: user._id,
        username: user.username,
        mobile: user.mobile,
        roles: user.roles,
    };
};

module.exports = {
    createUser,
};