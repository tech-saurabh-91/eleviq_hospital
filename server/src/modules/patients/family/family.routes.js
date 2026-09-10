const express = require("express");

const validate = require("../../../middleware/validate");
const authenticate = require("../../../middleware/auth");
const authorize = require("../../../middleware/authorize");
const upload = require("../../../middleware/upload");
const validateImage = require("../../../middleware/validate-image");

const {
    createFamilyMemberSchema,
    updateFamilyMemberSchema,
} = require("./family.validation");

const {
    createFamilyMember,
    getFamilyMembers,
    getFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
} = require("./family.controller");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("patient.family.create"),
    upload.single("profilePicture"),
    validateImage,
    validate(createFamilyMemberSchema),
    async (req, res, next) => {
        try {
            const {
                uploadImage,
            } = require("../../../services/media.service");

            if (req.file) {
                req.uploadedImage =
                    await uploadImage(
                        req.file,
                        `eleviq-hospital/patients/${req.user.patientId}/family`
                    );
            }

            next();
        } catch (error) {
            next(error);
        }
    },
    createFamilyMember
);

router.get(
    "/",
    authenticate,
    authorize("patient.family.read"),
    getFamilyMembers
);

router.get(
    "/:familyMemberId",
    authenticate,
    authorize("patient.family.read"),
    getFamilyMember
);

router.patch(
    "/:familyMemberId",
    authenticate,
    authorize("patient.family.update"),
    upload.none(),
    validate(updateFamilyMemberSchema),
    updateFamilyMember
);

router.delete(
    "/:familyMemberId",
    authenticate,
    authorize("patient.family.delete"),
    removeFamilyMember
);

module.exports = router;