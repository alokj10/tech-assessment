'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mysqldb = require('../../db/mysqldb');

var _mysqldb2 = _interopRequireDefault(_mysqldb);

var _BaseController2 = require('../BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _TestModel = require('../../Models/TestModel');

var _TestModel2 = _interopRequireDefault(_TestModel);

var _InvitationModel = require('../../Models/InvitationModel');

var _InvitationModel2 = _interopRequireDefault(_InvitationModel);

var _McqModel = require('../../Models/McqModel');

var _McqModel2 = _interopRequireDefault(_McqModel);

var _HelperFunctions = require('../../commons/HelperFunctions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import db from '../../db';


var AdminTestController = function (_BaseController) {
    _inherits(AdminTestController, _BaseController);

    function AdminTestController() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, AdminTestController);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AdminTestController.__proto__ || Object.getPrototypeOf(AdminTestController)).call.apply(_ref, [this].concat(args))), _this), _this.entityName = 'tests', _this.tests = {}, _this.GetAll = function (req, resp) {
            console.log('get all tests called', req.user);
            var model = new _TestModel2.default();
            model.GetAll(req.user).then(function (res) {
                console.log('fetched tests');
                resp.send(res);
            }).catch(function (err) {
                console.log('error in get all tests', err);
                var obj = { status: 500, message: err };
                resp.status(500).send(obj);
            });
        }, _this.GetMy = function (req, resp) {
            console.log('get my tests called', req.user);
            var model = new _TestModel2.default();
            model.GetMy(req.user).then(function (res) {
                console.log('fetched tests');
                resp.send(res);
            }).catch(function (err) {
                console.log('error in get my tests', err);
                var obj = { status: 500, message: err };
                resp.status(500).send(obj);
            });
        }, _this.GetTest = function (req, resp) {
            var testId = req.query.testId;
            console.log('get test called: ' + testId);

            var testModel = new _TestModel2.default();
            testModel.GetTestById(req.user, testId).then(function (testEntity) {
                resp.status(200).send(testEntity);
            }).catch(function (err) {
                console.log('error in get mcqs by test id');
                console.log(err);
                resp.status(500).send(err);
            });
        }, _this.GetTestsAvailableForMe = function (req, resp) {
            console.log('GetTestsAvailableForMe called', req.user);
            var model = new _TestModel2.default();
            var grade = '6';
            model.GetTestsAvailableForMe(req.user, grade).then(function (res) {
                console.log('fetched tests');
                resp.send(res);
            }).catch(function (err) {
                console.log('error in get my tests', err);
                var obj = { status: 500, message: err };
                resp.status(500).send(obj);
            });
        }, _this.GetMcqsByTestId = function (req, resp) {
            var testId = req.query.testId;
            console.log('get mcqs by testid called: ', testId);

            var testModel = new _TestModel2.default();
            testModel.GetTest(testId).then(function (testEntity) {
                if (!testEntity.test_meta.selectedMcqs) {
                    resp.status(200).send([]);
                } else {
                    var selectedMcqIds = [];
                    testEntity.test_meta.selectedMcqs.map(function (item, index) {
                        selectedMcqIds.push({ mcqId: item.mcqId, questionOrderIndex: item.questionOrderIndex });
                    });
                    var mcqModel = new _McqModel2.default();
                    mcqModel.GetMcqsByIds(selectedMcqIds).then(function (mcqs) {
                        if (mcqs && mcqs.length === 0) {
                            console.log('No MCQs found for selected MCQ Ids in Test');
                        }
                        resp.status(200).send(mcqs);
                    }).catch(function (err) {
                        console.log('error in get mcqs by test id');
                        console.log(err);
                        resp.status(500).send(err);
                    });
                }
            });
        }, _this.GetCandidatesByTestId = function (req, resp) {
            var testId = req.query.testId;
            console.log('get candidates by testid called: ', testId);

            var testModel = new _TestModel2.default();
            testModel.GetCandidatesByTestId(testId).then(function (candidates) {
                if (!candidates) {
                    console.log('no candidates found');
                    resp.status(200).send([]);
                } else {
                    console.log('candidates found: ', candidates.length);
                    resp.status(200).send(candidates);
                }
            });
        }, _this.GetStudentsByTestId = function (req, resp) {
            var testId = req.query.testId;
            console.log('get candidates by testid called: ', testId);

            var testModel = new _TestModel2.default();
            testModel.GetStudentsByTestId(testId).then(function (students) {
                if (!students) {
                    console.log('no students found');
                    resp.status(200).send([]);
                } else {
                    console.log('students found: ', students.length);
                    resp.status(200).send(students);
                }
            });
        }, _this.Add = function (req, resp) {
            console.log('Add Test called');
            console.log(req.body);
            var testEntity = req.body;
            testEntity.test_meta.createdOn = (0, _HelperFunctions.getCurrentDateTime)();
            testEntity.test_meta.createdBy = req.user.id;
            testEntity.test_meta.status = 'draft';
            var testModel = new _TestModel2.default();
            testModel.AddCustom(testEntity).then(function (res) {
                resp.status(200).send('success');
            }).catch(function (error) {
                resp.status(500).send(error);
            });
        }, _this.Update = function (req, resp) {
            console.log('update test called');
            console.log(req.body);
            var testModel = new _TestModel2.default();
            var newEntity = req.body;

            testModel.Update(newEntity).then(function (entity) {
                resp.status(200).send(entity);
            }).catch(function (err) {
                resp.status(500).send(err);
            });
        }, _this.UpdateTest = function (testId, newEntity, test_link) {
            console.log(testId);
            if (newEntity && newEntity.invitations && newEntity.invitations.length > 0) {
                var invitations = [];
                newEntity.invitations.map(function (invitation, index) {
                    var filteredInvitations = invitations.filter(function (item, id) {
                        return item.emailTo === invitation.emailTo;
                    });
                    if (filteredInvitations && filteredInvitations.length > 0) {} else {
                        invitation.test_link = test_link;
                        invitations.push(invitation);
                    }
                });
                newEntity.invitations = [];
                newEntity.invitations = invitations;
            }
            _mysqldb2.default.update(_this.entityName, newEntity, testId);
        }, _this.Delete = function (req, resp) {
            console.log('delete test called');
            resp.send('delete test called');
        }, _this.initializeCollection = function () {
            var promise = new Promise(function (resolve, reject) {
                _mysqldb2.default.getCollection(_this.entityName).then(function (res) {
                    _this.tests = res;
                    resolve(_this.tests);
                }).catch(function (err) {
                    console.log('error occurred: ', err);
                    reject(err);
                });
            });
            return promise;
        }, _this.replaceEntity = function (oldEntity, newEntity) {
            if (oldEntity != null) {
                for (var property in newEntity) {
                    if (newEntity.hasOwnProperty(property) && property !== "$loki" && property !== 'meta') {
                        oldEntity[property] = newEntity[property];
                    }
                }
            }
            return oldEntity;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    // Add = (req, resp) => {
    //     console.log('Add Test called');
    //     console.log(req.body);
    //     let { test_meta } = req.body;
    //     test_meta.createdOn = (new Date()).toLocaleDateString();
    //     test_meta.createdBy = req.user.id ? req.user.id : '';
    //     db.insert(this.entityName, req.body.test_meta);
    //     resp.status(200).send('success');
    // }

    return AdminTestController;
}(_BaseController3.default);

exports.default = new AdminTestController();
//# sourceMappingURL=AdminTestController.js.map