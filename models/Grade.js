import { Schema, model } from "mongoose";
const gradeSchema = new Schema({
  scores: [
    {
      type: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
  ],
  class_id: {
    type: Number,
    required: true,
  },
  learner_id: {
    type: Number,
    required: true,
  },
});

gradeSchema.index({ learner_id: 1, class_id: 1 });

// static methods
gradeSchema.statics.getByClassId = async function (input) {
  return await this.findMany({ class_id: input });
};
gradeSchema.statics.getByLearnerId = async function (input) {
  return await this.findMany({ learner_id: input });
};

export default model("Grade", gradeSchema);
