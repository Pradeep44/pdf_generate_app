const Institution = require('../models/institution');
const Guardian = require('../models/guardian');
const User = require('../models/user');

module.exports = async function(req, res, next){
    var { institutionshortid } = req.query;
    var institution = await Institution.findOne({shortid:institutionshortid})
    var startDate = new Date();
    startDate.setHours(0,0,0,0);
    startDate.setDate(0);
  
  var allGuardians = await Guardian.find({institution:institution._id});
  var inactiveUsers = [];
  var inactiveUsersPhoneColl = [];
  await Promise.all(allGuardians.map(async g =>{
    var user = await User.findOne({_id:g.linking.token.user})
    if(user){
      var time = new Date(user.lastActive);
      if(time < startDate){
        var item = {
          name:g.name,
          phoneNumber:g.mobileNumber
        };
        inactiveUsers.push(item);
        inactiveUsersPhoneColl.push(g.mobileNumber);
      }
    // }else{
    //   var item = {
    //     name:g.name,
    //     phoneNumber:g.mobileNumber
    //   };
    //   inactiveUsers.push(item);
    //   inactiveUsersPhoneColl.push(g.mobileNumber);
    }
  }))
  //console.log("InactiveParentsPhoneList",inactiveUsersPhoneColl.join());
  var inactiveUsersPhoneList =inactiveUsersPhoneColl.join();
  res.send({inactiveUsers,inactiveUsersPhoneList});
}