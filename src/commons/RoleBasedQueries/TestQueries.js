import queries from '../../db/queries';
import { handleRoleNotFound, admin, orgadmin, staff,
        candidate, teacher, student } from '../RoleDefinitions';

export const VIEW_TESTS = 'VIEW_TESTS'; 
export const VIEW_MY_TESTS = 'VIEW_MY_TESTS'; 
export const VIEW_TESTS_BY_ID = 'VIEW_TESTS_BY_ID';
export const VIEW_TESTS_AVAILABLE_FOR_ME = 'VIEW_TESTS_AVAILABLE_FOR_ME';
export const VIEW_TESTS_FOR_GRADE = 'VIEW_TESTS_FOR_GRADE';

export const VIEW_TESTS_QUERY = {
    key: VIEW_TESTS,
    value: {
        getSql: (userEntity) => {
            switch(userEntity.role) {
                case admin: {
                    return `SELECT 
                    JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                    t.id as 'id',
                    JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                    FROM ta_tests t
                    JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                    AND JSON_EXTRACT(t.test_meta, '$.settings.testVisibility') = 'InvitedCandidates'
                    `;
                }
                case staff:
                case orgadmin: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                        FROM ta_tests t
                        JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                        WHERE JSON_EXTRACT(u.user_meta, '$.orgId') = ${userEntity.orgId}
                    `;                                
                }
                case teacher:
                case candidate: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                        FROM ta_tests t
                        JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                        AND JSON_EXTRACT(t.test_meta, '$.settings.testVisibility') = 'Public'
                    `; 
                }
                default: handleRoleNotFound(userEntity.role);
            }
        },
        serializeToJson: (data) => {
            let outputArray = [];
            console.log('data count', data.length);
            if(data && data.length > 0) {
                data.map((item, index) => {
                    // console.log('item', item);
                    let test_meta = item['test_meta'];
                    // test_meta = test_meta.replace(/\n/g, "\\n");
                    // test_meta = test_meta.replace(/\r/g, "\\r");
                    // test_meta = test_meta.replace(/\t/g, "\\t");
                    let output = {};
                    output.id = item.id;
                    // output['test_meta'] = JSON.parse(test_meta);
                    // output['user_meta'] = JSON.parse(item['user_meta']);
                    output['test_meta'] = test_meta;
                    output['user_meta'] = item['user_meta'];
                    outputArray.push(output);
                })
            }
            return outputArray;
        }
    }
}


