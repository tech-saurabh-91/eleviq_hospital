const mongoose = require("mongoose");

const clinicalRecordSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
      index: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    familyMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      default: null,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    consultationDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    presentingComplaints: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    historyOfPresentIllness: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    reviewOfSystems: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    assessment: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    plan: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },

        strength: {
          type: String,
          trim: true,
          maxlength: 100,
          default: "",
        },

        route: {
          type: String,
          trim: true,
          maxlength: 100,
          default: "",
        },

        frequency: {
          type: String,
          trim: true,
          maxlength: 100,
          default: "",
        },

        duration: {
          type: String,
          trim: true,
          maxlength: 100,
          default: "",
        },

        quantity: {
          type: Number,
          min: 0,
        },

        instructions: {
          type: String,
          trim: true,
          maxlength: 500,
          default: "",
        },
      },
    ],

    investigations: [
      {
        testName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },

        instructions: {
          type: String,
          trim: true,
          maxlength: 500,
          default: "",
        },
      },
    ],

    followUp: {
      date: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
      },

      instructions: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },
    },

    otherNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    status: {
      type: String,
      enum: ["FINALIZED"],
      default: "FINALIZED",
      index: true,
    },

    finalizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    finalizedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClinicalRecord", clinicalRecordSchema);