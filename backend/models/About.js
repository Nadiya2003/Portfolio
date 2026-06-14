const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    heading: { type: String, default: '' },
    subHeading: { type: String, default: '' },
    description: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    profileImagePublicId: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    skills: [
      {
        name: String,
        level: Number,
        category: String,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);
