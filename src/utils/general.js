const crypto = require('crypto');
import DbConfig from '../commons/DbConfig';
import Constants from '../commons/Constants';
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

export const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    let obj = {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
    console.log('encrypted: ', obj);
    console.log('encrypted string: ', JSON.stringify(obj));
    return obj;
};

export const decrypt = (hashStringIv, hashStringContent) => {
    console.log('hash string iv: ', hashStringIv);
    console.log('hash string content: ', hashStringContent);

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hashStringIv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hashStringContent, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

export const getSiteUrl = async () => {
    let env11 = process.env.NODE_ENV;
    console.log('env:', env11.toString());
    console.log('env:', 'pppp');
    let domainUrl = 'http://localhost:3000/'
        console.log('returning domain dev url');
        return domainUrl;
    if(env11.toString()==='dev') {
        let domainUrl = 'http://localhost:3000/'
        console.log('returning domain dev url');
        return domainUrl;
    }
    else if(env11==='test') {
        let domainUrl = 'http://localhost:3001/'
        return domainUrl;
    }
    else {
        console.log('returning domain live url');
        let dbConfig = new DbConfig();

        let siteUrl = '';
        let KeyValues = await dbConfig.Initialize();
        siteUrl = KeyValues ? (KeyValues.site_url ? KeyValues.site_url : '') : '';

        return siteUrl;
    }
}

export const getHomePagePath = () => {
    let env = process.env.NODE_ENV;
    let homePage = `${appRoot}\\index.html`;
    console.log('approot', appRoot);
    if(env === 'dev') {
        homePage = path.resolve(homePage,'..\\..\\', 'index.html');
    }
    console.log('homepage', homePage);
    // return homePage;
    return homePage;
}

export const createPrerequisitesDir = () => {
    let uploadsDir = getAbsolutePath(Constants.Paths.uploadBaseDir);
    if(!fs.existsSync(uploadsDir)) {
        console.log('creating upload directory');
        fs.mkdirSync(uploadsDir);
    }
    let responseRecordingDir = getAbsolutePath(Constants.Paths.recordingBaseDir);
    if(!fs.existsSync(responseRecordingDir)) {
        console.log('creating responserecording upload directory');
        fs.mkdirSync(responseRecordingDir);
    }
}

export const getAbsolutePath = (relativePath) => {
    let absolutePath = path.resolve(relativePath);
    return absolutePath;    
}

export const createPasswordHash = (plainPassword) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
}

export const comparePasswordHash = (plainPassword, passwordHash) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainPassword, salt);
    let pHash = bcrypt.hashSync(passwordHash, salt);
    console.log('DBhash', pHash);
    console.log('userhash', hash);
    return pHash === hash;
    // return bcrypt.compareSync(plainPassword, passwordHash);
}

// module.exports = {
//     encrypt,
//     decrypt,
//     getSiteUrl,
//     getHomePagePath
// };