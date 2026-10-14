const { describe, it } = require("node:test");
const assert = require("node:assert");

const {
    createFamilyMemberSchema,
    updateFamilyMemberSchema,
} = require("./family.validation");

const familyService = require("./family.service");
const Patient = require("../patient.model");
const FamilyMember = require("./family-member.model");

describe("Family Member Validation & Service Tests", () => {
    // ----------------------------------------------------
    // 1. Creation Validation Schema (Frontend Payload)
    // ----------------------------------------------------
    it("should validate create payload without email, phone, or address", () => {
        const payload = {
            firstName: "Aarav",
            middleName: "Kumar",
            lastName: "Sharma",
            relationship: "son",
            dateOfBirth: "15/08/2010",
            gender: "male",
            insuranceCoverage: "patient",
        };

        const result = createFamilyMemberSchema.safeParse(payload);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.data.firstName, "Aarav");
        assert.strictEqual(result.data.relationship, "son");
    });

    it("should accept Indian names with dots and accents", () => {
        const payload = {
            firstName: "Dr. A. P.",
            lastName: "Mukherjee",
            relationship: "father",
            dateOfBirth: "01/01/1960",
            gender: "male",
        };

        const result = createFamilyMemberSchema.safeParse(payload);
        assert.strictEqual(result.success, true);
    });

    it("should reject invalid date of birth format or future dates", () => {
        const invalidFormat = {
            firstName: "Priya",
            lastName: "Sharma",
            relationship: "daughter",
            dateOfBirth: "2015-05-20", // YYYY-MM-DD rejected in DD/MM/YYYY schema
            gender: "female",
        };
        const res1 = createFamilyMemberSchema.safeParse(invalidFormat);
        assert.strictEqual(res1.success, false);

        const futureDate = {
            firstName: "Priya",
            lastName: "Sharma",
            relationship: "daughter",
            dateOfBirth: "01/01/2099",
            gender: "female",
        };
        const res2 = createFamilyMemberSchema.safeParse(futureDate);
        assert.strictEqual(res2.success, false);
    });

    it("should reject invalid relationship enum", () => {
        const payload = {
            firstName: "Ramesh",
            lastName: "Verma",
            relationship: "neighbor", // Not in relationship enum
            dateOfBirth: "10/10/1985",
            gender: "male",
        };
        const result = createFamilyMemberSchema.safeParse(payload);
        assert.strictEqual(result.success, false);
    });

    // ----------------------------------------------------
    // 2. Update Validation Schema (Edit Flow)
    // ----------------------------------------------------
    it("should validate update payload with partial fields including phone and address", () => {
        const updatePayload = {
            phone: "9876543210",
            address: {
                city: "Pune",
                zipCode: "411001",
            },
        };

        const result = updateFamilyMemberSchema.safeParse(updatePayload);
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.data.phone, "9876543210");
        assert.strictEqual(result.data.address.city, "Pune");
    });

    it("should reject invalid mobile number or PIN code during edit", () => {
        const invalidPhone = {
            phone: "1234567890", // Does not start with 6-9
        };
        const res1 = updateFamilyMemberSchema.safeParse(invalidPhone);
        assert.strictEqual(res1.success, false);

        const invalidPin = {
            address: {
                zipCode: "012345", // Starts with 0
            },
        };
        const res2 = updateFamilyMemberSchema.safeParse(invalidPin);
        assert.strictEqual(res2.success, false);
    });

    // ----------------------------------------------------
    // 3. Service Layer Inheritance & Profile Completeness
    // ----------------------------------------------------
    it("should inherit contact and address from registered patient record and ignore client values", async () => {
        const dummyPatientId = "60c72b2f9b1d8b001c8e4d1a";
        const dummyPatient = {
            _id: dummyPatientId,
            email: "patient.primary@hospital.in",
            primaryPhone: "9876543210",
            address: {
                street: "Flat 402, Lotus Towers, Andheri West",
                city: "Mumbai",
                state: "Maharashtra",
                zipCode: "400053",
            },
        };

        // Stub Patient.findById
        const originalFindById = Patient.findById;
        const originalCreate = FamilyMember.create;

        Patient.findById = async (id) => {
            assert.strictEqual(id.toString(), dummyPatientId);
            return dummyPatient;
        };

        let createdMemberDoc = null;
        FamilyMember.create = async (doc) => {
            createdMemberDoc = doc;
            return {
                _id: "60c72b2f9b1d8b001c8e4d99",
                ...doc,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        };

        try {
            const familyData = {
                firstName: "Ananya",
                middleName: "P.",
                lastName: "Sharma",
                relationship: "daughter",
                dateOfBirth: "20/12/2012",
                gender: "female",
                insuranceCoverage: "patient",
                // Untrusted client-submitted values that must be overwritten by DB
                email: "hacker@evil.com",
                phone: "6111111111",
                address: {
                    street: "Fake St",
                    city: "Fake City",
                    state: "Fake State",
                    zipCode: "999999",
                },
            };

            const result = await familyService.createFamilyMember(dummyPatientId, familyData);

            // Verifications
            assert.strictEqual(result.firstName, "Ananya");
            assert.strictEqual(result.relationship, "daughter");
            // Must match patient DB record, NOT client submitted values
            assert.strictEqual(result.email, "patient.primary@hospital.in");
            assert.strictEqual(result.phone, "9876543210");
            assert.strictEqual(result.address.street, "Flat 402, Lotus Towers, Andheri West");
            assert.strictEqual(result.address.city, "Mumbai");
            assert.strictEqual(result.address.state, "Maharashtra");
            assert.strictEqual(result.address.zipCode, "400053");

            // Verify created document in DB
            assert.strictEqual(createdMemberDoc.email, "patient.primary@hospital.in");
            assert.strictEqual(createdMemberDoc.phone, "9876543210");
            assert.strictEqual(createdMemberDoc.address.city, "Mumbai");
        } finally {
            Patient.findById = originalFindById;
            FamilyMember.create = originalCreate;
        }
    });

    it("should throw error if registered patient profile is incomplete", async () => {
        const dummyPatientId = "60c72b2f9b1d8b001c8e4d1b";
        // Patient has missing address and phone
        const incompletePatient = {
            _id: dummyPatientId,
            email: "incomplete@hospital.in",
            primaryPhone: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
            },
        };

        const originalFindById = Patient.findById;
        Patient.findById = async () => incompletePatient;

        try {
            const familyData = {
                firstName: "Rohan",
                lastName: "Sharma",
                relationship: "son",
                dateOfBirth: "10/05/2015",
                gender: "male",
            };

            await assert.rejects(
                async () => {
                    await familyService.createFamilyMember(dummyPatientId, familyData);
                },
                /Patient profile is incomplete/
            );
        } finally {
            Patient.findById = originalFindById;
        }
    });

    it("should update family member without modifying patient profile", async () => {
        const dummyPatientId = "60c72b2f9b1d8b001c8e4d1a";
        const dummyMemberId = "60c72b2f9b1d8b001c8e4d99";

        let savedDoc = null;
        const existingMember = {
            _id: dummyMemberId,
            patient: dummyPatientId,
            status: "active",
            firstName: "Aarav",
            lastName: "Sharma",
            email: "old.email@hospital.in",
            phone: "9876543210",
            address: {
                street: "Old Street",
                city: "Mumbai",
                state: "Maharashtra",
                zipCode: "400053",
                toObject() {
                    return {
                        street: this.street,
                        city: this.city,
                        state: this.state,
                        zipCode: this.zipCode,
                    };
                },
            },
            save: async function () {
                savedDoc = this;
            },
        };

        const originalFindOne = FamilyMember.findOne;
        FamilyMember.findOne = async (query) => {
            assert.strictEqual(query._id, dummyMemberId);
            assert.strictEqual(query.patient, dummyPatientId);
            return existingMember;
        };

        try {
            const updatePayload = {
                email: "aarav.new@hospital.in",
                phone: "9822012345",
                address: {
                    street: "New Flat 101",
                    city: "Pune",
                    state: "Maharashtra",
                    zipCode: "411001",
                },
            };

            const updated = await familyService.updateFamilyMember(
                dummyPatientId,
                dummyMemberId,
                updatePayload
            );

            assert.strictEqual(updated.email, "aarav.new@hospital.in");
            assert.strictEqual(updated.phone, "9822012345");
            assert.strictEqual(updated.address.city, "Pune");
            assert.strictEqual(savedDoc.address.city, "Pune");
        } finally {
            FamilyMember.findOne = originalFindOne;
        }
    });

    it("should enforce ownership check when updating family member", async () => {
        const dummyPatientId = "60c72b2f9b1d8b001c8e4d1a";
        const unauthorizedPatientId = "60c72b2f9b1d8b001c8e4d99";
        const dummyMemberId = "60c72b2f9b1d8b001c8e4d88";

        const originalFindOne = FamilyMember.findOne;
        FamilyMember.findOne = async (query) => {
            // If patient does not match, return null
            if (query.patient !== dummyPatientId) {
                return null;
            }
            return { _id: dummyMemberId, patient: dummyPatientId, status: "active" };
        };

        try {
            await assert.rejects(
                async () => {
                    await familyService.updateFamilyMember(
                        unauthorizedPatientId,
                        dummyMemberId,
                        { phone: "9822012345" }
                    );
                },
                /Family member not found/
            );
        } finally {
            FamilyMember.findOne = originalFindOne;
        }
    });
});
