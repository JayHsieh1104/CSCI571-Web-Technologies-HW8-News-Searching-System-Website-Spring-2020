const express = require('express');
const fetch = require("node-fetch");
const app = express();

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://jayhsieh-csci571-hw8-frontend.azurewebsites.net');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/api/guaridan/:section', (req, res, next) => {
    // Parse request url
    const section = req.params.section;
    const url = (section == 'all') ? 
      'https://content.guardianapis.com/search?api-key=d5646984-678c-4605-836b-ce11bd849843&section=(sport|business|technology|politics)&show-blocks=all' :
      'https://content.guardianapis.com/' + section + '?api-key=d5646984-678c-4605-836b-ce11bd849843&show-blocks=all';
   
    async function returnData() {
        try {
          let response = await fetch(url);
          let jsonText = await response.text();
          let parsedJsonObj = await JSON.parse(jsonText);
          res.send(parsedJsonObj);
        } catch (e) {
          console.error(e)  // handle error
        }
      }
      
    returnData()
});

app.get('/api/guaridan/article/:id', (req, res, next) => {
    // Parse request url
    const article_id = (req.params.id).replace(new RegExp('_', 'g'), '/');
    const url = 'https://content.guardianapis.com/' + article_id + '?api-key=d5646984-678c-4605-836b-ce11bd849843&show-blocks=all';
   
    async function returnData() {
      try {
        let response = await fetch(url);
        let jsonText = await response.text();
        let parsedJsonObj = await JSON.parse(jsonText);
        res.send(parsedJsonObj);
      } catch (e) {
        console.error(e)  // handle error
      }
    }
      
    returnData()
});

app.get('/api/guaridan/search/:keyword', (req, res, next) => {
  // Parse request url
  const keyword = (req.params.keyword).replace(new RegExp('_', 'g'), '/');
  const url = 'https://content.guardianapis.com/search?q=' + keyword + '&api-key=d5646984-678c-4605-836b-ce11bd849843&show-blocks=all';

  async function returnData() {
    try {
      let response = await fetch(url);
      let jsonText = await response.text();
      let parsedJsonObj = await JSON.parse(jsonText);
      res.send(parsedJsonObj);
    } catch (e) {
      console.error(e)  // handle error
    }
  }

  returnData()
});

app.get('/api/nytimes/:section', (req, res, next) => {
  const section = req.params.section;
  const url = (section == 'all')? 
    'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=pYtKRAXSHt4GebYASTuFs0QR2up6pQcW' :
    'https://api.nytimes.com/svc/topstories/v2/' + section + '.json?api-key=pYtKRAXSHt4GebYASTuFs0QR2up6pQcW';
   
  async function returnData() {
      try {
        let response = await fetch(url);
        let jsonText = await response.text();
        let jsonObj = await JSON.parse(jsonText);
        let filteredResults = [];
        for(let i = 0; i < jsonObj.results.length; i++) {
          if(jsonObj.results[i].title != '' || jsonObj.results[i].section != '' || 
            jsonObj.results[i].published_date != '' || jsonObj.results[i].abstract != '') {
            filteredResults.push(jsonObj.results[i]);
          }
          if(filteredResults.length == 10) {
            break;
          }
        }
        jsonObj.results = filteredResults;
        res.send(jsonObj);
      } 
      catch (e) {
        console.error(e)  // handle error
      }
    }
      
    returnData()
});

app.get('/api/nytimes/article/:id', (req, res, next) => {
  const article_id = (req.params.id).replace(new RegExp('_', 'g'), '/');
  const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + article_id + '")&api-key=pYtKRAXSHt4GebYASTuFs0QR2up6pQcW'

  async function returnData() {
      try {
        let response = await fetch(url);
        let jsonText = await response.text();
        let jsonObj = await JSON.parse(jsonText);
        res.send(jsonObj);
      } catch (e) {
        console.error(e)  // handle error
      }
    }
      
  returnData()
});

app.get('/api/nytimes/search/:keyword', (req, res, next) => {
  const keyword = (req.params.keyword).replace(new RegExp('_', 'g'), '/');
  const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + keyword + '&api-key=pYtKRAXSHt4GebYASTuFs0QR2up6pQcW'

  async function returnData() {
    try {
      let response = await fetch(url);
      let jsonText = await response.text();
      let jsonObj = await JSON.parse(jsonText);
      res.send(jsonObj);
    } catch (e) {
      console.error(e)  // handle error
    }
  }
    
  returnData()
});

app.listen(process.env.PORT || 3000 , function () {
  console.log('app listening on port 3000!');
});