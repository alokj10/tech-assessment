import express  from 'express';
import { McqController, CategoryController, SkillController,
        CandidateController, AdminTestController, InviteController,
        UserController, GradeController } from './Controllers/admin';
import { TestInviteController, TestRegistrationController } from './Controllers/candidate';

import { generateToken, sendToken } from './utils/token.utils';
import passport from 'passport';
import auth from './utils/auth';
import OrgController from './Controllers/admin/OrgController';
import DashboardController from './Controllers/admin/DashboardController';
import CandidateResponseController from './Controllers/admin/CandidateResponseController';
import MediaController from './Controllers/candidate/MediaController';
import multer from 'multer';

import fs from 'fs';
import path from 'path';
import Constants from './commons/Constants';

let api = express.Router();


api.get('/loadConfig', UserController.LoadConfig);
api.get('/validateUserToken', auth, UserController.LoadConfig);

/* Admin Routes */
/* mcq endpoints */
// api.get('/admin/getAllMcqs', McqController.GetAll);
api.get('/admin/getAllMcqs', auth, McqController.GetAll);
api.get('/admin/getMcqsBySkill', auth, McqController.GetMcqsBySkill);
api.get('/admin/getMcqsByGrade', auth, McqController.GetMcqsByGrade);
api.post('/admin/mcq', auth, McqController.Add);
api.put('/admin/mcq', auth, McqController.Update);
api.delete('/admin/mcq', auth, McqController.Delete);
api.delete('/admin/bulkmcq', McqController.BulkDelete);
api.post('/admin/bulkMcq', auth, McqController.BulkMcq);

/* category endpoints */
api.get('/admin/getAllCategories', auth, CategoryController.GetAll);
api.post('/admin/category', auth, CategoryController.Add);
api.put('/admin/category', auth, CategoryController.Update);
api.delete('/admin/category', auth, CategoryController.Delete);

/* skill endpoints */
api.get('/admin/getAllSkills', auth, SkillController.GetAll);
api.post('/admin/skill', auth, SkillController.Add);
api.delete('/admin/skill', auth, SkillController.Delete);

/* class/grade endpoints */
api.get('/admin/getAllGrades', auth, GradeController.GetAll);
api.post('/admin/grade', auth, GradeController.Add);
api.put('/admin/grade', auth, GradeController.Update);
api.delete('/admin/grade', auth, GradeController.Delete);

/* org endpoints */
api.get('/admin/getAllOrgs', auth, OrgController.GetAll);
api.post('/admin/org', auth, OrgController.Add);
api.put('/admin/org', auth, OrgController.Update);
api.delete('/admin/org', auth, OrgController.Delete);

/* Admin Test endpoints */
api.get('/admin/getAllTests', auth, AdminTestController.GetAll);
api.get('/admin/getMyTests', auth, AdminTestController.GetMy);
api.get('/admin/getMcqsByTestId', auth, AdminTestController.GetMcqsByTestId);
api.get('/admin/getCandidatesByTestId', auth, AdminTestController.GetCandidatesByTestId);
api.get('/admin/getStudentsByTestId', auth, AdminTestController.GetStudentsByTestId);
api.get('/admin/getTest', auth, AdminTestController.GetTest);
api.post('/admin/test', auth, AdminTestController.Add);
api.put('/admin/test', auth, AdminTestController.Update);
api.delete('/admin/test', auth, AdminTestController.Delete);

/* User endpoints */
api.get('/admin/getAllUsers', auth,  UserController.GetAll);
api.post('/admin/user', auth, UserController.Add);
api.put('/admin/user', auth, UserController.Update);
api.delete('/admin/user', auth, UserController.Delete);
api.post('/admin/changePassword', auth, UserController.ChangePassword);


/* Online portal endpoints */
api.post('/candidate/user', UserController.AddNewUserToBeVerified);
api.get('/candidate/verifyUser', UserController.VerifyUser);
//let upload = multer({ dest: 'uploads/responseRecordiings' })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('s1', req.files);
        console.log('s2', file);
        // let uploadDir = path.resolve(`uploads/responseRecordiings/${file.fieldname}`);
        let uploadDir = path.resolve(`${Constants.Paths.recordingBaseDir}\\${file.fieldname}`);
        console.log('uploaddir', uploadDir);
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.log('filename', file);
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '_' + file.originalname)
    }
  })
  
