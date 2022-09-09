import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser'
var router = express.Router();

/* GET users listing. */
router.get('/urls/preview', async function(req, res, next) {
  let url = req.query.url;

  let htmlPage = "";
  try{
    let urlData = await fetch(url);
    let pageText = await urlData.text();
    htmlPage = parser.parse(pageText);
  } catch (error) {
    res.send("There is an error: " + error);
  }
  
  let og_urlTag = htmlPage.querySelector("meta[property='og:url']");
  let urlTag = "";
  if (og_urlTag) {
    urlTag = og_urlTag._attrs.content;
  } else {
    urlTag = url;
  }

  let titleTag = "";
  let og_titleTag = htmlPage.querySelector("meta[property='og:title']");
  if (og_titleTag) {
    titleTag = og_titleTag._attrs.content;
  } else {
    let tag_titleTag = htmlPage.getElementsByTagName("title");
    if (tag_titleTag) {
      titleTag = tag_titleTag.map(function(a){ return a.innerHTML; });
    } else {
      titleTag = url;
    }
  }

  let typeTag = "";
  let og_typeTag = htmlPage.querySelector("meta[property='og:type']");
  if (og_typeTag) {typeTag = og_typeTag._attrs.content;}

  let imgTag = "";
  let og_imgTag = htmlPage.querySelector("meta[property='og:image']");
  if (og_imgTag) {imgTag = og_imgTag._attrs.content;}
  
  let descripTag = "";
  let og_descripTag = htmlPage.querySelector("meta[property='og:description']");
  if (og_descripTag) {descripTag = og_descripTag._attrs.content}

  let htmlString = 
  `<div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center;"> 
    <br>
    ${typeTag ? `<h2 style="font-size: 16px; font-weight: bold;"> Type: ${typeTag} </h2>` : ''}
    <a href= "${urlTag}" style="font-size: 17px; font-variant: small-caps;">
        <p><strong> 
            ${titleTag}
        </strong></p> 
        ${imgTag ? `<img src= ${ imgTag } style="max-height: 200px; max-width: 270px;"></img>` : ''}
    </a>
    <br><br>
    ${descripTag ? `<p style="font-size: 15px; font-style: italic;"> ${ descripTag} </p>` : ''}
  </div>`
  console.log(htmlString);
  res.send(htmlString);
});

export default router;
