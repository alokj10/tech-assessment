import express  from 'express';
import { McqController, CategoryController, SkillController,
         CandidateController, AdminTestController, InviteController } from './Controllers/admin';
import { TestInviteController } from './Controllers/candidate';

let api = express.Router();

/* Admin Routes */
/* mcq endpoints */
api.get('/admin/getAllMcqs', McqController.GetAll);
api.post('/admin/mcq', McqController.Add);
api.put('/admin/mcq', McqController.Update);
api.delete('/admin/mcq', McqController.Delete);

/* category endpoints */
api.get('/admin/getAllCategories', CategoryController.GetAll);
api.post('/admin/category', CategoryController.Add);
api.put('/admin/category', CategoryController.Update);
api.delete('/admin/category', CategoryController.Delete);

/* skill endpoints */
api.get('/admin/getAllSkills', SkillController.GetAll);
api.post('/admin/skill', SkillController.Add);
api.delete('/admin/category', SkillController.Delete);

/* candidate endpoints */
api.get('/admin/getAllCandidates', CandidateController.GetAll);
api.post('/admin/candidate', CandidateController.Add);
api.put('/admin/candidate', CandidateController.Update);
api.post('/admin/sendInvite', CandidateController.SendInvite);
api.delete('/admin/candidate', CandidateController.Delete);

/* Admin Test endpoints */
api.get('/admin/getAllTests', AdminTestController.GetAll);
api.get('/admin/getTest', AdminTestController.GetTest);
api.post('/admin/test', AdminTestController.Add);
api.put('/admin/test', AdminTestController.Update);
api.delete('/admin/test', AdminTestController.Delete);

/* Candidate Routes */
/* Test Invite endpoints */
api.post('/candidate/startTest', TestInviteController.StartTest);

export default api;