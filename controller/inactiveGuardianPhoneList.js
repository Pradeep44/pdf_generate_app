const Institution = require('../models/institution');
const Guardian = require('../models/guardian');
const User = require('../models/user');

module.exports = async function(req, res, next){
    var { institutionshortid } = req.query;
    var institution = await Institution.findOne({shortid:institutionshortid})
    var startDate = new Date();
    startDate.setHours(0,0,0,0);
    startDate.setDate(0);
  
  var students = await Student.find({institution:institution._id});
  var inactiveUsers = [];
  var inactiveUsersPhoneColl = [];
  await Promise.all(students.map( async student =>{
  await Promise.all(student.guardians.map(async g => {
      var guardian = await Guardian.findOne({_id:g.guardian});
      var user = await User.findOne({_id:guardian.linking.token.user})
      if(user){
        var time = new Date(user.lastActive);
        if(time < startDate){
          var item = {
            name:guardian.name,
            phoneNumber:guardian.mobileNumber,
            relation:g.relation,
            student:student.name
          };
          inactiveUsersPhoneColl.push(guardian.mobileNumber);
          inactiveUsers.push(item);
        }
      }
    }));
  }))
  var inactiveUsersPhoneList=inactiveUsersPhoneColl.join();
  res.send({inactiveUsers,inactiveUsersPhoneList});
}