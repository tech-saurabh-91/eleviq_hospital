const PDFDocument = require("pdfkit");

const ClinicalRecord = require("./clinical-record.model");

const COLORS = {
    teal: "#20A89A",
    tealDark: "#167A70",
    tealLight: "#EAF7F5",
    text: "#243333",
    muted: "#667575",
    border: "#D6E2E0",
    white: "#FFFFFF",
    light: "#F7FAFA",
};

const PAGE = {
    width: 511,
    left: 42,
};

const buildClinicalRecordPdf = async ({ recordId, patientId }) => {
    const record = await ClinicalRecord.findOne({
        _id: recordId,
        patient: patientId,
        status: "FINALIZED",
    })
        .populate(
            "patient",
            "patientId firstName middleName lastName dateOfBirth gender primaryPhone mobile email bloodType allergies"
        )
        .populate(
            "appointment",
            "appointmentType appointmentDate startTime endTime visitReason"
        )
        .populate(
            "familyMember",
            "patient firstName middleName lastName relationship dateOfBirth gender email phone address"
        )
        .populate("doctor", "username email mobile")
        .populate("finalizedBy", "username email mobile")
        .lean();

    if (!record) {
        const error = new Error("Clinical record not found");
        error.statusCode = 404;
        throw error;
    }

    /*
     * The clinical record belongs to the authenticated patient account.
     * For family appointments, familyMember identifies the person treated.
     */
    if (
        record.familyMember &&
        String(record.familyMember.patient) !== String(patientId)
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const doc = new PDFDocument({
        size: "A4",
        margin: 42,
        bufferPages: true,
        autoFirstPage: true,
    });

    const chunks = [];

    doc.on("data", (chunk) => {
        chunks.push(chunk);
    });

    const pdfReady = new Promise((resolve, reject) => {
        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);
    });

    const patient = record.patient;
    const familyMember = record.familyMember;
    const appointment = record.appointment;
    const treatedPerson = familyMember || patient;
    const doctor = record.doctor || record.finalizedBy;

    const treatedPersonName = [
        treatedPerson?.firstName,
        treatedPerson?.middleName,
        treatedPerson?.lastName,
    ]
        .filter(Boolean)
        .join(" ") || "-";

    const doctorName = doctor?.username || "Doctor";

    // --------------------------------------------------
    // Header
    // --------------------------------------------------

    drawHeader(doc, doctorName);

    // --------------------------------------------------
    // Patient Information
    // --------------------------------------------------

    drawSectionTitle(doc, "PATIENT INFORMATION");

    const patientFields = familyMember
        ? [
              ["Patient Name", treatedPersonName],
              ["Relationship", familyMember.relationship || "-"],
              ["Date of Birth", familyMember.dateOfBirth || "-"],
              ["Gender", familyMember.gender || "-"],
              ["Contact", familyMember.phone || "-"],
              ["Email", familyMember.email || "-"],
          ]
        : [
              ["Patient Name", treatedPersonName],
              ["Patient ID", patient?.patientId || "-"],
              ["Date of Birth", treatedPerson?.dateOfBirth || "-"],
              ["Gender", treatedPerson?.gender || "-"],
              [
                  "Contact",
                  patient?.primaryPhone || patient?.mobile || "-",
              ],
              ["Email", patient?.email || "-"],
              ["Blood Type", patient?.bloodType || "Unknown"],
              [
                  "Allergies",
                  patient?.allergies?.length
                      ? patient.allergies.join(", ")
                      : "No known allergies",
              ],
          ];

    drawFieldGrid(doc, patientFields, 2);

    // --------------------------------------------------
    // Consultation Details
    // --------------------------------------------------

    drawSectionTitle(doc, "CONSULTATION DETAILS");

    drawFieldGrid(
        doc,
        [
            ["Consultation Date", record.consultationDate || "-"],
            ["Appointment Type", appointment?.appointmentType || "-"],
            [
                "Time",
                appointment
                    ? `${appointment.startTime || "-"} - ${
                          appointment.endTime || "-"
                      }`
                    : "-",
            ],
            ["Doctor", doctorName],
        ],
        2
    );

    drawSingleField(
        doc,
        "Visit Reason",
        appointment?.visitReason || "-"
    );

    // --------------------------------------------------
    // Physician Notes
    // --------------------------------------------------

    drawSectionTitle(doc, "PHYSICIAN NOTES");

    drawClinicalNote(
        doc,
        "Presenting Complaints",
        record.presentingComplaints
    );

    drawClinicalNote(
        doc,
        "History of Present Illness",
        record.historyOfPresentIllness
    );

    drawClinicalNote(
        doc,
        "Review of System",
        record.reviewOfSystems
    );

    drawClinicalNote(
        doc,
        "Assessment",
        record.assessment
    );

    drawClinicalNote(
        doc,
        "Plan",
        record.plan
    );

    if (record.otherNotes) {
        drawClinicalNote(
            doc,
            "Other Notes",
            record.otherNotes
        );
    }

    // --------------------------------------------------
    // Prescription
    // --------------------------------------------------

    if (record.medicines?.length) {
        drawSectionTitle(doc, "PRESCRIPTION");

        drawMedicineTable(
            doc,
            record.medicines
        );
    }

    // --------------------------------------------------
    // Investigations
    // --------------------------------------------------

    if (record.investigations?.length) {
        drawSectionTitle(doc, "INVESTIGATIONS");

        record.investigations.forEach(
            (investigation, index) => {
                const instructionText =
                    investigation.instructions
                        ? `Instructions: ${investigation.instructions}`
                        : "";

                const titleHeight =
                    doc.heightOfString(
                        `${index + 1}. ${
                            investigation.testName || "-"
                        }`,
                        {
                            width: PAGE.width,
                        }
                    );

                const instructionHeight =
                    instructionText
                        ? doc.heightOfString(
                              instructionText,
                              {
                                  width: PAGE.width,
                              }
                          )
                        : 0;

                const height = Math.max(
                    34,
                    20 +
                        titleHeight +
                        instructionHeight
                );

                ensureSpace(
                    doc,
                    height + 8
                );

                const y = doc.y;

                doc
                    .font("Helvetica-Bold")
                    .fontSize(9)
                    .fillColor(COLORS.text)
                    .text(
                        `${index + 1}. ${
                            investigation.testName ||
                            "-"
                        }`,
                        PAGE.left,
                        y,
                        {
                            width: PAGE.width,
                        }
                    );

                if (instructionText) {
                    doc
                        .font("Helvetica")
                        .fontSize(8)
                        .fillColor(COLORS.muted)
                        .text(
                            instructionText,
                            PAGE.left,
                            y +
                                titleHeight +
                                4,
                            {
                                width: PAGE.width,
                            }
                        );
                }

                doc.y = y + height;

                doc
                    .moveTo(
                        PAGE.left,
                        doc.y
                    )
                    .lineTo(
                        PAGE.left +
                            PAGE.width,
                        doc.y
                    )
                    .strokeColor(
                        COLORS.border
                    )
                    .stroke();

                doc.y += 8;
            }
        );
    }

    // --------------------------------------------------
    // Follow-up
    // --------------------------------------------------

    if (
        record.followUp?.date ||
        record.followUp?.instructions
    ) {
        drawSectionTitle(
            doc,
            "FOLLOW-UP"
        );

        if (record.followUp.date) {
            drawSingleField(
                doc,
                "Follow-up Date",
                record.followUp.date
            );
        }

        if (
            record.followUp.instructions
        ) {
            drawClinicalNote(
                doc,
                "Instructions",
                record.followUp.instructions
            );
        }
    }

    // --------------------------------------------------
    // Doctor / Finalization
    // --------------------------------------------------

    drawSectionTitle(
        doc,
        "DOCTOR / FINALIZATION"
    );

    drawFieldGrid(
        doc,
        [
            ["Doctor", doctorName],
            [
                "Finalized Date",
                record.finalizedAt
                    ? formatDate(
                          record.finalizedAt
                      )
                    : "-",
            ],
        ],
        2
    );

    ensureSpace(doc, 70);

    const signatureY = doc.y + 8;
    const signatureX = 390;
    const signatureWidth = 145;

    doc
        .moveTo(
            signatureX,
            signatureY + 22
        )
        .lineTo(
            signatureX +
                signatureWidth,
            signatureY + 22
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(
            "Doctor Authentication",
            signatureX,
            signatureY + 28,
            {
                width: signatureWidth,
                align: "center",
            }
        );

    doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(
            doctorName,
            signatureX,
            signatureY + 44,
            {
                width: signatureWidth,
                align: "center",
            }
        );

    // --------------------------------------------------
    // Page Footers
    // --------------------------------------------------

    addPageFooters(doc);

    doc.end();

    return pdfReady;
};

// ==================================================
// Header
// ==================================================

const drawHeader = (
    doc,
    doctorName
) => {
    doc
        .rect(0, 0, 595, 92)
        .fill(COLORS.teal);

    doc
        .font("Helvetica-Bold")
        .fontSize(19)
        .fillColor(COLORS.white)
        .text(
            "Hospital Management System",
            PAGE.left,
            27
        );

    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.white)
        .text(
            "Clinical Consultation & Prescription",
            PAGE.left,
            52
        );

    doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(COLORS.white)
        .text(
            doctorName,
            390,
            35,
            {
                width: 145,
                align: "right",
            }
        );

    doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.white)
        .text(
            "FINALIZED MEDICAL RECORD",
            390,
            52,
            {
                width: 145,
                align: "right",
            }
        );

    doc.y = 112;
};

