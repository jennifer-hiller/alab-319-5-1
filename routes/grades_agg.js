import express from "express";

import Grade from "../models/Grade.js";
const router = express.Router();

const pipeline = [
  {
    $group: {
      _id: "$learner_id",
      totalScore: {
        $sum: { $sum: "$scores.score" },
      },
      totalCount: {
        $sum: {
          $size: { $ifNull: ["$scores", []] },
        },
      }, // Handle missing scores
    },
  },
  {
    $project: {
      _id: 1,
      average: {
        $cond: {
          if: { $eq: ["$totalCount", 0] }, // can't divide by 0
          then: null,
          else: {
            $divide: ["$totalScore", "$totalCount"],
          },
        },
      },
    },
  },
  {
    $group: {
      _id: null,
      totalLearners: { $sum: 1 },
      above50: {
        $sum: {
          $cond: [{ $gt: ["$average", 50] }, 1, 0],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      totalLearners: "$totalLearners",
      above50: 1,
      percentageAbove50: {
        $multiply: [
          {
            $divide: ["$above50", "$totalLearners"],
          },
          100,
        ],
      },
    },
  },
];

// Get statistics about learners' grades
// No student got an average of over 50, so weights will have to be added in the future
router.get("/stats", async (req, res, next) => {
  try {
    let result = await Grade.aggregate(pipeline);
    if (result.length === 0) res.send("No data available").status(404);
    else res.send(result[0]).status(200);
  } catch (err) {
    next(err);
  }
});
router.get("/stats/:id", async (req, res, next) => {
  try {
    const pipelineByClass = [
      {
        $match: { class_id: Number(req.params.id) },
      },
      ...pipeline,
    ];
    let result = await Grade.aggregate(pipelineByClass);
    if (result.length === 0) res.send("No data available").status(404);
    else res.send(result[0]).status(200);
  } catch (err) {
    next(err);
  }
});

export default router;
