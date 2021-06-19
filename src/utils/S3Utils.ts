import AWS from "aws-sdk";
import sharp from "sharp";
import path from "path";
import {getRandomString} from "./StringUtils";

const albumBucketName = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

function getExtension(filename: string) {
    const ext = path.extname(filename || "").split(".");
    return ext[ext.length - 1];
}

export function addPhoto(albumName: string, file: Express.Multer.File, options: { width: number; height: number }) {
    const fileName = file.originalname;
    const fileEx = getExtension(fileName);
    const albumPhotosKey = encodeURIComponent(albumName) + "/";
    const photoKey = `${albumPhotosKey}${getRandomString(30)}.${fileEx}`;
    const params = {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file.buffer,
        ContentType: `image/${fileEx}`,
        ACL: "public-read-write"
    };

    const width = options.width;
    const height = options.height;
    sharp(file.buffer)
        .resize(width, height)
        .toBuffer()
        .then((buff: Buffer) => {
            params.Body = buff;
            s3.upload(params, (err: Error, data: any) => {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        });
    return `${process.env.AWS_S3_BASE_URL}${photoKey}`;
}
