'use strict';

var _ServerConfig = require('../commons/ServerConfig');

var jwt = require("jsonwebtoken");


var resources = [{
    resource: '/admin/getAllMcqs',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/mcq',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/bulkMcq',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/getAllCategories',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/category',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/getAllSkills',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/skill',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/candidate/sendInvite',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/getAllTests',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/getTest',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/test',
    allowedRoles: ['admin', 'recruiter']
}, {
    resource: '/admin/getAllUsers',
    allowedRoles: ['admin']
}, {
    resource: '/admin/user',
    allowedRoles: ['admin']
}, {
    resource: '/candidate/startTest',
    allowedRoles: ['admin', 'candidate']
}];

module.exports = function (req, res, next) {
    var token = req.headers["x-access-token"] || req.headers["authorization"];
    var requestedPath = req.path;
    console.log('requested path: ', requestedPath);
    // console.log('auth middleware check', token);
    if (!token || token === "null") {
        console.log('token missing', token);
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        //if can verify the token, set req.user and pass to next middleware
        // console.log('verifying with token', token);
        var decoded = jwt.verify(token, _ServerConfig.AuthConfig.myPrivateKey);
        req.user = decoded;
        console.log('user: ', req.user);
        if (req.user && req.user.role) {
            var currentUserRole = req.user.role;
            // console.log('current user role: ', currentUserRole);
            var currentResource = resources.filter(function (item, index) {
                // console.log('checking item', item.resource);
                return item.resource === requestedPath;
            });
            if (currentResource && currentResource.length > 0) {
                if (currentResource[0].allowedRoles.includes(currentUserRole)) {
                    console.log("authorized");
                    next();
                } else {
                    console.log('not authorized');
                    res.status(401).send('User is not authorized to perform requested operation');
                }
            } else {
                console.log('not found');
                return res.status(404).send("Not Found");
            }
        } else {
            console.log('role missing');
            res.status(401).send('User role is missing');
        }
    } catch (ex) {
        console.log('exception in authorization', req.user);
        res.status(401).send("Invalid token.");
    }
};
//# sourceMappingURL=auth.js.map