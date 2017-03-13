const emailRouter = require('express').Router();
const nodemailer = require('nodemailer');
const jwt =require("jsonwebtoken");
const path = require('path');
const util = require('util');
const cors = require('cors');
const candidates=require('./../jsonData/userDetails.json')
const smptp = require('smtp-server');
const smtpTransport = require('nodemailer-smtp-transport');
const user = require('./databaseSchema');

let userEmailDetails=[];
const transporter = nodemailer.createTransport(smtpTransport({
    service: "Gmail",
    //host: "smtp.gmail.com",
    // port: 465,
    //secure: true,
    auth: {
        user: "samarthyawave16@gmail.com",
        pass: "Samarthya@wave16"
    }
}));
emailRouter.use(cors());

emailRouter.get('/checkEmail',function(req,res){
        let param=req.query;
    user.find({Email:param.Email},function(err,docs){
       if(err){ 
           console.log(err)
            res.json({
            success: false,
            message: 'Technical error ...Please Try later'
        });
        }
       else{
           if(docs.length==0){
                return res.json({
        data:[]
        })
    }
           else{
       return  res.json({
            data:docs[0]
        }); 
       }
       }
   })
})

emailRouter.post('/sendmail', function (req, res) {
    const jsonobj = JSON.parse(req.body.json);
    const redirectLink = jsonobj.redirect;
    const userMail = jsonobj.to;
    const mailBody = jsonobj.mailBody;
    //------------verify-----------
    // expire in 30 minredirectLink
    const token = jwt.sign(jsonobj, 'I AM EMAIL TOKEN', { expiresIn: 600 });
    const link = "http://" + req.get('host');
    //----------verify------------------

    const mailOptions = {
        from: "samarthyawave16@gmail.com",
        to: jsonobj.to,
        subject: jsonobj.subject,
        html: "<h1>SAMARTHYA</h1><br><img src='https://cellpartzone.com/image/catalog/Career.jpg' alt='W3Schools.com'><br><h3 style='color : red'>Confirm your mail and kick start your career by registring youself  with Samarthya<h3> <br><button type='button' style='background-color : green;padding: 14px 25px;'><a style='text-decoration : none;color : white' href=" + link +"/emailverify/verify?username="+jsonobj.to+"&token="+token+"&title="+jsonobj.title+">Confirm here</a></button>"
    }
    let mail;
    if(JSON.parse(req.body.json).subject=='Password Reset'){
        mail=jsonobj;
        mail.html= "<h1>SAMARTHYA</h1><br><img src='https://cellpartzone.com/image/catalog/Career.jpg' alt='W3Schools.com'><br><h3 style='color : red'>Please click below to reset password with Samarthya<h3> <br><button type='button' style='background-color : green;padding: 14px 25px;'><a style='text-decoration : none;color : white' href=" + link +"/emailverify/reset?username="+jsonobj.to+"&token="+token+">Change Password</a></button>"
    }
    else{
        mail=mailOptions;
    }
    transporter.sendMail(mail, function (error, response) {
        if (error) {
            console.log("sending erroer part ", error);
            res.end("error");
        } else {
                let userDetails={"userEmail":jsonobj.to,"token":token};
                let userExist=userEmailDetails.filter(function(item){
                    return item.userEmail==jsonobj.to;
                })
            if(userExist.length==0)
            {
                userEmailDetails.push(userDetails);
            }
            else{
               let index= userEmailDetails.indexOf(jsonobj.to);
                userEmailDetails.splice(index,1);
                userEmailDetails.push(userDetails);
            }    
            res.end("sent");
        }
    });
});

emailRouter.get('/verify', function (req, res) {
    let userToken=req.query.token;
    let user=req.query.username;
   
    let validUser=userEmailDetails.filter(function(valid){
            return valid.userEmail==user && valid.token==userToken;
    });
    console.log(validUser)
    if(validUser.length!=0)
    {
    jwt.verify(userToken,'I AM EMAIL TOKEN', function(err, decoded) {
            if (err) {
                 res.redirect("http://" + req.get('host')+"/login?message=Email Expired");
                // return res.json({ success: false, message: 'Email Expired' });
            } else {
                // if everything is good, save to request for use in other routes
                res.redirect("http://" + req.get('host')+"/register/"+req.query.title+"?email="+req.query.username);
            }
        });
    }
    else{
        res.redirect("http://" + req.get('host')+"/login?message=Click the recent mail");
        // return res.json({ success: false, message: 'Click the recent email' });
    }
});

emailRouter.get('/reset', function (req, res) {
    let userToken=req.query.token;
    let user=req.query.username;
    let validUser=userEmailDetails.filter(function(valid){
            return valid.userEmail==user && valid.token==userToken;
    });
    if(validUser.length!=0)
    {
    jwt.verify(userToken,'I AM EMAIL TOKEN', function(err, decoded) {
            if (err) {
                 res.redirect("http://" + req.get('host')+"/login?message=Email Expired");
                // return res.json({ success: false, message: 'Email Expired' });
            } else {
                // if everything is good, save to request for use in other routes
                res.redirect("http://" + req.get('host')+"/passwordReset?email="+user+"&token="+userToken);
            }
        });
    }
    else{
        res.redirect("http://" + req.get('host')+"/login?message=Click the recent mail");
        // return res.json({ success: false, message: 'Click the recent email' });
    }
});
emailRouter.post('/passwordResetToken',function(req,res){
        let userToken=req.body.token;
            jwt.verify(userToken,'I AM EMAIL TOKEN', function(err, decoded) {
                if(err){
                    console.log(err);
                      res.json({
                          success:false,
                          authToken:null
                      })
                }
                else{
            res.json({
            success: true,
            authToken: userToken
                     });
                }

})
});

// emailRouter.get('/verifiedmail', function (req, res) {
//     console.log(usermail2);
//     res.send({ "usermail2": usermail2 }); // sending email id to candidate register component
// });
// emailRouter.post('/welcome', function (req, res) {
//     const jsonobj = JSON.parse(req.body.json);
//     console.log(jsonobj);
//     redirectLink = jsonobj.redirect;
//     mailBody = jsonobj.mailBody;
//     const mailOptions = {
//         from: "samarthyawave16@gmail.com",
//         to: jsonobj.to,
//         subject: jsonobj.subject,
//         html: `<h1 style='color : indigo'>SAMARTHYA</h1><br>
//         <h3 style='color : green'>Welcome to Samarthya!<h3>
//         <br>
//          <img src='http://www.petalspreschool.com/images/pre-school-career.jpg' alt='image not available' height="300" width="800">
//         <br>Thanks so much for joining us . You’re on your way to super-career and beyond!<br>
//        `
//     }
//     transporter.sendMail(mailOptions, function (error, response) {
//         if (error) {
//             console.log("sending erroer part ", error);
//             res.end("error");
//         } else {
//             console.log("Sending Mail...")
//             //  res.send(link); //send this link to email service to get response
//             res.end("sent");
//         }
//     });
// });
module.exports=emailRouter;