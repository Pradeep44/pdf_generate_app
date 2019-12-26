const Institution = require('../models/institution');
const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Guardian = require('../models/guardian');
const User = require('../models/user');

module.exports =async function(req,res,next){
    var { institutionshortid } = req.query;
    var institution = await Institution.findOne({shortid:institutionshortid})
    var students = await Student.find({institution:institution._id});
    const studentsWithDetails = await Promise.all(students.map(async student => {
      const guardians = await Promise.all(student.guardians.map(async g => {
        return Guardian.findOne({_id:g.guardian})
      })); 
  
      if (guardians.every(guardian => guardian.linking.token.status !== 'linked')){
        if(student.academics.length > 0){
          const faculty = await Faculty.findOne({_id:student.academics[0].faculty});
          const studentWithDetails ={
              name:student.name,
              faculty:faculty.name,
              guardians:student.guardians.map(g => ({
                  relation: g.relation, 
                  phoneNumber: guardians.find(guardian => guardian._id.equals(g.guardian)).mobileNumber
              }))
          }
          return studentWithDetails;
      }else{
          const studentWithDetails ={
              name:student.name,
              faculty:"",
              guardians:student.guardians.map(g => ({
                  relation: g.relation, 
                  phoneNumber: guardians.find(guardian => guardian._id.equals(g.guardian)).mobileNumber
              }))
          }
          return studentWithDetails;
      }
      }else{
        return null;
      }
      }));
  const studentsGuardiansPhoneNumber = studentsWithDetails.filter(s => s);
  var phoneNumStringColl =[];
  await Promise.all(studentsGuardiansPhoneNumber.map(async student =>{
    student.guardians.map(async guardian =>{
      phoneNumStringColl.push(guardian.phoneNumber);
    })
  }));
  //console.log("PhoneNoList",phoneNumStringColl.join());
  var PhoneNumberString=phoneNumStringColl.join();
 return res.send({studentsGuardiansPhoneNumber,PhoneNumberString});
}