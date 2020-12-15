const fs=require('fs');
const http=require('http');
const url=require('url');
const slugify = require('slugify');
const replaceTemplate = require('./1-node-farm/starter/modules/replaceTemplate');
//FILE READING AND WRITING
//Synchronous way
/*const textIn=fs.readFileSync('./1-node-farm/starter/txt/input.txt','utf-8');
console.log(textIn);

const textOut=`this is we now about avacado:${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./1-node-farm/starter/txt/output.txt',textOut);
console.log("The information is written");*/

//Asynchronous way
/*fs.readFile('./1-node-farm/starter/txt/start.txt','utf-8',(err,data1)=>{
    fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`,'utf-8',(err,data2)=>{
        console.log(data2);
        fs.readFile('./1-node-farm/starter/txt/append.txt','utf-8',(err,data3)=>{
            console.log(data3);
            fs.writeFile('./1-node-farm/starter/txt/output.txt',`${data2}\n${data3}`,'utf-8',err=>{
                console.log('the file is written');
            })
        })
    })
});
console.log("will read this file");*/



//SERVER

const tempOverview=fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/overview.html`,'utf-8')
const tempProduct=fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/product.html`,'utf-8')
const tempCard=fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-card.html`,'utf-8')

const data=fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`,'utf-8')
const Productdata=JSON.parse(data);


const slugs = Productdata.map(el => slugify(el.productName, {lower:true}));
console.log(slugs);


//console.log(slugify('Fresh-Avacados',{lower:true}));
const server=http.createServer((req,res)=>{
    const { query, pathname } = url.parse(req.url,true); 


    //Overview Page
    if (pathname=='/' || pathname=='/overview'){
        res.writeHead(200,{
            'content-type':'text/html'
        });
        const cardsHtml = Productdata.map(el => replaceTemplate(tempCard, el))
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }


    //Product Page
    else if(pathname=='/product'){
        res.writeHead(200,{
            'content-type':'text/html'
        });
        const product = Productdata[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);

    //API page
    }else if(pathname=='/api'){
        //fs.readFile(`${__dirname}/1-node-farm/starter/dev-data/data.json`,'utf-8',(err,data)=>{
            //const Productdata=JSON.parse(data);
            res.writeHead(200,{
                'content-type':'application/json'
            });
            res.end(data);
       // });


    //Not FOUND
    }else{
        res.writeHead(404,{
            'content-type':'text/html',
            'my-own-content':'hekko world'
        });
        res.end('<h1>this page is not found</h1>');
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log('listening to 8080');
})
