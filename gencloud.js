

  //var color = d3.scale.ordinal().range(["#F77825","#D3CE3D","#F1EFA5", "#60B99A", "#CC2A41"]);
  var color = d3.scale.category20b();
  
  var width;
  var fontsize;

  var key = 'v0mQ8w4YAXML1K79SzARtQLhK0K2dPLWiMQUn2p9nQbSmtPJ15';
  var filter = 'text';

  var stopwords = /the|you|and|with|from|about|above|any|but|across|does|too|why|which|not|got|had|because|said|now|will|get|out|who|say|via|would|like|how|has|two|one|all|also|among|anyhow|are|around|back|became|become|replied|becomes|yourself|beside|each|else|just|from|only|than|then|was|were|that|itself|these|into|him|himself|her|herself|while|during|before|after|they|their|themselves|then|i'm|i'll|i'd|i've|he'd|he'll|she'd|she|she'll|he's|she's|we've|they've|it's|its|isn't|aren't|wasn't|weren't|his|this|did|have|can|for|what|when|our|most|have|even|should/
  var maxwords = 200;

  var text = {};
  var totalposts;
  var progress = 0;
  var isloading = false;

function tumbl(blogname, callcount){
      $.ajax({
        url: 'http://api.tumblr.com/v2/blog/'+blogname+'/posts?api_key='+key+'&filter='+filter+'&offset='+callcount*20,
        dataType: "jsonp",
        async: false,
        success: function(data) {
          if (data.meta.msg ==  "Not Found"){
            isloading=false;
            $("#percent").text("blog doesn't exist!");
            return;
          }
          if (data.response.blog['posts']<20){
            $("#percent").text('blog does not have at least 20 posts');
            isloading=false;
            return;
          }
          totalposts = data.response.blog['posts'];

          progress = Math.floor(((callcount+1)*20/Math.min(Math.floor(totalposts/20)*20,100))*100);
          $("#percent").text("Progress: " + progress + "%");
          $("#progressbar").animate({width: (progress) + '%'},500);

          for (var i=0;i<20;i++){
            text = parsetumbl(data.response.posts[i], data.response.posts[i].type, text);
          }

          callcount++;

          if (callcount==5 || callcount == Math.floor(totalposts/20)){

           $("#progress").stop( true, true ).fadeOut();
           $("#progressbar").animate({width: "0%"},1).finish();
            var jsonwords = [];
            for (var i in text){
              jsonwords.push({"text": i, "size": text[i]});
            }
            jsonwords = sortbycount(jsonwords).slice(0,maxwords);

            var numOnewords = 0;
            var numwords = 0;
            for (var i in jsonwords){
              if (jsonwords[i].size ==1){
                numOnewords++;
              }
              numwords++;
            }
            if (numOnewords/numwords <= .15){
              jsonwords = jsonwords.slice(0,numwords-numOnewords);
            }
            var words = jsonwords;
            width = Math.sqrt(words.length)*100;
            height = Math.min(Math.sqrt(words.length)*60,650);
            fontsize = d3.scale.log().domain([jsonwords[jsonwords.length-1].size,jsonwords[0].size]).range([17,70]);
            var cloud = d3.layout.cloud().size([width, height])
            .timeInterval(Infinity)
            .words(words)
            .font("Impact")
            .fontSize(function(d) { return fontsize(d.size); })
            .rotate(function() { return 0; })
            .on("end", draw)
            .start();

            isloading = false;
           } else {
            tumbl(blogname, callcount);
           }
         }
      });
  }

  function sortbycount(input){
     return input.sort(function(a, b) {
        return ((a["size"] < b["size"]) ? 1 : ((a["size"] > b["size"]) ? -1 : 0));
    });
  }

  function parsetumbl(post, type, text){
    var line = [];
    switch(type){
      case("photo"):
        line = post.caption.split(/\s+/);
        break;
      case("text"):
        line = (post.title +" "+ post.body).split(/\s+/);
        break;
      case("quote"):
        line = (post.text.split(/\s+/));
        break;
      case("link"):
        line = (post.description +" "+ post.title).split(/\s+/);
        break;
      case("chat"):
        line = post.body.split(/\s+/);
        break;
      case("video"):
        line = post.caption.split(/\s+/);
        break;
      } 
        for (var i=0; i<post.tags.length -1;i++){
          line.push(post.tags[i]);
        }
        line = parsetext(line);
        for (var i =0;i<line.length-1;i++){
          line[i] = line[i].toLowerCase();
          if (line[i].length>2 && !stopwords.test(line[i])){
            text[line[i]]=text[line[i]]||0;
            text[line[i]]++;
          }
        }
        return text;
    }

 function parsetext(txt){
  for (var i=0;i<txt.length-1;i++){
    if(txt[i].indexOf('http:')!==-1){ //remove links
      txt[i]='';
    }
    txt[i] = txt[i].replace(/[^\w\s'\u2019]/gi, ''); //replaces all non-word-non-space & non-apostrophe characters
    txt[i] = txt[i].replace("\u2019", "'");
  }
  return txt;
 }

  function createcloud(){
      if(!isloading){
      progress = 0;
      //$("#percent").text("Progress: 0%");
      $("#progressbar").css("width", "0px");
      $("#progress").fadeIn('fast');
      isloading = true;
      var blogname = document.getElementById("name").value + ".tumblr.com";
      text = {};
      tumbl(blogname,0);
    }
    }


  function draw(words) {
    d3.select("svg")
       .remove();
    d3.select("#canvas").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return color(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    
  }