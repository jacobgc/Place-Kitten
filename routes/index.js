var express = require('express');
var router = express.Router();
var sharp = require('sharp'); // Image processing
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {});
});

router.get('/*/*', function (req, res, next) {
  var regex = /\/([0-9]*)\/([0-9]*)/g // Regex to look for /XXX/XXX (Where X is replaced with numbers)
  var imgW = parseInt(getMatches(req.url, regex, 1)[0]) || 0
  var imgH = parseInt(getMatches(req.url, regex, 2)[0]) || 0
  if (imgW == 0 || imgH == 0){
    next("Error: Height/Width must be greater than 0 and not a string"); 
  }
  if (imgW > 2000 | imgH > 2000)
    next("Error: Height/Width must be less than or euqal to 2000px");
  var images = fs.readdirSync('public/img/raw/');
  console.log(images.randomElement());
  sharp('public/img/raw/' + images.randomElement())
    .resize(parseInt(imgW), parseInt(imgH), {
      kernel: sharp.kernel.nearest,
    })
    .toBuffer()
    .then(data => {
      res.contentType('jpeg');
      res.end(data);
    }).catch(err => {
      next(err);
    });
});

function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
}

Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)]
}

module.exports = router;
