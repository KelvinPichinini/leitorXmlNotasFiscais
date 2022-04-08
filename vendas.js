let fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function formatDate(aaaammdd){
  let day = aaaammdd.split("")[6]+ aaaammdd.split("")[7];
  let month = aaaammdd.split("")[4]+ aaaammdd.split("")[5];
  let year = aaaammdd.split("")[0]+ aaaammdd.split("")[1]+ aaaammdd.split("")[2]+ aaaammdd.split("")[3];
  return `${day}/${month}/${year}`;
}
function printResults(sales){
  let sum = 0;
  sales.forEach(element => {
    sum += parseFloat(element.value);
    const formatedDate = formatDate(element.date);
    console.log(`${formatedDate}: R$${element.value.toFixed(2)}`)

  })
  console.log("Total: R$"+ sum.toFixed(2).toString().replace('.',','));
}

let dir = "./xmlFiles"

const sales = [];
const filesWithProblems = [];

fs.readdir(dir, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }
  const numberOfFiles = files.length;
  const PROGRESSBAR_SIZE = 50;
  console.log(`LENDO OS ARQUIVOS : `);
  for (const arquivos in files){
    const completion = Math.ceil(arquivos/numberOfFiles*PROGRESSBAR_SIZE);
    const dots = ".".repeat(completion + 1)
    const left = PROGRESSBAR_SIZE - completion 
    const empty = " ".repeat(left)
      /* need to use  `process.stdout.write` becuase console.log print a newline character */
      /* \r clear the current line and then print the other characters making it looks like it refresh*/
    process.stdout.write(`\r[${dots}${empty}] ${completion*2}% (${arquivos}|${numberOfFiles} arquivos)`)

    if(files[arquivos].endsWith("xml")){
      //console.log(`reading file: ${files[arquivos]}`);
      const xmlStr = fs.readFileSync(dir+'/'+files[arquivos], "utf8");
      const dom = new JSDOM(xmlStr);
      const dateElement = dom.window.document.getElementsByTagName("dEmi")[0]
      if(dateElement) {
        const dEmi = dateElement.innerHTML;
        const vCfe = parseFloat(dom.window.document.getElementsByTagName("vCfe")[0].innerHTML);
        const index = sales.findIndex(element => element.date === dEmi);
        if (index !== -1) {
          sales[index].value += vCfe;
        }
        else {
          const sale = {date: dEmi, value: vCfe};
          sales.push(sale);
        }
      } else {
        filesWithProblems.push(files[arquivos]);
      }
      dom.window.close();
    }  
  }
  console.log('');
  if(filesWithProblems.length > 0) {
    console.log('\nArquivos com problemas:');
    console.log(filesWithProblems);
  }
  printResults(sales);
      
})


