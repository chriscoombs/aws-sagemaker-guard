#! bin/bash
set -x
cd /home/ec2-user/SageMaker

git clone https://github.com/aws-samples/amazon-sagemaker-BYOD-template.git
cd amazon-sagemaker-BYOD-template
npm install
BUCKET=$(aws cloudformation describe-stacks --stack-name {{BucketStack}}-bucket --query "Stacks[0].Outputs[0].OutputValue")

cat > ./config.js <<- EOM
    var out={
        assetBucket:$BUCKET,
        assetPrefix:"BYOD",
        namespace:"dev",
        profile:"default",
        region:"{{global:REGION}}",
        parameters:{}
    }
    out.parameters.AssetBucket=out.assetBucket
    out.parameters.AssetPrefix=out.assetPrefix

    module.exports=out
EOM
