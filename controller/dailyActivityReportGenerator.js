const Teacher = require('../models/teacher')
const Moment = require('../models/moment')
const Activities = require('../models/activities')
const Diary = require('../models/dailydiary')
const Student = require('../models/student')
const Attendance = require('../models/attendance')
const User = require('../models/user')
const Metrics = require('../models/metrics')
const Timeframe = require('../models/timeframe')
const Faculty = require('../models/faculty')
const Guardian = require('../models/guardian')

module.exports =async function(req,res,next){
    try{
        //console.log(req.query)
        var {institutionid, startDateInfo, endDateInfo} = req.query;
        var startDate, endDate;
        if(!startDateInfo){
            startDate = new Date();
            startDate.setHours(0,0,0,0);
        }else{
            startDate = new Date(startDateInfo);
            startDate.setHours(0,0,0,0);
        }
        if(!endDateInfo){
            endDate = new Date();
            endDate.setHours(23,59,99,999);
        }else{
            endDate = new Date(endDateInfo);
            endDate.setHours(23,59,99,999);
        }

        //Teacher data
        var totalActivities = 0;
        var totalMoments = 0;
        const teachers = await Teacher.find({institution:institutionid})
        const teacherDetails = await Promise.all(teachers.map(async teacher => {
            const moments = await Moment.find({createdBy:teacher._id,    
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }})
            totalMoments = totalMoments+moments.length
            const activities = await Activities.find({createdBy:teacher._id,
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    }})
            totalActivities = totalActivities+activities.length
            var homework = 0
            var food = 0
            var remarks = 0
            await Promise.all(activities.map(async activity =>{
                if(activity.type.equals("5bb36c43ee73be11e889a055")){
                    homework++
                }else if(activity.type.equals("5bc72cc9f1ac22080162de73")){
                    food++
                }else if(activity.type.equals("5c8355b62aaade5a9399d999")){
                    remarks++
                }
            }))  
            const item ={
                name:teacher.name,
                moments:moments.length,
                homework:homework,
                food:food,
                remarks:remarks
            }
            return item
        }))
        var diaryColl = []
        var attendanceColl = []
        const students = await Student.find({institution:institutionid})
        await Promise.all(students.map(async student =>{
        const diary = await Diary.findOne({student:student._id,signed:true,
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }})
        if(diary){
            diaryColl.push(diary)
            }
        const attendance = await Attendance.findOne({student:student._id, state:"present",
                createdAt: {
                $gte: startDate,
                $lt: endDate
            }})
        if(attendance){
            attendanceColl.push(attendance)
        }
        }))

        //Preschool Data
        const preschoolDailyData = {
            moments:totalMoments,
            activities:totalActivities,
            signedDiaries:diaryColl.length,
            attendanceRecord:attendanceColl.length
        }

        //Parents Daily Data
        const activeGuardians = await User.find({institution:institutionid,role:"guardian",lastActive:{
                    $gte: startDate,
                    $lt: endDate
                }})
        activeGuardians.filter(g => g)
        const parentActivities = await Activities.find({type:"5cf4ae44aeb1980d806941d5",
        createdAt: {
            $gte: startDate,
            $lt: endDate
        }})
        //console.log(parentActivities);
        const timeframe = await Timeframe.findOne({type:'daily',
        start_date:{
            $gte: startDate},
        end_date:{
            $lt: endDate
        }})
        var parentsDailyData = {}
        if(timeframe){
        //console.log("TF",timeframe);
        const metrics = await Metrics.findOne({timeframe:timeframe._id,institution:institutionid})
            parentsDailyData= {
                active:activeGuardians.length,
                signedDiaries:diaryColl.length,
                remarksAdded:parentActivities.length,
                notification:metrics.notifications_per_student
            }
        }else{
            parentsDailyData= {
                active:activeGuardians.length,
                signedDiaries:diaryColl.length,
                remarksAdded:parentActivities.length,
                notification:0
            }
        }

        //Unlinked Guardians List
        //(students already declared in teacherdetails section)
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
                        token: guardians.find(guardian => guardian._id.equals(g.guardian)).linking.token.code
                    }))
                }
                return studentWithDetails;
            }else{
                const studentWithDetails ={
                    name:student.name,
                    faculty:"",
                    guardians:student.guardians.map(g => ({
                        relation: g.relation, 
                        token: guardians.find(guardian => guardian._id.equals(g.guardian)).linking.token.code
                    }))
                }
                return studentWithDetails;
            }
        }else{
            return null;
        }
        }));
        const studentsWithUnlinkedGuardians = studentsWithDetails.filter(s => s);
        var data ={
            parentsDailyData:parentsDailyData,
            preschoolDailyData:preschoolDailyData,
            teacherDetails:teacherDetails,
            unlinkedGuardians:studentsWithUnlinkedGuardians
        }
        res.json(data);
    }catch(e){
        console.log(e);
    }
}
    