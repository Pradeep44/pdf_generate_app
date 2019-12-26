var request = require('request')
var Institution = require('../models/institution')
var Teacher = require('../models/teacher')


module.exports = async function(req,res,next){
    //console.log(`Triggered`)
    const institutions = await Institution.find({_id:"5c8b08750914f663f2ff1297"});
    await Promise.all(institutions.map(async institution => {
        var teachers = await Teacher.find({institution: institution._id, isAdmin: true})
        //console.log(teacher);
        if(teachers != null){
            //console.log(institution.name,teacher.name,`${teacher._id}`,`${institution._id}`)
        await Promise.all(teachers.map(async teacher => {
            var options = { 
                    method: 'GET',
                    url: 'https://app.kopila.co/generic-card-hook',
                    headers: 
                    {   'Content-Type': 'application/json' },
                    body: 
                    { filters: 
                        { institution: `${institution.shortid}`,
                        type: 'teacher',
                        sendToSpecific: true,
                        ids: [ `${teacher.shortid}` ] },
                        template: 'template3',
                        templateData: 
                        [ { key: 'topic', value: 'Moment' },
                        { key: 'topicColor', value: 'Blue' },
                        { key: 'image',
                            value: 'https://edumonk-moments.s3.ap-south-1.amazonaws.com/1575264461988_nutrition_chart_101.jpg' },
                        { key: 'title', value: 'This is not a title' },
                        { key: 'subtitle', value: 'this is desciption' },
                        { key: 'icon',
                            value: 'https://edumonk-moments.s3.ap-south-1.amazonaws.com/1575264490360_nutrition_chart_101.jpg' } ],
                        notification: 
                        { title: 'demo notice',
                        body: 'this is just a demo',
                        data: 
                            [ { key: 'notificationImage',
                                value: 'https://edumonk-moments.s3.ap-south-1.amazonaws.com/1575264513161_nutrition_chart_101.jpg' } ] } },
                    json: true 
                };
                request(options, function (error, response, body) {
                if (error) throw new Error(error);
                // console.log(body);
                });
            }))
        }
    }))
    return res.send("Success")
    // var options = { 
    //     method: 'GET',
    //     url: 'https://app.kopila.co/generic-card-hook',
    //     headers: 
    //     { Host: 'app.kopila.co',
    //         'Content-Type': 'application/json' },
    //     body: 
    //     { filters: 
    //         { institution: 'vxMA3yIbr',
    //         type: 'teacher',
    //         sendToSpecific: true,
    //         ids: [ 'Pf9V5eaE5' ] },
    //         template: 'template3',
    //         templateData: 
    //         [ { key: 'topic', value: 'Moment' },
    //         { key: 'topicColor', value: 'Blue' },
    //         { key: 'image',
    //             value: 'https://edumonk-moments.s3.ap-south-1.amazonaws.com/1575264461988_nutrition_chart_101.jpg' },
    //         { key: 'title', value: 'This is title' },
    //         { key: 'subtitle', value: 'this is desciption' },
    //         { key: 'icon',
    //             value: 'https://edumonk-moments.s3.ap-south-1.amazonaws.com/1575264490360_nutrition_chart_101.jpg' } ],
    //         notification: 
    //         { title: 'demo notice',
    //         body: 'this sis just a demo',
    //         data: 
    //             [ { key: 'notificationImage',
    //                 value: 'https://edumonk-moments.s3.ap-south-1.amazonaws.com/1575264513161_nutrition_chart_101.jpg' } ] } },
    //     json: true 
    // };
    // request(options, function (error, response, body) {
    // if (error) throw new Error(error);
    // console.log(body);
    // });
    // return res.send("Success");
}