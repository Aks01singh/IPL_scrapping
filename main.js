const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs=require("fs");
const path=require("path");
const request = require("request");
const cheerio=require("cheerio"); 
const AllMatchObj=require("./Allmatch");
const iplPath=path.join(__dirname,"ipl");
dirCreater(iplPath);
request(url,cb);
function cb(err,response,html){
    if(err)
        console.log(err);
    else{
        //console.log(html);
        extractLink(html);
    }
}
function extractLink(html){
    let $=cheerio.load(html);  
    let anchorElem=$("a[href=/series/ipl-2020-21-1210595/match-results]");
    
    let link=anchorElem.attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    //console.log(fullLink);
    AllMatchObj.getAllMatches(fullLink);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath); 
    }
}