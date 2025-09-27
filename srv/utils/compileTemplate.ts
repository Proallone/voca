import fs from "fs";
import Handlebars from "handlebars";

export const compileTemplate = (filePath: string) => {
    const source = fs.readFileSync(filePath, "utf-8");
    return Handlebars.compile(source);
};