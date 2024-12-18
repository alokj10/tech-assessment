import db from '../db/mysqldb';
import queries from '../db/queries';

import { GetQueryConfig, 
    HandlePromise, 
    HandlePromiseWithParams} from '../commons/RoleDefinitions';
import { VIEW_TESTS, VIEW_MY_TESTS, VIEW_TESTS_BY_ID,
    VIEW_TESTS_AVAILABLE_FOR_ME, VIEW_TESTS_FOR_GRADE } from '../commons/RoleBasedQueries/TestQueries';

class TestModel {
    entityName = 'tests';
    entities = {};
    
    GetAll = (userEntity) => {
        let queryConfig = GetQueryConfig(VIEW_TESTS);
        return HandlePromise(db, queryConfig, userEntity);
    }
    
    GetMy = (userEntity) => {
        let queryConfig = GetQueryConfig(VIEW_MY_TESTS);
        return HandlePromise(db, queryConfig, userEntity);
    }
    
    GetTestsAvailableForMe = (userEntity, grade) => {
        let queryConfig = GetQueryConfig(VIEW_TESTS_AVAILABLE_FOR_ME);
        return HandlePromiseWithParams(db, queryConfig, { userEntity, grade });
    }
    
    GetTestsForGrade = (userEntity, grade) => {
        let queryConfig = GetQueryConfig(VIEW_TESTS_FOR_GRADE);
        return HandlePromiseWithParams(db, queryConfig, { userEntity, grade });
    }
    
    GetTestById = (userEntity, testId) => {
        let queryConfig = GetQueryConfig(VIEW_TESTS_BY_ID);
        return HandlePromise(db, queryConfig, { userEntity: userEntity, testId: testId });
    }
    
    DeleteTestById = (testId) => {
        return new Promise((resolve, reject) => {
            db.delete(this.entityName, testId)
               .then((res) => {
                   resolve();
               })
               .catch((error) => {
                   reject(error);
               })
        });
    }

    GetTest = (testId) => {
        return new Promise((resolve, reject) => {
            db.findOne(this.entityName, testId)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
        })
    }

    DeleteMcqFromTestsIfExists = (mcqId) => {
        // return new Promise((resolve, reject) => {

        // })
    }

    serializeToJson = (data) => {
        console.log('test data', data);
        let test_meta = data['test_meta'];
        // test_meta = test_meta.replace(/\n/g, "\\n");
        // test_meta = test_meta.replace(/\r/g, "\\r");
        // test_meta = test_meta.replace(/\t/g, "\\t");
        let output = {};
        output.id = data.id;
        output['test_meta'] = JSON.parse(test_meta);
        return output;
        // output['user_meta'] = JSON.parse(data['user_meta']);
       /* let outputArray = [];
        console.log('data count', data.length);
        if(data && data.length > 0) {
            data.map((item, index) => {

                let test_meta = item['test_meta'];
                test_meta = test_meta.replace(/\n/g, "\\n");
                test_meta = test_meta.replace(/\r/g, "\\r");
                test_meta = test_meta.replace(/\t/g, "\\t");
                let output = {};
                output.id = item.id;
                output['test_meta'] = JSON.parse(test_meta);
                output['user_meta'] = JSON.parse(item['user_meta']);
                outputArray.push(output);
            })
        }
        return outputArray;*/
    }

    GetCandidatesByTestId = (testId) => {
        return new Promise((resolve, reject) => {
            let sql = queries.getCandidatesByTestId(testId);
            db.executeQuery(sql).then((res) => {
                // resolve(res);
                resolve(this.mapCandidatesResult(res));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    GetStudentsByTestId = (testId) => {
        return new Promise((resolve, reject) => {
            let sql = queries.getStudentsByTestId(testId);
            db.executeQuery(sql).then((res) => {
                resolve(this.mapCandidatesResult(res));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    mapCandidatesResult = (data) => {
            let outputArray = [];
            console.log('data count', data.length);
            if(data && data.length > 0) {
                data.map((item, index) => {
                    let output = {};
                    Object.keys(item).map((prop) => {
                        if(prop === 'response_meta') {
                            let metaObj = item[prop];
                            if(metaObj) {
                                metaObj = metaObj.replace(/\n/g, "\\n");
                                metaObj = metaObj.replace(/\r/g, "\\r");
                                metaObj = metaObj.replace(/\t/g, "\\t"); 
                                let mObj = JSON.parse(metaObj);
                                Object.keys(mObj).forEach((metaProp) => {
                                    output[metaProp] = mObj[metaProp];
                                })
                            }
                        }
                        else {
                            output[prop] = item[prop];
                        }
                    })
                    outputArray.push(output);
                })
            }
            return outputArray;
    }

    mapStudentsResult = (data) => {
        let outputArray = [];
        console.log('data count', data.length);
        if(data && data.length > 0) {
            data.map((item, index) => {
                let output = {};
                Object.keys(item).map((prop) => {
                    if(prop === 'response_meta') {
                        let metaObj = item[prop];
                        if(metaObj) {
                            metaObj = metaObj.replace(/\n/g, "\\n");
                            metaObj = metaObj.replace(/\r/g, "\\r");
                            metaObj = metaObj.replace(/\t/g, "\\t"); 
                            let mObj = JSON.parse(metaObj);
                            Object.keys(mObj).forEach((metaProp) => {
                                output[metaProp] = mObj[metaProp];
                            })
                        }
                    }
                    if(prop === 'evaluation_meta') {
                        let metaObj = item[prop];
                        if(metaObj) {
                            metaObj = metaObj.replace(/\n/g, "\\n");
                            metaObj = metaObj.replace(/\r/g, "\\r");
                            metaObj = metaObj.replace(/\t/g, "\\t"); 
                            let mObj = JSON.parse(metaObj);
                            Object.keys(mObj).forEach((metaProp) => {
                                output[metaProp] = mObj[metaProp];
                            })
                        }
                    }
                    else {
                        output[prop] = item[prop];
                    }
                })
                outputArray.push(output);
            })
        }
        return outputArray;
    }

    Add = (entity) => {
        entity.status = "DRAFT";
        entity.addedOn = (new Date()).toLocaleDateString();
        return new Promise((resolve, reject) => {
            db.insert(this.entityName, entity);
            resolve(true);
        });
    }
    
    AddCustom = (entity) => {
        return new Promise((resolve, reject) => {
            db.insertCustom(this.entityName, entity)
               .then((insertId) => {
                   resolve(insertId);
               })
               .catch((error) => {
                   reject(error);
               })
        });
    }

    Update = (entity) => {
        entity.test_meta.updatedOn = (new Date()).toLocaleDateString();
        if(entity.test_meta.selectedMcqs && entity.test_meta.selectedMcqs.length > 0) {
            entity.test_meta.selectedMcqs.map((item, index) => {
                item.questionOrderIndex = index;
            })
        }
        return new Promise((resolve, reject) => {
            db.update(this.entityName, entity.test_meta, entity.id).then((res) => {
                resolve(res);
            });
        });
    }

    initializeCollection = () => {
        var promise = new Promise((resolve, reject) => {
            db.getCollection(this.entityName)
                .then((res) => {
                    this.entities = res;
                    resolve(this.entities);
                }).catch((err) => {
                    console.log('error occurred: ', err);
                    reject(err);
                })
        });
        return promise;
    }
}
export default TestModel;