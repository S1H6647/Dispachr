import fs from "fs";

const writeLog = (request, _, next) => {
    fs.appendFile(
        "log.txt",
        `\nDate: ${Date.now()}\nMethod: ${request.method}\nPath: ${
            request.path
        }`,
        (err) => {
            if (err) {
                console.error(`❌ Error: ${err}`);
            }
            next();
        }
    );
};

export default writeLog;
