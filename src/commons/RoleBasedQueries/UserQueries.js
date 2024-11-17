import queries from '../../db/queries';
import { handleRoleNotFound, admin, orgadmin, staff, teacher } from '../RoleDefinitions';

export const VIEW_USERS = 'VIEW_USERS'; 

export const VIEW_USERS_QUERY = {
    key: VIEW_USERS,
    value: {
        getSql: (userEntity) => {
            switch(userEntity.role) {
                case admin: {
                    return `SELECT 
                    u.id as 'id',
                    JSON_EXTRACT(u.user_meta, '$') as 'user_meta',
                    JSON_EXTRACT(o.org_meta, '$') as 'org_meta'
                    FROM ta_users u
                    LEFT JOIN ta_org o ON JSON_EXTRACT(u.user_meta, '$.orgId') = o.id
                    `;
                }
                case staff:
                case orgadmin: {
                    return `SELECT 
                        u.id as 'id',
                        JSON_EXTRACT(u.user_meta, '$') as 'user_meta',
                        JSON_EXTRACT(o.org_meta, '$') as 'org_meta'
                        FROM ta_users u
                        LEFT JOIN ta_org o ON JSON_EXTRACT(u.user_meta, '$.orgId') = o.id
                        WHERE JSON_EXTRACT(u.user_meta, '$.orgId') = ${userEntity.orgId}
                    `;        
                }
                case teacher: {
                    return `SELECT 
                    u.id as 'id',
                    JSON_EXTRACT(u.user_meta, '$') as 'user_meta',
                    JSON_EXTRACT(o.org_meta, '$') as 'org_meta'
                    FROM ta_users u
                    LEFT JOIN ta_org o ON JSON_EXTRACT(u.user_meta, '$.orgId') = o.id
                    WHERE JSON_EXTRACT(u.user_meta, '$.role') = 'candidate'
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
                    let output = {};
                    output.id = item.id;
                    // output['user_meta'] = JSON.parse(item['user_meta']);
                    // output['org_meta'] = JSON.parse(item['org_meta']);

                    output['user_meta'] = item['user_meta'];
                    output['org_meta'] = item['org_meta'];

                    outputArray.push(output);
                })
            }
            return outputArray;
        }
    }
}