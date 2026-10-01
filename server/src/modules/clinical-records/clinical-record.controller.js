const {
    createClinicalRecord,
    getClinicalRecordForPatient,
    getPatientClinicalHistory,
    getClinicalHistoryForDoctor,
} = require("./clinical-record.service");
const {
    buildClinicalRecordPdf,
} = require("./clinical-record.pdf.service");


const createClinicalRecordController = async (req, res, next) => {
    try {
        const doctorId = req.user.userId || req.user.id || req.user._id;

        const record = await createClinicalRecord({
            appointmentId: req.body.appointmentId,
            doctorId,
            data: req.body,
        });

        return res.status(201).json({
            success: true,
            message: "Clinical record created successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};


const getClinicalRecordController = async (req, res, next) => {
    try {
        const patientId = req.user._id;

        const record = await getClinicalRecordForPatient({
            recordId: req.params.recordId,
            patientId,
        });

        return res.status(200).json({
            success: true,
            message: "Clinical record fetched successfully",
            data: record,
        });
    } catch (error) {
        next(error);
    }
};


const getMyClinicalHistoryController = async (req, res, next) => {
    try {
        const patientId = req.user._id;

        const records = await getPatientClinicalHistory({
            patientId,
            familyMemberId: req.query.familyMemberId || null,
        });

        return res.status(200).json({
            success: true,
            message: "Clinical history fetched successfully",
            data: records,
        });
    } catch (error) {
        next(error);
    }
};


const getDoctorClinicalHistoryController = async (req, res, next) => {
    try {
        const doctorId = req.user.userId || req.user.id || req.user._id;

        const records = await getClinicalHistoryForDoctor({
            appointmentId: req.params.appointmentId,
            doctorId,
        });

        return res.status(200).json({
            success: true,
            message: "Patient clinical history fetched successfully",
            data: records,
        });
    } catch (error) {
        next(error);
    }
};

const downloadClinicalRecordPdfController = async (req, res, next) => {
    try {
        const patientId = req.user._id;

        const pdfBuffer = await buildClinicalRecordPdf({
            recordId: req.params.recordId,
            patientId,
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="clinical-record-${req.params.recordId}.pdf"`,
            "Content-Length": pdfBuffer.length,
        });

        return res.status(200).send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createClinicalRecordController,
    getClinicalRecordController,
    getMyClinicalHistoryController,
    getDoctorClinicalHistoryController,
    downloadClinicalRecordPdfController,
};