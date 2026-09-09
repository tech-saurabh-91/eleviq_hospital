const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const companyRoutes = require("./modules/companies/company.routes");
const patientRoutes = require("./modules/patients/patient.routes");
const branchRoutes = require("./modules/branches/branch.routes");
const departmentRoutes = require("./modules/departments/department.routes");
const designationRoutes = require("./modules/designations/designation.routes");
const authenticate = require("./middleware/auth");
const termsRoutes = require("./modules/terms/terms.routes");
const insuranceRoutes = require("./modules/insurance/insurance.routes");

const locationRoutes = require("./modules/locations/location.routes");

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:5173", "http://localhost:3000"];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-organization-id"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

app.get("/api/test/protected", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Protected route accessed successfully",
        data: {
            userId: req.user._id,
            username: req.user.username,
        },
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/terms", termsRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/locations", locationRoutes);

// ==========================================
// ADMIN DASHBOARD
// ==========================================

app.get("/api/dashboard/summary", (req, res) => {
    const dashboardData = {
        patients: 1250,
        appointments: 86,
        doctors: 42,
        nurses: 78,
        availableBeds: 34,
        occupiedBeds: 116,
        icuBeds: 8,
        ventilators: 5,
        emergencyPatients: 12,
    };
    res.json({ success: true, data: dashboardData });
});

// ==========================================
// PATIENTS
// ==========================================

app.get("/api/patients", (req, res) => {
    const patients = [
        { id: 1, name: "Rahul Sharma", age: 35, gender: "Male", bloodGroup: "B+", abhaId: "ABHA-XXXX-001" },
        { id: 2, name: "Priya Singh", age: 28, gender: "Female", bloodGroup: "O+", abhaId: "ABHA-XXXX-002" },
        { id: 3, name: "Amit Kumar", age: 52, gender: "Male", bloodGroup: "A+", abhaId: "ABHA-XXXX-003" },
    ];
    res.json({ success: true, count: patients.length, data: patients });
});

// ==========================================
// DOCTORS
// ==========================================

app.get("/api/doctors", (req, res) => {
    const doctors = [
        { id: 1, name: "Dr. Anjali Mehta", specialization: "Cardiology", availability: "Available" },
        { id: 2, name: "Dr. Rajesh Verma", specialization: "Neurology", availability: "Available" },
        { id: 3, name: "Dr. Neha Sharma", specialization: "General Medicine", availability: "On Leave" },
    ];
    res.json({ success: true, count: doctors.length, data: doctors });
});

// ==========================================
// APPOINTMENTS
// ==========================================

app.get("/api/appointments", (req, res) => {
    const appointments = [
        { id: 1, patient: "Rahul Sharma", doctor: "Dr. Anjali Mehta", department: "Cardiology", time: "10:00 AM", status: "Confirmed" },
        { id: 2, patient: "Priya Singh", doctor: "Dr. Rajesh Verma", department: "Neurology", time: "11:30 AM", status: "Waiting" },
        { id: 3, patient: "Amit Kumar", doctor: "Dr. Anjali Mehta", department: "Cardiology", time: "02:00 PM", status: "Confirmed" },
    ];
    res.json({ success: true, count: appointments.length, data: appointments });
});

// ==========================================
// BEDS
// ==========================================

app.get("/api/beds", (req, res) => {
    const beds = {
        totalBeds: 150,
        availableBeds: 34,
        occupiedBeds: 116,
        icu: { total: 20, available: 8, occupied: 12 },
        isolation: { total: 10, available: 4, occupied: 6 },
        ventilators: { total: 12, available: 5, inUse: 7 },
    };
    res.json({ success: true, data: beds });
});

module.exports = app;