const request = require("request");
const cheerio=require("cheerio");
const scoreCardObj=require("./scorecard");
function getAllMatchesLink(url){
    request(url,function(err,response,html){
        if(err)
        console.log(err);
    else{
        extractAllLinks(html);
    }
    })
}
function extractAllLinks(html){
    let $=cheerio.load(html);
    let scorecardEle=$(".ds-px-4.ds-py-3>a");
    console.log(scorecardEle.length);
    for(let i=0;i<scorecardEle.length;i++){
        let link=$(scorecardEle[i]).attr("href");
        console.log(link);
        let fullLink="https://www.espncricinfo.com" + link;
        scoreCardObj.ps(fullLink);
    }
}
module.exports={
    getAllMatches:getAllMatchesLink
}