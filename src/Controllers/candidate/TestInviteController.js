// import db from '../../db';
import db from '../../db/mysqldb';
import AdminTestController from '../admin/AdminTestController';
// import Constants from '../../commons/Constants';
import InvitationModel from '../../Models/InvitationModel';
import { EmailConfig, Constants } from '../../commons/ServerConfig';
import EmailHelper from '../../commons/EmailHelper';
import CandidateModel from '../../Models/CandidateModel';
import TestModel from '../../Models/TestModel';
import McqModel from '../../Models/McqModel';
import McqResponseModel from '../../Models/McqResponseModel';
import Evaluator from '../../commons/Evaluator';
import users from '../../users';
import DbConfig from '../../commons/DbConfig';
import candidateRepo from './CandidateRepo';
import invitationRepo from './InvitationRepo';

class TestInviteController {

    GetAll = (req, resp) => {
        console.log('get all invitations called', req.user);
        let model = new InvitationModel();
        model.GetAllInvitations(req.user).then((res) => {
            resp.status(200).json(res);
        }).catch((err) => {
            console.log('error occurred in get invitations', err);
            var obj = { status: 500, message: err };
            resp.status(500).send(obj);
        });
    }

    GetInvitation = (req, resp) => {
        console.log('get invitation called', req.body);
        console.log(req.body.invitationId);
        let model = new InvitationModel();
        model.GetInvitation(req.body.invitationId).then((res) => {
            resp.status(200).json(res);
        }).catch((err) => {
            var obj = { status: 500, message: err };
            resp.status(500).send(obj);
        });
    }

    AuthenticateCandidate = (req, resp, done) => {
        console.log('authenticate candidate called');
        console.log(req.body);
        let { invitationId } = req.body;
        let invitationModel = new InvitationModel();
        invitationModel.GetCandidateInfoByInvitationId(invitationId)
            .then((candidateInfo) => {
                if (candidateInfo) {
                    let userEntity = {
                        id: candidateInfo.candidateId,
                        emailId: candidateInfo.candidateEmail,
                        name: candidateInfo.candidateName ? candidateInfo.candidateName : candidateInfo.candidateEmail,
                        role: users.UserRoles.candidate
                    };
                    console.log('candidate found', userEntity);
                    req.user = userEntity;
                    done(null, userEntity);
                }
                else {
                    console.log('unknown candidate login being attempted');

                    const newUser = {
                        emailId: emailId,
                        status: 'not found',
                        name: emailId,
                        role: 'guest'
                    }

                    done(null, newUser);
                }
            });

    }

    UpdateInvite = (req, resp) => {
        console.log('update invite called');
        console.log(req.body);
        let inviteId = req.body.id;
        let newEntity = req.body.invitation_meta;
        let model = new InvitationModel();
        model.Update(req.body).then((entity) => {
            resp.status(200).send(entity);
        }).catch((err) => {
            resp.status(500).send(err);
        });
    }

    StartTest = async (req, resp) => {
        console.log('start test called');
        let { invitationId } = req.body;
        console.log('req.body', req.body);

        let invitationModel = new InvitationModel();
        let invitationEntity = await invitationModel.GetInvitation(invitationId);
        //.then((invitationEntity) => {
        if (!invitationEntity) {
            resp.status(404).json({
                message: "Not found"
            });
        }
        else {
            let testModel = new TestModel();
            let mcqModel = new McqModel();
            let mcqResponseModel = new McqResponseModel();

            let invitationStatus = invitationEntity.invitation_meta.status;
            if (invitationStatus && invitationStatus === 'COMPLETED') {
                resp.status(200).json({
                    message: 'Response for this test is already submitted and the same has been shared with recruiter.'
                });
                return;
            }

            let testEntity = await testModel.GetTest(invitationEntity.invitation_meta.testId);
            let mcqResponseEntity = await mcqResponseModel.GetByInvitationId(invitationId);
            if (mcqResponseEntity) {
                console.log('existing mcq response returned');
                resp.status(200).json(mcqResponseEntity);
            }
            else {
                let mcqResponseMeta = await candidateRepo.createNewMcqResponseMeta(testEntity, invitationEntity);
                let mcqResponse = await candidateRepo.startNewTest(invitationEntity, mcqResponseMeta);
                if (mcqResponse) {
                    resp.status(200).json(mcqResponse);
                }
                else {
                    resp.status(500).json({ message: 'Error in loading Test' });
                }
            }

        }

    }

    RegisterForTest = (req, resp) => {
        console.log('RegisterForTest called');
        let { testId } = req.body;
        let invitees = [{
            emailId: req.user.emailId,
            name: req.user.name
        }]

        invitationRepo.sendInvite(req.user.id, invitees, testId)
            .then(async () => {
                let testModel = new TestModel();
                let testEntity = await testModel.GetTest(testId);    
                resp.status(200).json(testEntity);
            })
            .catch((err) => {
                let response = { message: 'Error occured in register for test:' + err };
                console.log(response);
                resp.status(500).json(response);
                return;
            });
    }