// ==================================================
// Section Title
// ==================================================

const drawSectionTitle = (
    doc,
    title
) => {
    ensureSpace(doc, 42);

    const y = doc.y;

    doc
        .roundedRect(
            PAGE.left,
            y,
            PAGE.width,
            24,
            4
        )
        .fill(COLORS.tealLight);

    doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(COLORS.tealDark)
        .text(
            title,
            PAGE.left + 10,
            y + 7,
            {
                width:
                    PAGE.width - 20,
            }
        );

    doc.y = y + 32;
};

// ==================================================
// Field Grid
// ==================================================

const drawFieldGrid = (
    doc,
    fields,
    columns = 2
) => {
    const gap = 24;

    const columnWidth =
        (PAGE.width -
            gap * (columns - 1)) /
        columns;

    for (
        let i = 0;
        i < fields.length;
        i += columns
    ) {
        const rowFields =
            fields.slice(
                i,
                i + columns
            );

        const rowHeight =
            Math.max(
                34,
                ...rowFields.map(
                    ([label, value]) => {
                        return (
                            doc.heightOfString(
                                String(
                                    value ||
                                        "-"
                                ),
                                {
                                    width:
                                        columnWidth,
                                }
                            ) + 22
                        );
                    }
                )
            );

        ensureSpace(
            doc,
            rowHeight + 6
        );

        const rowY = doc.y;

        rowFields.forEach(
            (
                [label, value],
                index
            ) => {
                const x =
                    PAGE.left +
                    index *
                        (columnWidth +
                            gap);

                drawField(
                    doc,
                    x,
                    rowY,
                    columnWidth,
                    label,
                    value
                );
            }
        );

        doc.y =
            rowY +
            rowHeight +
            6;
    }
};

