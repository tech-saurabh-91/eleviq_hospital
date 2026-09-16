const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDatabase = require("../../config/database");
const Role = require("./role.model");
const Permission = require("../permissions/permission.model");

dotenv.config();

const rolePermissions = {
  "super-admin": ["*"],

  "hospital-admin": [
    "company.create",
    "company.read",
    "company.update",

    "branch.create",
    "branch.read",
    "branch.update",

    "department.create",
    "department.read",
    "department.update",

    "designation.create",
    "designation.read",
    "designation.update",

    "user.create",
    "user.read",
    "user.update",

    "user.create",
    "user.read",
    "user.update",

    "role.create",
    "role.read",
    "role.update",

    "permission.read",
    "permission.update",

    "terms.create",
    "terms.read",
    "terms.update",

    "patient.create",
    "patient.read",
    "patient.update",

    "appointment.create",
    "appointment.read",
    "appointment.update",

    "appointment.verify",
    "appointment.confirm",

    "appointment.settings.read",
    "appointment.settings.update",

    "clinical.create",
    "clinical.read",
    "clinical.update",

    "prescription.create",
    "prescription.read",
    "prescription.update",

    "nursing.create",
    "nursing.read",
    "nursing.update",

    "pharmacy.create",
    "pharmacy.read",
    "pharmacy.update",

    "inventory.create",
    "inventory.read",
    "inventory.update",

    "procurement.create",
    "procurement.read",
    "procurement.update",

    "finance.create",
    "finance.read",
    "finance.update",

    "billing.create",
    "billing.read",

    "lab.create",
    "lab.read",
    "lab.update",

    "hr.create",
    "hr.read",
    "hr.update",
  ],

  receptionist: [
    "patient.create",
    "patient.read",
    "patient.update",

    "appointment.create",
    "appointment.read",
    "appointment.update",

    "appointment.verify",
    "appointment.confirm",

    "billing.read",
  ],

  doctor: [
    "patient.read",
    "patient.update",

    "appointment.read",
    "appointment.update",

    "clinical.create",
    "clinical.read",
    "clinical.update",

    "prescription.create",
    "prescription.read",
    "prescription.update",
  ],

  nurse: [
    "patient.read",
    "patient.update",

    "appointment.read",

    "clinical.read",
    "clinical.update",

    "nursing.create",
    "nursing.read",
    "nursing.update",
  ],

  pharmacist: [
    "patient.read",

    "prescription.read",
    "prescription.update",

    "pharmacy.create",
    "pharmacy.read",
    "pharmacy.update",
  ],

  "store-manager": ["inventory.create", "inventory.read", "inventory.update"],

  "purchase-officer": [
    "inventory.read",

    "procurement.create",
    "procurement.read",
    "procurement.update",
  ],

  accountant: [
    "finance.create",
    "finance.read",
    "finance.update",

    "billing.create",
    "billing.read",
  ],

  "lab-technician": [
    "patient.read",
    "clinical.read",

    "lab.create",
    "lab.read",
    "lab.update",
  ],

  hr: ["hr.create", "hr.read", "hr.update"],

  patient: [
    "patient.self.read",
    "patient.self.update",
    "patient.self.profile.update",

    "patient.family.create",
    "patient.family.read",
    "patient.family.update",
    "patient.family.delete",

    "appointment.self.read",
    "appointment.self.create",
    "appointment.self.update",

    "prescription.self.read",
  ],
};

const roles = [
  {
    name: "super-admin",
    description: "Full system administration access.",
  },
  {
    name: "hospital-admin",
    description: "Hospital-level administrative access.",
  },
  {
    name: "receptionist",
    description: "Reception and front-desk operations.",
  },
  {
    name: "doctor",
    description: "Doctor and clinical consultation operations.",
  },
  {
    name: "nurse",
    description: "Nursing and patient-care operations",
  },
  {
    name: "pharmacist",
    description: "Pharmacy and medication operations.",
  },
  {
    name: "store-manager",
    description: "Hospital store and inventory operations.",
  },
  {
    name: "purchase-officer",
    description: "Purchase and procurement operations.",
  },
  {
    name: "accountant",
    description: "Accounting and financial operations.",
  },
  {
    name: "lab-technician",
    description: "Laboratory and diagnostic operations.",
  },
  {
    name: "hr",
    description: "Human resource management operations.",
  },
  {
    name: "patient",
    description: "Patient access to the hospital system.",
  },
];

const seedRoles = async () => {
  try {
    await connectDatabase();

    const allPermissions = await Permission.find({});

    const permissionMap = new Map(
      allPermissions.map((permission) => [
        permission.name,
        permission._id,
      ]),
    );

    for (const role of roles) {
      let permissionIds = [];

      const permissionsForRole = rolePermissions[role.name];

      if (permissionsForRole.includes("*")) {
        permissionIds = allPermissions.map(
          (permission) => permission._id,
        );
      } else {
        permissionIds = permissionsForRole.map((permissionName) => {
          const permissionId = permissionMap.get(permissionName);

          if (!permissionId) {
            throw new Error(`Permission not found: ${permissionName}`);
          }

          return permissionId;
        });
      }

      await Role.updateOne(
        { name: role.name },
        {
          $set: {
            name: role.name,
            description: role.description,
            permissions: permissionIds,
          },
        },
        { upsert: true },
      );
    }
    console.log("Roles seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Role seeding failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedRoles();
