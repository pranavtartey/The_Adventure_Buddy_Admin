const Camp = require("../Models/Camp");
const Student = require("../Models/Student");
const mongoose = require("mongoose");

const removeStudents = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7 );
    // oneWeekAgo.setDate(oneWeekAgo.getDate());

    const camps = await Camp.find({ date: { $lte: oneWeekAgo } });
    console.log(camps);

    for (const camp of camps) {
      await Student.deleteMany({ _id: { $in: camp.students } });

      camp.students = [];
      await camp.save();
    }

    console.log(
      `Successfully Deleted students from camps older then a week as of ${new Date()}`
    );
  } catch (error) {
    console.log("Error removing students:", error);
  }
};
module.exports = { removeStudents };
