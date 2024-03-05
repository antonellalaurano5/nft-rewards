import formidable from "formidable";
import fs from "fs";
//import FormData from "form-data";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: any) => {
  const stream = fs.createReadStream(file.filepath);
  const options = {
    pinataMetadata: {
      name: file.originalFilename,
    },
  };
  const response = await pinata.pinFileToIPFS(stream, options);
  fs.unlinkSync(file.filepath);

  return response;
};

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err: any, fields: any, files: any) {
        if (err) {
          console.log({ err });
          return res.status(500).send("Upload Error");
        }
        console.log(files);
        const response = await saveFile(files.file);
        const { IpfsHash } = response;

        return res.send(IpfsHash);
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const response = await pinata.pinList(
        { pinataJWTKey: process.env.PINATA_JWT },
        {
          pageLimit: 40,
        }
      );
      res.json(response);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
}
