const chromium = require('chrome-aws-lambda')
const pug = require('pug')
const fs = require('fs')
// const path = require('path')
// const fs = require('fs')

const Student = require('../models/student')
const Faculty = require('../models/faculty')
const Guardian = require('../models/guardian')

module.exports =async function(req,res,next){
    var { institutionid } = req.query;
    var students = await Student.find({institution:institutionid});

    const studentsWithDetails = await Promise.all(students.map(async student => {
      const guardians = await Promise.all(student.guardians.map(async g => {
        return Guardian.findOne({_id:g.guardian})
      })); 
  
      if (guardians.every(guardian => guardian.linking.token.status !== 'linked')){
  
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
        return null;
      }
      }));
    const studentsWithUnlinkedGuardians = studentsWithDetails.filter(s => s);
  //  console.log(studentsWithUnlinkedGuardians);
  console.log("start")
    var array =[{name:'qwsw'},{name:'dwdwd'} ,{name:'efsfse'}]
    console.log(array)
    const template = pug.compileFile('./src/template.pug')
    const html = template({array})
    //open puppeteer
    let browser = null
    try{
      browser = await chromium.puppeteer.launch({
        args:chromium.args,
        defaultViewport:chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true
      })
      const page = await browser.newPage()
      page.setContent(html)

    // create pdf file
      let r = Math.random().toString(36).substring(2,7);
      const pdf = await page.pdf({
        path:`./temp/${r}.pdf`,
        format:'A4',
        printBackground: true,
        margin:{top:'1 cm', right: '1 cm', bottom: '1 cm', left:'1 cm'}
      })      
      
      var stat = fs.statSync(`./temp/${r}.pdf`);
      res.setHeader('Content-Length', stat.size);
      
      // res.setHeader("content-type", "application/pdf");
      console.log("end")
      var data = fs.readFileSync(`./temp/${r}.pdf`);
      res.contentType("application/pdf");
      // res.setHeader('Content-Disposition', 'attachment; filename=g.pdf');

      return res.send(data);
      


    // return pdf
    // const response = {
    //   headers: {
    //     'Content-type': 'application/pdf',
    //     'content-disposition': 'attachment; filename=test.pdf'
    //   },
    //   statusCode: 200,
    //   body: pdf.toString('base64'),
    //   isBase64Encoded: true
    // }
    // return res.status(200).send(response);
    // res.succeed(response)
    //console.log("Run till here")
    // return res.status(200).send( studentsWithUnlinkedGuardians)
  }catch(error){
    console.log({error})
    res.status(500).send(error)
      // return context.fail(error)
    }
    finally {
      if (browser !== null) {
        await browser.close()
      }
     }
}