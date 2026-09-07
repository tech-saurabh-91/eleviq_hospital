const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDatabase = require("../../config/database");
const Permission = require("./permission.model");

dotenv.config();

const permissions = [
    // User management
    {
        name: "user.create",
        description: "Create users",
    },
    {
        name: "user.read",
        description: "View users",
    },
    {
        name: "user.update",
        description: "Update users",
    },

    // Role management
    {
        name: "role.create",
        description: "Create roles",
    },
    {
        name: "role.read",
        description: "View roles",
    },
    {
        name: "role.update",
        description: "Update roles",
    },

    // Permission management
    {
        name: "permission.read",
        description: "View permissions",
    },
    {
        name: "permission.update",
        description: "Update permission access",
    },

    // Terms & Conditions
    {
        name: "terms.create",
        description: "Create Terms & Conditions",
    },
    {
        name: "terms.read",
        description: "View Terms & Conditions",
    },
    {
        name: "terms.update",
        description: "Update Terms & Conditions",
    },

    // Company
    {
        name: "company.create",
        description: "Create companies",
    },
    {
        name: "company.read",
        description: "View companies",
    },
    {
        name: "company.update",
        description: "Update companies",
    },

    // Branch
    {
        name: "branch.create",
        description: "Create branches",
    },
    {
        name: "branch.read",
        description: "View branches",
    },
    {
        name: "branch.update",
        description: "Update branches",
    },

    // Department
    {
        name: "department.create",
        description: "Create departments",
    },
    {
        name: "department.read",
        description: "View departments",
    },
    {
        name: "department.update",
        description: "Update departments",
    },

    // Designation
    {
        name: "designation.create",
        description: "Create designations",
    },
    {
        name: "designation.read",
        description: "View designations",
    },
    {
        name: "designation.update",
        description: "Update designations",
    },

    // Patient
    {
        name: "patient.create",
        description: "Create patients",
    },
    {
        name: "patient.read",
        description: "View patients",
    },
    {
        name: "patient.update",
        description: "Update patients",
    },
    {
        name: "patient.self.read",
        description: "View own patient information",
    },
    {
        name: "patient.self.update",
        description: "Update own patient information",
    },
    {
        name: "patient.self.profile.update",
        description: "Update own patient profile picture",
    },

    // Appointment
    {
        name: "appointment.create",
        description: "Create appointments",
    },
    {
        name: "appointment.read",
        description: "View appointments",
    },
    {
        name: "appointment.update",
        description: "Update appointments",
    },
    {
        name: "appointment.self.read",
        description: "View own appointments",
    },
    {
        name: "appointment.self.create",
        description: "Create own appointments",
    },
    {
        name: "appointment.self.update",
        description: "Update own appointments",
    },

    // Clinical
    {
        name: "clinical.create",
        description: "Create clinical records",
    },
    {
        name: "clinical.read",
        description: "View clinical records",
    },
    {
        name: "clinical.update",
        description: "Update clinical records",
    },

    // Prescription
    {
        name: "prescription.create",
        description: "Create prescriptions",
    },
    {
        name: "prescription.read",
        description: "View prescriptions",
    },
    {
        name: "prescription.update",
        description: "Update prescriptions",
    },
    {
        name: "prescription.self.read",
        description: "View own prescriptions",
    },

    // Nursing
    {
        name: "nursing.create",
        description: "Create nursing records",
    },
    {
        name: "nursing.read",
        description: "View nursing records",
    },
    {
        name: "nursing.update",
        description: "Update nursing records",
    },

    // Pharmacy
    {
        name: "pharmacy.create",
        description: "Create pharmacy records",
    },
    {
        name: "pharmacy.read",
        description: "View pharmacy records",
    },
    {
        name: "pharmacy.update",
        description: "Update pharmacy records",
    },

    // Inventory
    {
        name: "inventory.create",
        description: "Create inventory records",
    },
    {
        name: "inventory.read",
        description: "View inventory",
    },
    {
        name: "inventory.update",
        description: "Update inventory",
    },

    // Procurement
    {
        name: "procurement.create",
        description: "Create procurement records",
    },
    {
        name: "procurement.read",
        description: "View procurement records",
    },
    {
        name: "procurement.update",
        description: "Update procurement records",
    },

    // Finance
    {
        name: "finance.create",
        description: "Create financial records",
    },
    {
        name: "finance.read",
        description: "View financial records",
    },
    {
        name: "finance.update",
        description: "Update financial records",
    },

    // Billing
    {
        name: "billing.create",
        description: "Create billing records",
    },
    {
        name: "billing.read",
        description: "View billing records",
    },

    // Laboratory
    {
        name: "lab.create",
        description: "Create laboratory records",
    },
    {
        name: "lab.read",
        description: "View laboratory records",
    },
    {
        name: "lab.update",
        description: "Update laboratory records",
    },

    // HR
    {
        name: "hr.create",
        description: "Create HR records",
    },
    {
        name: "hr.read",
        description: "View HR records",
    },
    {
        name: "hr.update",
        description: "Update HR records",
    },
];

const seedPermissions = async () => {
    try {
        await connectDatabase();

        for (const permission of permissions) {
            await Permission.updateOne(
                { name: permission.name },
                { $set: permission },
                { upsert: true }
            );
        }

        console.log("Permissions seeded successfully");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Permission seeding failed:", error.message);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedPermissions();