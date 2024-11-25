'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mysqldb = require('../db/mysqldb');

var _mysqldb2 = _interopRequireDefault(_mysqldb);

var _users = require('../users');

var _users2 = _interopRequireDefault(_users);

var _RoleDefinitions = require('../commons/RoleDefinitions');

var _McqQueries = require('../commons/RoleBasedQueries/McqQueries');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // import db from './db';


var McqModel = function McqModel() {
    //this.initializeCollection();

    var _this = this;

    _classCallCheck(this, McqModel);

    this.entityName = 'mcq';
    this.entities = {};

    this.entityModel = function (dbObject) {
        var model = {
            // id: dbObject['$loki'],
            id: dbObject.id,
            mcq_meta: {
                author: dbObject.mcq_meta.addedBy,
                category: dbObject.mcq_meta.category,
                choices: dbObject.mcq_meta.choices,
                correctAnswer: dbObject.mcq_meta.correctAnswer,
                description: dbObject.mcq_meta.description,
                minimumExperience: dbObject.mcq_meta.minimumExperience,
                maximumExperience: dbObject.mcq_meta.maximumExperience,
                question: dbObject.mcq_meta.question,
                score: dbObject.mcq_meta.score,
                skill: dbObject.mcq_meta.skill
            }
        };
        // dbObject.mcq_meta.choices.map((choice, index) => {
        //     model.mcq_meta.choices.push(choice);
        // });
        return model;
    };

    this.GetAll = function (userEntity) {
        var queryConfig = (0, _RoleDefinitions.GetQueryConfig)(_McqQueries.VIEW_MCQS);
        return (0, _RoleDefinitions.HandlePromise)(_mysqldb2.default, queryConfig, userEntity);

        /*return new Promise((resolve, reject) => {
            
            this.initializeCollection().then((res) => {
                if(userEntity && userEntity.role === users.UserRoles.admin) {
                    console.log(this.entities.data.length);
                    let entityModelCollection = [];
                    console.log('entities',this.entities);
                    this.entities.data.map((mcq, index) => {
                        let entityModel = this.entityModel(mcq);
                        entityModelCollection.push(entityModel);
                    });
                    resolve(entityModelCollection);
                }
                else {
                    resolve(this.GetMcqsByUser(userEntity));
                }
            });
        })*/
    };

    this.GetMcqsBySkill = function (userEntity, skill) {
        var queryConfig = (0, _RoleDefinitions.GetQueryConfig)(_McqQueries.VIEW_MCQS_BY_SKILL);
        return (0, _RoleDefinitions.HandlePromiseWithParams)(_mysqldb2.default, queryConfig, { userEntity: userEntity, skill: skill });
    };

    this.GetMcqsByGrade = function (userEntity, grade) {
        var queryConfig = (0, _RoleDefinitions.GetQueryConfig)(_McqQueries.VIEW_MCQS_BY_GRADE);
        return (0, _RoleDefinitions.HandlePromiseWithParams)(_mysqldb2.default, queryConfig, { userEntity: userEntity, grade: grade });
    };

    this.BulkAddMcq = function (jsonData) {
        return new Promise(function (resolve, reject) {
            var mcqs = jsonData.mcqs;
            if (mcqs && mcqs.length > 0) {
                mcqs.map(function (item, index) {
                    item.mcq_meta.addedBy = jsonData.addedBy;
                    _this.Add(item.mcq_meta).then(function (res) {
                        console.log('mcq added');
                    }).catch(function (error) {
                        console.log('mcq add failed: ' + error);
                    });
                });
            }
            resolve(true);
        });
    };

    this.Add = function (entity) {
        return new Promise(function (resolve, reject) {
            console.log('mcq insert called');
            var correctOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (entity.correctAnswer && correctOptions.indexOf(entity.correctAnswer) > -1) {
                if (entity.choices && entity.choices.length > 0) {
                    entity.choices.map(function (choice, chIndex) {
                        if (chIndex === correctOptions.indexOf(entity.correctAnswer)) {
                            choice.isCorrect = true;
                        } else {
                            choice.isCorrect = false;
                        }
                        if (!choice.key) {
                            choice.key = correctOptions[chIndex];
                        }
                        if (choice.content && choice.content.indexOf('"')) {
                            console.log('escaping double quotes from choice content');
                            choice.content = choice.content.replace(/\"/g, '<doublequotes>');
                        }
                    });
                }
            }
            if (entity.description && entity.description.indexOf('"') > -1) {
                console.log('escaping double quotes');
                entity.description = entity.description.replace(/\"/g, '<doublequotes>');
            }
            if (entity.choices && entity.choices.length > 0) {
                entity.choices.map(function (choice, chIndex) {
                    console.log('choice ' + chIndex + ': ' + choice.content);
                    console.log('choice type ' + (typeof choice === 'undefined' ? 'undefined' : _typeof(choice)));
                    if (choice.content && choice.content.indexOf('"') > -1) {
                        console.log('escaping double quotes from choice content');
                        choice.content = choice.content.replace(/\"/g, '<doublequotes>');
                    }
                });
            }
            var mcqEntity = {
                mcq_meta: entity,
                skill: entity.skill,
                category: entity.category,
                addedBy: entity.createdBy
                //return;
                //   db.insert(this.entityName, entity)
            };_mysqldb2.default.insertCustom(_this.entityName, mcqEntity).then(function (insertId) {
                resolve(insertId);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.GetMcqByDescription = function (userEntity, description) {
        var queryConfig = (0, _RoleDefinitions.GetQueryConfig)(_McqQueries.VIEW_MCQS_BY_DESCRIPTION);
        return (0, _RoleDefinitions.HandlePromiseWithParams)(_mysqldb2.default, queryConfig, { userEntity: userEntity, description: description });
    };

    this.AddAcademicMcq = function (entity) {
        return new Promise(function (resolve, reject) {
            console.log('mcq insert called');
            var correctOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (entity.correctAnswer && correctOptions.indexOf(entity.correctAnswer) > -1) {
                if (entity.choices && entity.choices.length > 0) {
                    entity.choices.map(function (choice, chIndex) {
                        if (chIndex === correctOptions.indexOf(entity.correctAnswer)) {
                            choice.isCorrect = true;
                        } else {
                            choice.isCorrect = false;
                        }
                        if (!choice.key) {
                            choice.key = correctOptions[chIndex];
                        }
                    });
                }
            }
            var mcqEntity = {
                mcq_meta: entity,
                grade: entity.grade,
                subject: entity.subject,
                category: entity.category,
                addedBy: entity.createdBy

                //   db.insert(this.entityName, entity)
            };_mysqldb2.default.insertCustom(_this.entityName, mcqEntity).then(function (insertId) {
                resolve(insertId);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.GetMcqsByIds = function (selectedMcqs) {
        return new Promise(function (resolve, reject) {
            var mcqIds = [];
            selectedMcqs.forEach(function (selectedMcq) {
                mcqIds.push(selectedMcq.mcqId);
            });
            _mysqldb2.default.getByIds(_this.entityName, mcqIds).then(function (mcqs) {
                var mcqsWithIndex = [];
                if (mcqs && mcqs.length > 0) {
                    mcqs.map(function (mcqItem) {
                        var matchingSelectedMcq = selectedMcqs.filter(function (smItem) {
                            return smItem.mcqId === mcqItem.id;
                        });

                        if (matchingSelectedMcq && matchingSelectedMcq.length > 0) {
                            mcqsWithIndex.push(_extends({
                                questionOrderIndex: matchingSelectedMcq[0].questionOrderIndex
                            }, mcqItem));
                        }
                    });
                }

                resolve(mcqsWithIndex);
                // resolve(mcqs);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.GetMcqsByMcqIds = function (mcqIds) {
        return new Promise(function (resolve, reject) {
            _mysqldb2.default.getByIds(_this.entityName, mcqIds).then(function (mcqs) {
                resolve(mcqs);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.GetMcqById = function (mcqId) {
        console.log('mcqentity', mcqId);
        return new Promise(function (resolve, reject) {
            _mysqldb2.default.findOne(_this.entityName, mcqId).then(function (mcqs) {
                if (mcqs && mcqs.length > 0) {
                    console.log('mcqentity', mcqs[0]);
                    resolve(mcqs[0]);
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.Update = function (entity) {
        return new Promise(function (resolve, reject) {
            // let mcqs = this.initializeCollection();
            _mysqldb2.default.update(_this.entityName, entity.mcq_meta, entity.id).then(function (res) {
                resolve(res);
            });
            /*
            let mcqToUpdate = this.entities.find({ '$loki': entity.$loki });
            if(mcqToUpdate && mcqToUpdate.length > 0) {
                mcqToUpdate[0].title = entity.title;
                mcqToUpdate[0].description = entity.description;
                if(entity.user) {
                    mcqToUpdate[0].updatedBy = entity.emailId;
                }
                this.entities.update(mcqToUpdate[0]);
                db.saveDatabase(() => {
                  this.EmailSnapshot('CategoryAdd');
              });
                        resolve(true);
            }
            else {
                console.log('nothing to update');
                reject("nothing to update");
            }*/
        });
    };

    this.DeleteByIds = function (mcqIds) {
        return new Promise(function (resolve, reject) {
            _mysqldb2.default.deleteByIds(_this.entityName, mcqIds).then(function (res) {
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.DeleteById = function (mcqId) {
        return new Promise(function (resolve, reject) {
            _mysqldb2.default.delete(_this.entityName, mcqId).then(function (res) {
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.Delete = function (entity) {
        return new Promise(function (resolve, reject) {
            _mysqldb2.default.delete(_this.entityName, entity.id).then(function (res) {
                resolve(entity.mcq_meta);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    this.initializeCollection = function () {
        var promise = new Promise(function (resolve, reject) {
            _mysqldb2.default.getCollection(_this.entityName).then(function (res) {
                _this.entities = res;
                resolve(_this.entities);
            }).catch(function (err) {
                console.log('error occurred: ', err);
                reject(err);
            });
        });
        return promise;
    };
}
/*GetMcqsByUser = (userEntity) => {
    if(this.entities.data && this.entities.data.length > 0 && userEntity) {
        let filteredMcqs = this.entities.data.filter((item, index) => {
            return item.mcq_meta.addedBy = userEntity.emailId;
        });
        console.log(filteredMcqs.length);
        let entityModelCollection = [];
        filteredMcqs.map((mcq, index) => {
            let entityModel = this.entityModel(mcq);
            entityModelCollection.push(entityModel);
        });
        return entityModelCollection;
    }
    return [];
}*/

// initializeCollection = () => {
//   this.entities = db.getCollection('mcqs');
//   if(!this.entities) {
//       this.entities = db.addCollection('mcqs');
//   }
//   console.log('mcq entity initialized', this.entities.data.length);
// }
;

exports.default = McqModel;
//# sourceMappingURL=McqModel.js.map