    SendInvite = (req, resp) => {
        console.log('send invite called');
        console.log(req.body);
        // let entity = req.body.invitation_meta;
        let { testId, invitees } = req.body;
        if(!invitees || (invitees && invitees.length === 0)) {
            let response = { message: 'No invitees to send email to.' };
            console.log(response);
            resp.status(500).json(response);
            return;
        }

        invitationRepo.sendInvite(req.user.id, invitees, testId)
            .then(async () => {
                let testModel = new TestModel();
                let testEntity = await testModel.GetTest(testId);    
                resp.status(200).json(testEntity);
            })
            .catch((err) => {
                let response = { message: 'Error occured in sending invite:' + err };
                console.log(response);
                resp.status(500).json(response);
                return;
            });
        // let invitationModel = new InvitationModel();
        // let candidateModel = new CandidateModel();
        // let testModel = new TestModel();
        // let dbConfig = new DbConfig();

        // let siteUrl = '';
        // dbConfig.Initialize().then((KeyValues) => {
        //     siteUrl = KeyValues ?
        //         (KeyValues.site_url ? KeyValues.site_url : '') : '';
        // })

        // let emailIds = entity.emailTo.split(";");
        /*if (emailIds && emailIds.length > 0) {
            emailIds.map((emailId, index) => {
                let candidateMeta = {
                    name: entity.name,
                    email: emailId
                }
                candidateModel.Add(candidateMeta).then((candidateId) => {
                    testModel.GetTest(entity.testId).then((testEntity) => {
                        let invitationEntity = {
                            candidateId: candidateId,
                            testId: testEntity.id,
                            createdBy: req.user.id
                        }
                        invitationModel.Add(invitationEntity).then((invitationId) => {
                            let emailInfo = {
                                to: emailId,
                                subject: entity.emailSubject,
                                testName: testEntity.test_meta.testName,
                                testDuration: testEntity.test_meta.duration,
                                testLink: EmailConfig.getTestLink(dbConfig.KeyValues.site_url, invitationId),
                                faqLink: EmailConfig.getFaqLink(dbConfig.KeyValues.site_url, dbConfig.KeyValues.faq_link),
                                notificationType: 'test'
                            };
                            let emailHelper = new EmailHelper();
                            emailHelper.SendEmail(emailInfo);
                            resp.status(200).json(testEntity);
                        })
                    });
                }).catch((err) => {
                    resp.status(500).json({ message: 'error occured in sending invite:' + err });
                });
            });
        }*/

    }

    CaptureResponse = (req, resp) => {
        console.log('Capture response called');
        console.log(req.body);
        let entity = req.body;
        let mcqResponseModel = new McqResponseModel();
        mcqResponseModel.Update(entity).then((updatedRecord) => {
            console.log('Response captured');
            resp.status(200).json(updatedRecord);
        }).catch((err) => {
            console.log('Exception occurred in Capturing response', err);
            resp.status(500).json({ message: `Error in capturing response: ${err}` });
        });
    }

    getCurrentDateTime = () => {
        let finalStr = '';
        let dt = new Date();
        finalStr = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
        // finalStr += ` ${dt.getHours()}:${dt.getMinutes()}`;
        let h = (dt.getHours() < 10 ? '0' : '') + dt.getHours(),
            m = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
        finalStr += ` ${h}:${m}`;
        return finalStr;
    }

    SubmitAnswers = (req, resp) => {
        console.log('Submit answers called');
        console.log(req.body);
        let entity = req.body;
        let mcqResponseModel = new McqResponseModel();
        let invitationModel = new InvitationModel();

        mcqResponseModel.Update(entity).then((updatedRecord) => {
            console.log('All Responses submitted');
            invitationModel.GetInvitation(entity.response_meta.invitationId).then((invitationEntity) => {

                invitationEntity.invitation_meta.completedOn = this.getCurrentDateTime();
                invitationEntity.invitation_meta.status = Constants.InvitationTestStatus.Completed;
                invitationModel.Update(invitationEntity).then((res) => {
                    resp.status(200).json({ message: Constants.CandidateThanksMessage });
                })
            })
        }).catch((err) => {
            console.log('Exception occurred in submitting answers', err);
            resp.status(500).json({ message: `Error in submitting answers: ${err}` });
        });
    }

    EvaluateAnswers = (req, resp) => {
        console.log('Evaluate answers called by', req.user);
        console.log(req.body);
        let responseId = req.body.responseId;
        let mcqResponseModel = new McqResponseModel();
        mcqResponseModel.GetMcqResponse(responseId).then((mcqResponse) => {
            let evaluator = new Evaluator();
            evaluator.Evaluate(mcqResponse).then((evaluatedMcqResponse) => {
                mcqResponseModel.Update(evaluatedMcqResponse).then((updatedEntity) => {
                    console.log('Evaluation done');
                    // this.GetAll(req, resp);

                    let model = new InvitationModel();
                    model.GetAllInvitations(req.user).then((res) => {
                        resp.status(200).json(res);
                    }).catch((err) => {
                        console.log('error occurred in get invitations', err);
                        var obj = { status: 500, message: err };
                        resp.status(500).send(obj);
                    });
                }).catch((err) => {
                    console.log('Error in evaluation: ', err);
                    res.status(500).json({ message: 'Error in evaluation: ' + err });
                })
            });
        })
    }

}

export default new TestInviteController();