let upload = multer({ storage: storage })
api.post('/candidate/submitRecording', upload.any(), MediaController.SubmitRecording);
api.get('/candidate/getRecordingFileNames', MediaController.GetRecordingFileNames);
api.get('/candidate/getRecording', MediaController.GetRecording);

api.post('/teacher/user', UserController.AddNewUserToBeVerified)
api.get('/teacher/verifyUser', UserController.VerifyUser);
api.get('/admin/testsAvailableForMe', auth, AdminTestController.GetTestsAvailableForMe);
api.get('/candidate/getAllRegistrations', auth, TestRegistrationController.GetAllRegistrations);
api.get('/candidate/getMyRegistrations', auth, TestRegistrationController.GetMyRegistrations);
api.post('/candidate/registerForTest', auth, TestRegistrationController.RegisterForTest);
api.post('/candidate/startRegisteredTest', auth, TestRegistrationController.StartRegisteredTest);
api.post('/candidate/submitRegisteredTest', auth, TestRegistrationController.SubmitRegisteredTest);


/* Candidate Response Endpoints */
api.get('/admin/getCandidateResponseReport', auth, CandidateResponseController.GetCandidateResponse);
api.get('/admin/getCandidateDetails', CandidateResponseController.GetCandidateDetails);

/* Candidate Routes */
/* Test Invite endpoints */
api.get('/candidate/getAllInvites', auth, TestInviteController.GetAll);
api.get('/candidate/invitation', TestInviteController.GetInvitation);
api.post('/candidate/sendInvite', auth, TestInviteController.SendInvite);
api.post('/candidate/startTest', auth, TestInviteController.StartTest);
api.post('/candidate/submitAnswers', auth, TestInviteController.SubmitAnswers);
api.post('/candidate/evaluateAnswers', auth, TestInviteController.EvaluateAnswers);
// api.post('/candidate/registerForTest', auth, TestInviteController.RegisterForTest);

api.get('/admin/dashboard/test/count', auth, DashboardController.GetTestCount);
api.get('/admin/dashboard/mcq/count', auth, DashboardController.GetMcqCount);
api.get('/admin/dashboard/invitation/count', auth, DashboardController.GetInvitationCount);
// api.get('/admin/dashboard', auth, DashboardController.GetAllStatistics);

api.get('/admin/auth/google',
    passport.authenticate('google-token', { session: false, scope: ['https://www.googleapis.com/auth/plus.login'] }),
    (req, res, next) => {
        console.log('res next');
        req.auth = req.user;
        if(req.user.status === 'not found') {
            return res.status(403).send('User Not Found');
        }
        next();
    }, generateToken, sendToken);

    
api.post('/admin/auth/local',passport.authenticate('local',{session: false}),
   (req, res, next) => {
    console.log('received local call');
    req.auth = req.user;
        if(req.user.status === 'not found') {
            return res.status(401).send('User Not Found');
        }
        next();
}, generateToken, sendToken);


api.post('/candidate/auth/local',TestInviteController.AuthenticateCandidate,
   (req, res, next) => {
       console.log('returned from authenticate candidate', req.user);
        req.auth = req.user;
        if(req.user.status === 'not found') {
            return res.status(401).send('Candidate Not Registered');
        }
        next();
}, generateToken, sendToken);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
api.get('/admin/auth/google/callback', 
  passport.authenticate('google-token', { failureRedirect: '/login' }),
  function(req, res) {
      console.log('res 3');
    res.redirect('/');
  });

/*
api.route('/admin/auth/callback', (req, resp) => {
    console.log('admin api callback called');
})
api.get('/admin/auth/google',
        passport.authenticate('google-token'), 
        (req, res, next) => {
            console.log('res returned');
            if (!req.user) {
                return res.send(401, 'User Not Authenticated');
            }
            req.auth = {
                id: req.user.id
            };
            next();
        }, 
        generateToken, 
        sendToken);*/
export default api;
