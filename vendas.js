let fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function formatDate(aaaammdd){
  let dia = aaaammdd.split("")[6]+ aaaammdd.split("")[7];
  return parseFloat(dia);

}

let dir = "/home/kelvin/Desktop/xml sat gru/07/Emitidos"

let vendasPorDia = {
  01: 0,
  02: 0,
  03: 0,
  04: 0,
  05: 0,
  06 : 0,
  07 : 0,
  08 : 0,
  09 : 0,
  10 : 0,
  11 : 0,
  12 : 0,
  13 : 0,
  14 : 0,
  15 : 0,
  16 : 0,
  17 : 0,
  18 : 0,
  19 : 0,
  20 : 0,
  21 : 0,
  22 : 0,
  23 : 0,
  24 : 0,
  25 : 0,
  26 : 0,
  27 : 0,
  28 : 0,
  29 : 0,
  30 : 0,
  31 : 0,
}

fs.readdir(dir, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }
  for (const arquivos in files){
    if(files[arquivos].endsWith("xml")){
      //console.log(files[arquivos]);
      let xmlStr = fs.readFileSync(files[arquivos], "utf8");
      let dom = new JSDOM(xmlStr);
      let dEmi = formatDate(dom.window.document.getElementsByTagName("dEmi")[0].innerHTML) ;
      let vCfe = dom.window.document.getElementsByTagName("vCfe")[0].innerHTML;
      vendasPorDia[dEmi] += parseFloat(vCfe);
      dom.window.close();
    }  
  }
  let sum = 0;
  for(const days in vendasPorDia){
    console.log(days + ": R$"+vendasPorDia[days].toFixed(2).toString().replace('.',','));
    sum += vendasPorDia[days];
  }
  console.log("Total: R$"+ sum.toFixed(2).toString().replace('.',','));    
})