// ==================================================
// Field
// ==================================================

const drawField = (
    doc,
    x,
    y,
    width,
    label,
    value
) => {
    doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(COLORS.muted)
        .text(
            label.toUpperCase(),
            x,
            y,
            {
                width,
            }
        );

    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(
            String(value || "-"),
            x,
            y + 12,
            {
                width,
            }
        );
};

// ==================================================
// Single Field
// ==================================================

const drawSingleField = (
    doc,
    label,
    value
) => {
    const text = String(
        value || "-"
    );

    const textHeight =
        doc.heightOfString(
            text,
            {
                width: PAGE.width,
            }
        );

    const height = Math.max(
        32,
        textHeight + 20
    );

    ensureSpace(
        doc,
        height + 6
    );

    const y = doc.y;

    doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(COLORS.muted)
        .text(
            label.toUpperCase(),
            PAGE.left,
            y,
            {
                width: PAGE.width,
            }
        );

    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(
            text,
            PAGE.left,
            y + 12,
            {
                width: PAGE.width,
            }
        );

    doc.y =
        y + height;

    doc
        .moveTo(
            PAGE.left,
            doc.y
        )
        .lineTo(
            PAGE.left +
                PAGE.width,
            doc.y
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc.y += 7;
};

// ==================================================
// Clinical Note
// ==================================================

const drawClinicalNote = (
    doc,
    title,
    value
) => {
    const text = String(
        value || "-"
    );

    const textHeight =
        doc.heightOfString(
            text,
            {
                width: PAGE.width,
            }
        );

    const height = Math.max(
        34,
        textHeight + 24
    );

    ensureSpace(
        doc,
        height + 6
    );

    const y = doc.y;

    doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(
            COLORS.tealDark
        )
        .text(
            title.toUpperCase(),
            PAGE.left,
            y,
            {
                width: PAGE.width,
            }
        );

    doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(
            text,
            PAGE.left,
            y + 13,
            {
                width: PAGE.width,
                lineGap: 2,
            }
        );

    doc.y =
        y + height;

    doc
        .moveTo(
            PAGE.left,
            doc.y
        )
        .lineTo(
            PAGE.left +
                PAGE.width,
            doc.y
        )
        .strokeColor(
            COLORS.border
        )
        .stroke();

    doc.y += 7;
};

// ==================================================
// Medicine Table
// ==================================================

const drawMedicineTable = (
    doc,
    medicines
) => {
    const columns = [
        {
            label: "Medicine",
            key: "medicineName",
            width: 92,
        },
        {
            label: "Strength",
            key: "strength",
            width: 58,
        },
        {
            label: "Route",
            key: "route",
            width: 52,
        },
        {
            label: "Frequency",
            key: "frequency",
            width: 68,
        },
        {
            label: "Duration",
            key: "duration",
            width: 58,
        },
        {
            label: "Qty",
            key: "quantity",
            width: 38,
        },
        {
            label: "Instructions",
            key: "instructions",
            width: 145,
        },
    ];

    const tableWidth =
        columns.reduce(
            (sum, column) =>
                sum + column.width,
            0
        );

    const drawTableHeader = () => {
        ensureSpace(
            doc,
            34
        );

        const y = doc.y;

        doc
            .roundedRect(
                PAGE.left,
                y,
                tableWidth,
                26,
                4
            )
            .fill(COLORS.teal);

        let x = PAGE.left;

        columns.forEach(
            (column) => {
                doc
                    .font(
                        "Helvetica-Bold"
                    )
                    .fontSize(7)
                    .fillColor(
                        COLORS.white
                    )
                    .text(
                        column.label,
                        x + 5,
                        y + 8,
                        {
                            width:
                                column.width -
                                10,
                        }
                    );

                x += column.width;
            }
        );

        doc.y = y + 26;
    };

    drawTableHeader();

    medicines.forEach(
        (medicine, index) => {
            const values = {
                medicineName:
                    medicine.medicineName ||
                    "-",

                strength:
                    medicine.strength ||
                    "-",

                route:
                    medicine.route ||
                    "-",

                frequency:
                    medicine.frequency ||
                    "-",

                duration:
                    medicine.duration ||
                    "-",

                quantity:
                    medicine.quantity ??
                    "-",

                instructions:
                    medicine.instructions ||
                    "-",
            };

            const rowHeight =
                Math.max(
                    30,
                    ...columns.map(
                        (column) => {
                            return (
                                doc.heightOfString(
                                    String(
                                        values[
                                            column.key
                                        ]
                                    ),
                                    {
                                        width:
                                            column.width -
                                            10,
                                    }
                                ) + 12
                            );
                        }
                    )
                );

            if (
                doc.y +
                    rowHeight >
                doc.page.height -
                    65
            ) {
                doc.addPage();

                drawContinuationHeader(
                    doc
                );

                doc.y = 48;

                drawTableHeader();
            }

            const y = doc.y;

            if (
                index % 2 ===
                0
            ) {
                doc
                    .rect(
                        PAGE.left,
                        y,
                        tableWidth,
                        rowHeight
                    )
                    .fill(
                        COLORS.light
                    );
            }

            doc
                .rect(
                    PAGE.left,
                    y,
                    tableWidth,
                    rowHeight
                )
                .strokeColor(
                    COLORS.border
                )
                .stroke();

            let x = PAGE.left;

            columns.forEach(
                (column) => {
                    doc
                        .font(
                            "Helvetica"
                        )
                        .fontSize(8)
                        .fillColor(
                            COLORS.text
                        )
                        .text(
                            String(
                                values[
                                    column.key
                                ]
                            ),
                            x + 5,
                            y + 7,
                            {
                                width:
                                    column.width -
                                    10,
                            }
                        );

                    x +=
                        column.width;
                }
            );

            doc.y =
                y +
                rowHeight;
        }
    );

    doc.y += 8;
};

// ==================================================
// Page Space
// ==================================================

const ensureSpace = (
    doc,
    requiredHeight
) => {
    const bottomMargin = 58;

    if (
        doc.y +
            requiredHeight >
        doc.page.height -
            bottomMargin
    ) {
        doc.addPage();

        drawContinuationHeader(
            doc
        );

        doc.y = 48;
    }
};

// ==================================================
// Continuation Header
// ==================================================

const drawContinuationHeader = (
    doc
) => {
    doc
        .rect(
            0,
            0,
            595,
            30
        )
        .fill(
            COLORS.teal
        );

    doc
        .font(
            "Helvetica-Bold"
        )
        .fontSize(8)
        .fillColor(
            COLORS.white
        )
        .text(
            "Hospital Management System",
            PAGE.left,
            10
        );

    doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(
            COLORS.white
        )
        .text(
            "Clinical Consultation & Prescription",
            390,
            11,
            {
                width: 145,
                align: "right",
            }
        );
};

// ==================================================
// Page Footers
// ==================================================

const addPageFooters = (
    doc
) => {
    const range =
        doc.bufferedPageRange();

    for (
        let i = 0;
        i < range.count;
        i++
    ) {
        doc.switchToPage(
            range.start + i
        );

        const footerY =
            doc.page.height -
            40;

        doc
            .moveTo(
                PAGE.left,
                footerY - 7
            )
            .lineTo(
                PAGE.left +
                    PAGE.width,
                footerY - 7
            )
            .strokeColor(
                COLORS.border
            )
            .stroke();

        doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor(
                COLORS.muted
            )
            .text(
                "Hospital Management System • Clinical Record",
                PAGE.left,
                footerY,
                {
                    width: 300,
                }
            );

        doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor(
                COLORS.muted
            )
            .text(
                `Page ${
                    i + 1
                } of ${
                    range.count
                }`,
                450,
                footerY,
                {
                    width: 103,
                    align: "right",
                }
            );
    }
};

// ==================================================
// Date Format
// ==================================================

const formatDate = (
    date
) => {
    const value =
        new Date(date);

    if (
        Number.isNaN(
            value.getTime()
        )
    ) {
        return "-";
    }

    return value.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};

module.exports = {
    buildClinicalRecordPdf,
};