export const VIEW_MY_TESTS_QUERY = {
    key: VIEW_MY_TESTS,
    value: {
        getSql: (userEntity) => {
            switch(userEntity.role) {
                case admin:
                case staff:
                case teacher:
                case candidate:
                case orgadmin: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                        FROM ta_tests t
                        JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                        WHERE u.id = ${userEntity.id}
                    `;                                
                }
                default: handleRoleNotFound(userEntity.role);
            }
        },
        serializeToJson: (data) => {
            let outputArray = [];
            console.log('data count', data.length);
            if(data && data.length > 0) {
                data.map((item, index) => {

                    let test_meta = item['test_meta'];
                    // test_meta = test_meta.replace(/\n/g, "\\n");
                    // test_meta = test_meta.replace(/\r/g, "\\r");
                    // test_meta = test_meta.replace(/\t/g, "\\t");
                    let output = {};
                    output.id = item.id;
                    // output['test_meta'] = JSON.parse(test_meta);
                    // output['user_meta'] = JSON.parse(item['user_meta']);
                    output['test_meta'] = test_meta;
                    output['user_meta'] = item['user_meta'];
                    outputArray.push(output);
                })
            }
            return outputArray;
        }
    }
}

export const VIEW_TESTS_AVAILABLE_FOR_ME_QUERY = {
    key: VIEW_TESTS_AVAILABLE_FOR_ME,
    value: {
        getSql: (params) => {
            let { userEntity, grade } = params;
            switch(userEntity.role) {
                case admin:
                case staff:
                case teacher:
                case candidate:
                case orgadmin: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                        FROM ta_tests t
                        JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                        WHERE u.id = ${userEntity.id}
                    `;                                
                }
                // case student: {
                //     return `SELECT 
                //         JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                //         t.id as 'id',
                //         JSON_EXTRACT(u.user_meta, '$') as 'user_meta',
                //         tr.id as registrationId,
                //         tr.status as registrationStatus,
                //         tr.scheduled_start as scheduledStart,
                //         tr.created_on as registeredOn,
                //         tr.modified_on as modifiedOn
                //         FROM ta_tests t
                //         JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                //         LEFT JOIN ta_test_registrations tr ON t.id = tr.test_id
                //         WHERE JSON_EXTRACT(t.test_meta, '$.grade') = '${grade}'
                //     `;                                
                // }
                case student: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta'
                        FROM ta_tests t
                        JOIN ta_candidates ca ON t.grade = ca.grade
                        JOIN ta_users u ON ca.user_id = u.id 
                        WHERE
                        JSON_EXTRACT(t.test_meta, '$.status') = 'published'
                        AND t.id NOT IN (SELECT test_id FROM ta_test_registrations tr
                            JOIN ta_candidates can ON tr.candidate_id = can.id
                            JOIN ta_users ui ON can.user_id = ui.id
                            WHERE ui.id = ${userEntity.id}
                            )
                    `;              
                }
                default: handleRoleNotFound(userEntity.role);
            }
        },
        serializeToJson: (data) => {
            let outputArray = [];
            console.log('data count', data.length);
            if(data && data.length > 0) {
                data.map((item, index) => {

                    let test_meta = item['test_meta'];
                    // test_meta = test_meta.replace(/\n/g, "\\n");
                    // test_meta = test_meta.replace(/\r/g, "\\r");
                    // test_meta = test_meta.replace(/\t/g, "\\t");
                    let output = {};
                    output.id = item.id;
                    // output['test_meta'] = JSON.parse(test_meta);
                    // output['user_meta'] = JSON.parse(item['user_meta']);
                    output['test_meta'] = test_meta;
                    output['user_meta'] = item['user_meta'];
                    outputArray.push(output);
                })
            }
            return outputArray;
        }
    }
}

export const VIEW_TEST_BY_ID_QUERY = {
    key: VIEW_TESTS_BY_ID,
    value: {
        getSql: (params) => {
            let { userEntity, testId } = params;
            if(!userEntity) {
                return handleRoleNotFound('null userEntity');
            }
            if(!testId) {
                return handleRoleNotFound('null skill');
            }
            switch(userEntity.role) {
                case teacher:
                case admin: {
                    return `SELECT 
                    JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                    t.id as 'id',
                    JSON_EXTRACT(u.user_meta, '$') as 'user_meta',
                    t.category,
                    t.grade,
                    t.subject
                    FROM ta_tests t
                    JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                    WHERE t.id = ${testId}
                    `;
                }
                case staff:
                case orgadmin: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                        FROM ta_tests t
                        JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                        WHERE JSON_EXTRACT(u.user_meta, '$.orgId') = ${userEntity.orgId}
                        AND t.id = ${testId}
                    `;                                
                }
                case student:
                case candidate: {
                    return `SELECT 
                    JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                    t.id as 'id',
                    JSON_EXTRACT(u.user_meta, '$') as 'user_meta' 
                    FROM ta_tests t
                    JOIN ta_users u ON JSON_EXTRACT(t.test_meta, '$.createdBy') = u.id
                    WHERE t.id = ${testId}
                    AND JSON_EXTRACT(t.test_meta, '$.settings.testVisibility') = 'Public'
                    `;
                }
                default: handleRoleNotFound(userEntity.role);
            }
        },
        serializeToJson: (data) => {
            let outputArray = [];
            console.log('data count', data.length);
            if(data && data.length > 0) {
                data.map((item, index) => {

                    let test_meta = item['test_meta'];
                    // test_meta = test_meta.replace(/\n/g, "\\n");
                    // test_meta = test_meta.replace(/\r/g, "\\r");
                    // test_meta = test_meta.replace(/\t/g, "\\t");
                    let output = {};
                    output.id = item.id;
                    // output['test_meta'] = JSON.parse(test_meta);
                    // output['user_meta'] = JSON.parse(item['user_meta']);
                    output['test_meta'] = test_meta;
                    output['user_meta'] = item['user_meta'];
                    Object.keys(item).forEach((key) => {
                        if(key !== 'test_meta' && key !== 'user_meta') {
                            output[key] = item[key];
                        }
                    })
                    outputArray.push(output);
                })
            }
            return outputArray[0];
        }
    }
}

export const VIEW_TESTS_FOR_GRADE_QUERY = {
    key: VIEW_TESTS_FOR_GRADE,
    value: {
        getSql: (params) => {
            let { userEntity, grade } = params;
            switch(userEntity.role) {
                case admin:
                case staff:
                case teacher:
                case candidate:
                case student:
                case orgadmin: {
                    return `SELECT 
                        JSON_EXTRACT(t.test_meta, '$') as 'test_meta',
                        t.id as 'id',
                        FROM ta_tests t
                        WHERE t.grade = ${grade}
                    `;                                
                }
                default: handleRoleNotFound(userEntity.role);
            }
        },
        serializeToJson: (data) => {
            let outputArray = [];
            console.log('data count', data.length);
            if(data && data.length > 0) {
                data.map((item, index) => {

                    let test_meta = item['test_meta'];
                    // test_meta = test_meta.replace(/\n/g, "\\n");
                    // test_meta = test_meta.replace(/\r/g, "\\r");
                    // test_meta = test_meta.replace(/\t/g, "\\t");
                    let output = {};
                    output.id = item.id;
                    // output['test_meta'] = JSON.parse(test_meta);
                    // output['user_meta'] = JSON.parse(item['user_meta']);
                    output['test_meta'] = test_meta;
                    output['user_meta'] = item['user_meta'];
                    outputArray.push(output);
                })
            }
            return outputArray;
        }
    }
}