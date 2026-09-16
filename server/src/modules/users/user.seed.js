const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const connectDatabase = require("../../config/database");
const User = require("./user.model");
const Role = require("../roles/role.model");

dotenv.config();

const users = [
    {
        username: "superadmin",
        mobile: "9999999991",
        password: process.env.SEED_SUPERADMIN_PASSWORD,
        role: "super-admin",
    },
    {
        username: "hospitaladmin",
        mobile: "9999999992",
        password: process.env.SEED_HOSPITAL_ADMIN_PASSWORD,
        role: "hospital-admin",
    },
    {
        username: "doctor001",
        mobile: "9999999993",
        password: process.env.SEED_DOCTOR_PASSWORD,
        role: "doctor",
    },
    {
        username: "nurse001",
        mobile: "9999999994",
        password: process.env.SEED_NURSE_PASSWORD,
        role: "nurse",
    },
    {
        username: "reception001",
        mobile: "9999999995",
        password: process.env.SEED_RECEPTION_PASSWORD,
        role: "receptionist",
    },
];


const seedUsers = async () => {
    try {
        await connectDatabase();

        for (const userData of users) {
            const role = await Role.findOne({
                name: userData.role,
            });

            if (!role) {
                throw new Error(
                    `Role not found: ${userData.role}`
                );
            }

            const passwordHash = await bcrypt.hash(
                userData.password,
                12
            );

            await User.updateOne(
                {
                    username: userData.username,
                },
                {
                    $set: {
                        username: userData.username,
                        mobile: userData.mobile,
                        passwordHash,
                        roles: [role._id],
                        status: "active",
                    },
                },
                {
                    upsert: true,
                }
            );
        }

        console.log("Users seeded successfully");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(
            "User seeding failed:",
            error.message
        );

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedUsers();