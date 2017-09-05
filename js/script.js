// scripts

// store element in dom
const searchButton = document.getElementById("submit-button");

// add event listener to button
searchButton.addEventListener("click", searchForNews);

// function to search for news
function searchForNews(e) {

    // store element in dom
    const searchForm = document.getElementById("search-form");

    // retrieve the value in the input field
    const searchTerm = searchForm.value;

    // log to console
    console.log("You searched for " + searchTerm);

    // token
    const token = "d7f07eb3-5135-4d16-b883-9e157c4e3ded";

    const urlArray = new Array;

    // create the urls to search for the news
    const guardianUrl = "https://webhose.io/filterWebContent?token=" + token + "&format=json&sort=crawled&q=" + searchTerm + "%20site_type%3Anews%20site%3Atheguardian.com%20language%3Aenglish%20performance_score%3A%3E5";
    const bbcUrl = "https://webhose.io/filterWebContent?token=" + token + "&format=json&sort=crawled&q=" + searchTerm + "%20site_type%3Anews%20site%3Abbc.co.uk%20language%3Aenglish%20performance_score%3A%3E5";
    const telegraphUrl = "https://webhose.io/filterWebContent?token=" + token + "&format=json&sort=crawled&q=" + searchTerm + "%20site_type%3Anews%20site%3Atelegraph.co.uk%20language%3Aenglish%20performance_score%3A%3E5";

    // push each url in to the array
    urlArray.push(guardianUrl);
    urlArray.push(bbcUrl);
    urlArray.push(telegraphUrl);

    console.log(urlArray[0])

    // declare element
    const headerWrapper = document.getElementById("header-wrapper");

    // add class to headerWrapper
    headerWrapper.classList.add("header-small");

    // templates for news sources
    guardianTemplate = "<div id='theguardian' class='news-wrapper'><div class='source-name'><h3 class='name'>The Guardian</h3></div><div id='article-container' class='article-container' data-source='theguardian.com'></div></div>";
    bbcTemplate = "<div id='bbc' class='news-wrapper'><div class='source-name'><h3 class='name'>BBC News</h3></div><div id='article-container' class='article-container' data-source='bbc.co.uk'></div></div>";
    telegraphTemplate = "<div id='telegraph' class='news-wrapper'><div class='source-name'><h3 class='name'>The Telegraph</h3></div><div id='article-container' class='article-container' data-source='telegraph.co.uk'></div></div>";

    const articleWrapper = document.getElementById("article-wrapper");

    // clear wrapper
    articleWrapper.innerHTML = "";

    const searchTermElement = document.getElementById("search-term");

    // insert template in to header wrapper element 
    searchTermElement.innerHTML = searchTerm;

    // 
    const searchedFor = document.getElementById("searched-for");

    searchedFor.classList.remove("hidden");

    // insert templates in to element
    articleWrapper.innerHTML += guardianTemplate;
    articleWrapper.innerHTML += bbcTemplate;
    articleWrapper.innerHTML += telegraphTemplate;

    // for loop to go through the url array
    for (let i = 0; i < urlArray.length; i++) {

        // declare a new request
        const newsReq = new XMLHttpRequest();

        // open the request
        newsReq.open('GET', urlArray[i], true);

        // function to run when loading
        newsReq.onload = function() {

            // if the status is between 200 and 399
            if (this.status >= 200 && this.status < 400) {

                // request is successful
                // parse the response
                const res = JSON.parse(this.response);

                // enter the posts object
                const posts = res.posts;

                // for look to go through the response
                for (let i = 0; i < posts.length; i++) {

                    // get the name of the site
                    const source = posts[i].thread.site;

                    // get image
                    const image = posts[i].thread.main_image;

                    // get the title post
                    var title = posts[i].title;

                    // split using the | symbol, take the first string in array
                    var title = title.split("|")[0];

                    // take the string and replace "= BBC News" with nothing
                    var title = title.replace("- BBC News", "");

                    // trim excess spaces around string
                    var title = title.trim();

                    const articleUrl = posts[i].thread.url

                    // log to console
                    console.log(title + " | " + source + " | " + articleUrl);

                    var template = '<a class="link" href="' + articleUrl + '"><div class="article">' + 
                    	'<img class="image" src="' + image + '">' + 
                    	'<div class="title">' + title + '</div>' +
	                    '</div></a>';

                    // declare element
                    var newsWrapper = document.querySelectorAll(".article-container");

                    // look through the newsWrapper element to find elements that match source names
                    var currentWrapper = [...newsWrapper].find((wrapper) => wrapper.dataset.source === source);

                    // create fragment
                    var articleFragment = document.createRange().createContextualFragment(template);

                    // add the fragment to the correct wrapper
                    currentWrapper.appendChild(articleFragment);

                    articleWrapper.classList.remove("hidden");
                }

            } else {
                // We reached our target server, but it returned an error

            }
        };

        newsReq.onerror = function() {
            // There was a connection error of some sort
        };

        newsReq.send();
    }
}