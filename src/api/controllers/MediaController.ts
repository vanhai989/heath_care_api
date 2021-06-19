import {Get, JsonController, Param,} from "routing-controllers";
import {Res} from "routing-controllers/decorator/Res";
import {Response} from "express";
import path from "path";


@JsonController("/media")
export class MediaController {

    @Get("/:file")
    public async downloadMedia(@Param("file") file: string, @Res() res: Response) {

        const fileName = path.resolve(process.env.STORAGE_VIDEO, file);
        try {
            await new Promise((resolve, reject) => {
                res.sendFile(fileName, (err: any) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}
