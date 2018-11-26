var util=require('../util')
var fs=require('fs')

module.exports={
    "LoginResource":util.resource('login'),
    "LoginResourceGet":util.mock({
        method:"Get",
        auth:"NONE",
        resource:{"Ref":"LoginResource"},
        template:`${__dirname}/info.vm`
    }),
    "InstancesLoginResource":util.resource('instances',{"Ref":"LoginResource"}),
    "AdminLoginResource":util.resource('admin',{"Ref":"LoginResource"}),
    "AdminLoginResourceGet":util.redirect(
        {"Fn::GetAtt":["AdminLogin","href"]},
        {"Ref":"AdminLoginResource"}
    ),
    "UserLoginResource":util.resource('user',{"Ref":"LoginResource"}),
    "UserLoginResourceGet":util.redirect(
        {"Fn::GetAtt":["UserLogin","href"]},
        {"Ref":"UserLoginResource"}
    ),
    "InstanceLoginResource":util.resource('{id}',{"Ref":"InstancesLoginResource"}),
    "InstancesLoginGet":util.lambda({
        authorization:"COGNITO_USER_POOLS",
        authorizerId:{"Ref":"CognitoAuthorizer"},
        resource:{"Ref":"InstancesLoginResource"},
        method:"GET",
        lambda:"APICloudDirectoryPolicyListLambda",
        req:fs.readFileSync(`${__dirname}/list.req.vm`,'utf-8'),
        res:fs.readFileSync(`${__dirname}/list.res.vm`,'utf-8'),
        parameters:{
            locations:{
                "method.request.querystring.NextToken":false,
                "method.request.querystring.MaxResults":false,
                "method.request.querystring.Query":false
            }
        }
    }),
    "InstanceLoginGet":util.lambda({
        authorization:"CUSTOM",
        authorizerId:{"Ref":"ClouddirectoryAuthorizer"},
        resource:{"Ref":"InstanceLoginResource"},
        type:"AWS_PROXY",
        method:"GET",
        lambda:"APIInstanceRedirectLambda",
        parameters:{
            locations:{}
        }
    }),
    "InstanceLoginPost":util.lambda({
        authorization:"CUSTOM",
        authorizerId:{"Ref":"ClouddirectoryAuthorizer"},
        resource:{"Ref":"InstanceLoginResource"},
        type:"AWS_PROXY",
        method:"POST",
        lambda:"APIInstancePostStateLambda",
        parameters:{
            locations:{}
        }
    })
}
    
