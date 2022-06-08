//const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require("request");
const cheerio=require("cheerio");
const path=require("path");
const fs=require("fs");  
const xlsx=require("xlsx");  
function processScorecard(url){
    request(url,cb);
}
function cb(err,response,html){
    if(err)
        console.log(err);
    else{
        //console.log(html);
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html){
    //venue date opponent result runs balls 4s 6s rr
    //ipl-> team->player-> details as above
    //venue date result is common for both teams so work on them b4 
    //venue date--- .ds-text-tight-m ds-font-regular ds-text-ui-typo-mid
    // result= .ds-text-tight-m ds-font-regular ds-truncate ds-text-typo-title
    let $=cheerio.load(html);
    let descElem=$(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let result=$(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");
    let stringArr= descElem.text().split(",");
    let venue=stringArr[1].trim();
    let date=stringArr[2].trim();
    result=result.text();
    let innings=$(".ds-bg-fill-content-prime.ds-rounded-lg");
    //let htmlString="";
    for(let i=0;i<innings.length;i++){
        //htmlString+=$(innings[i]).html();
        //team opponent
        let teamName=$(innings[i]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        teamName=teamName.split("INNINGS")[0].trim();
        let opponentIndex=i==0?1:0;
        let opponentName=$(innings[opponentIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        opponentName=opponentName.split("INNINGS")[0].trim();
        console.log(`${venue}| ${date}| ${teamName}| ${opponentName}| ${result}`);
        let cInning=$(innings[i]);
        let allRows=cInning.find("table.ci-scorecard-table tbody tr ");
        //console.log(allRows.length);
        for(let j=0;j<allRows.length-3;j++){   
                
            let allCols=$(allRows[j]).find("td");
            let isWorthy=$(allCols[0]).hasClass("ds-hidden");
            if(isWorthy==false){
               //console.log(allCols.text());
               let playerName=$(allCols[0]).text().trim();
               if(playerName=="Extras")
               break;
               let runs=$(allCols[2]).text().trim();
               let balls=$(allCols[3]).text().trim();
               let fours=$(allCols[5]).text().trim();
               let sixes=$(allCols[6]).text().trim();
               let sr=$(allCols[7]).text().trim();
               console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
               processPlayer(teamName,playerName,runs,balls,fours,sixes,sr, opponentName,venue,date,result);
            }
       }
    }
    //console.log(htmlString);
}
function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr, opponentName,venue,date,result){
    let teamPath=path.join(__dirname,"ipl",teamName);
    dirCreater(teamPath);
    let filePath=path.join(teamPath,playerName + ".xlsx");
    let content=excelReader(filePath,playerName);
    let playerObj={
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath,content,playerName);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath)==false)
    fs.mkdirSync(filePath);
}

function excelWriter(filePath,json,sheetname){
    let newWb=xlsx.utils.book_new();
    let newWs=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb,newWs,sheetname);
    xlsx.writeFile(newWb,filePath);
}
function excelReader(filePath,sheetname){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetname];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports={
    ps:processScorecard
}