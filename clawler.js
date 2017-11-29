const LIMIT_DEPTH = 1;

var configFile = require('config');
var client = require('cheerio-httpcli');


var isExternal = url => false; // TODO: 外のURLかどうか
var buildUrl = (baseurl, partialurl) => baseurl + partialurl; // TODO: URL を構築する
var isLooping = url => false; // TODO: ループしていないかどうか


var fetch = (url, depth) => {
    if (depth > LIMIT_DEPTH) {
        return;
    }
    if (!url) {
        return;
    }
    console.log(depth + " - " + url);
    client.fetch(url, {}, (err, $, res) => {
        if (!$) {
            return;
        }
        $('a').each(function (idx) {
            var href = $(this).attr('href');
            if (!href) {
                return;
            }
            var newurl = buildUrl(url, href);
            if (isExternal(newurl)) {
                return;
            }
            if (isLooping(newurl)) {
                return;
            }
            fetch(newurl, depth + 1);
        });
    });
};

fetch(configFile.config.startPage, 0);
