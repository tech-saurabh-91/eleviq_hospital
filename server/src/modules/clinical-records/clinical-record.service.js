const mongoose = require("mongoose");

const ClinicalRecord = require("./clinical-record.model");
const Appointment = require("../appointments/appointment.model");
const FamilyMember = require("../patients/family/family-member.model");


const createClinicalRecord = async ({
    appointmentId,
    doctorId,
    data,
}) => {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        const error = new Error("Invalid appointment ID");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        const error = new Error("Invalid doctor ID");
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "CONFIRMED") {
        const error = new Error(
            "Clinical record can only be created for a confirmed appointment"
        );
        error.statusCode = 409;
        throw error;
    }

    if (String(appointment.doctor) !== String(doctorId)) {
        const error = new Error(
            "Only the assigned doctor can create the clinical record"
        );
        error.statusCode = 403;
        throw error;
    }

    const existingRecord = await ClinicalRecord.findOne({
        appointment: appointment._id,
    });

    if (existingRecord) {
        const error = new Error(
            "Clinical record already exists for this appointment"
        );
        error.statusCode = 409;
        throw error;
    }

    if (appointment.familyMember) {
        const familyMember = await FamilyMember.findOne({
            _id: appointment.familyMember,
            patient: appointment.patient,
            status: "active",
        });

        if (!familyMember) {
            const error = new Error(
                "Family member is not valid for this appointment"
            );
            error.statusCode = 409;
            throw error;
        }
    }

    const record = await ClinicalRecord.create({
        appointment: appointment._id,
        patient: appointment.patient,
        familyMember: appointment.familyMember || null,
        doctor: appointment.doctor,

        consultationDate: appointment.appointmentDate,

        presentingComplaints: data.presentingComplaints || "",
        historyOfPresentIllness: data.historyOfPresentIllness || "",
        reviewOfSystems: data.reviewOfSystems || "",
        assessment: data.assessment || "",
        plan: data.plan || "",

        medicines: data.medicines || [],
        investigations: data.investigations || [],

        followUp: data.followUp || undefined,

        otherNotes: data.otherNotes || "",

        status: "FINALIZED",
        finalizedBy: doctorId,
        finalizedAt: new Date(),
    });

    return buildClinicalRecordResponse(record);
};


const getClinicalRecordForPatient = async ({
    recordId,
    patientId,
}) => {
    if (!mongoose.Types.ObjectId.isValid(recordId)) {
        const error = new Error("Invalid clinical record ID");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        const error = new Error("Invalid patient ID");
        error.statusCode = 400;
        throw error;
    }

    const record = await ClinicalRecord.findOne({
        _id: recordId,
        patient: patientId,
        status: "FINALIZED",
    })
        .populate("doctor", "username mobile")
        .populate("finalizedBy", "username")
        .populate(
            "familyMember",
            "firstName middleName lastName relationship dateOfBirth gender"
        );

    if (!record) {
        const error = new Error("Clinical record not found");
        error.statusCode = 404;
        throw error;
    }

    return buildClinicalRecordResponse(record);
};


const getPatientClinicalHistory = async ({
    patientId,
    familyMemberId = null,
}) => {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        const error = new Error("Invalid patient ID");
        error.statusCode = 400;
        throw error;
    }

    const filter = {
        patient: patientId,
        status: "FINALIZED",
        familyMember: familyMemberId || null,
    };

    if (familyMemberId) {
        if (!mongoose.Types.ObjectId.isValid(familyMemberId)) {
            const error = new Error("Invalid family member ID");
            error.statusCode = 400;
            throw error;
        }

        const familyMember = await FamilyMember.findOne({
            _id: familyMemberId,
            patient: patientId,
            status: "active",
        });

        if (!familyMember) {
            const error = new Error("Family member not found");
            error.statusCode = 404;
            throw error;
        }
    }

    const records = await ClinicalRecord.find(filter)
        .populate("doctor", "username mobile")
        .populate(
            "familyMember",
            "firstName middleName lastName relationship dateOfBirth gender"
        )
        .sort({
            consultationDate: -1,
            createdAt: -1,
        });

    return records.map(buildClinicalRecordResponse);
};


const getClinicalHistoryForDoctor = async ({
    appointmentId,
    doctorId,
}) => {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        const error = new Error("Invalid appointment ID");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        const error = new Error("Invalid doctor ID");
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "CONFIRMED") {
        const error = new Error(
            "Only confirmed appointments can access clinical history"
        );
        error.statusCode = 409;
        throw error;
    }

    if (String(appointment.doctor) !== String(doctorId)) {
        const error = new Error(
            "Only the assigned doctor can access this patient's clinical history"
        );
        error.statusCode = 403;
        throw error;
    }

    const filter = {
        patient: appointment.patient,
        status: "FINALIZED",
        familyMember: appointment.familyMember || null,
    };

    const records = await ClinicalRecord.find(filter)
        .populate("doctor", "username mobile")
        .populate(
            "familyMember",
            "firstName middleName lastName relationship dateOfBirth gender"
        )
        .sort({
            consultationDate: -1,
            createdAt: -1,
        });

    return records.map(buildClinicalRecordResponse);
};


const buildClinicalRecordResponse = (record) => {
    return {
        recordId: record._id,
        appointmentId: record.appointment,

        patientId: record.patient,

        familyMember: record.familyMember
            ? {
                  familyMemberId: record.familyMember._id,
                  firstName: record.familyMember.firstName,
                  middleName: record.familyMember.middleName,
                  lastName: record.familyMember.lastName,
                  relationship: record.familyMember.relationship,
              }
            : null,

        doctor: record.doctor
            ? {
                  doctorId: record.doctor._id,
                  username: record.doctor.username,
                  mobile: record.doctor.mobile,
              }
            : record.doctor,

        consultationDate: record.consultationDate,

        presentingComplaints: record.presentingComplaints,
        historyOfPresentIllness: record.historyOfPresentIllness,
        reviewOfSystems: record.reviewOfSystems,
        assessment: record.assessment,
        plan: record.plan,

        medicines: record.medicines,
        investigations: record.investigations,

        followUp: record.followUp,

        otherNotes: record.otherNotes,

        status: record.status,
        finalizedBy: record.finalizedBy,
        finalizedAt: record.finalizedAt,

        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
};


module.exports = {
    createClinicalRecord,
    getClinicalRecordForPatient,
    getPatientClinicalHistory,
    getClinicalHistoryForDoctor,
};