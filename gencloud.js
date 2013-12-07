

  //var color = d3.scale.ordinal().range(["#F77825","#D3CE3D","#F1EFA5", "#60B99A", "#CC2A41"]);
  
  var color = d3.scale.category20b();
  
  var width;
  var fontsize;

  var key = 'v0mQ8w4YAXML1K79SzARtQLhK0K2dPLWiMQUn2p9nQbSmtPJ15';
  var filter = 'text';


function tumbl(blogname){
    $.ajax({
      url: 'http://api.tumblr.com/v2/blog/'+blogname+'/posts?api_key='+key+'&filter='+filter,
      dataType: "jsonp",
      notes_info: 'false',
      async: false,
      success: function(data) {
        var text = {};
        for (var i=0;i<20;i++){
          text = parsetumbl(data.response.posts[i], data.response.posts[i].type, text);
        }
        var jsonwords = [];
        for (var i in text){
          jsonwords.push({"text": i, "size": text[i]});
        }
        var words = jsonwords;

        width = Math.sqrt(words.length)*100;
        height = Math.min(Math.sqrt(words.length)*60,650);
        fontsize = d3.scale.log().range([18,80]);

        var cloud = d3.layout.cloud().size([width, height])
        .timeInterval(Infinity)
        .words(words)
        .font("Impact")
        .fontSize(function(d) { return fontsize(d.size); })
        .rotate(function() { return 0; })
        .on("end", draw)
        .start();
       }
    });
  }

  function parsetumbl(post, type, text){
    var line = [];
    switch(type){
      case("photo"):
        line = post.caption.split(/\s+/);
        break;
      case("text"):
        line = (post.title + post.body).split(/\s+/);
        console.log(line);
        break;
      case("quote"):
        line = (post.text.split(/\s+/));
        break;
      case("link"):
        line = (post.description + post.title).split(/\s+/);
        break;
      } 
        for (var i=0; i<post.tags.length -1;i++){
          line.push(post.tags[i]);
        }

        line = parsetext(line);
        for (var i =0;i<line.length-1;i++){
          if (line[i].length>2){
            text[line[i] = line[i].toLowerCase()]=text[line[i]]||0;
            text[line[i]]++;
          }
        }
        return text;
    }

 function parsetext(txt){
  for (var i=0;i<txt.length-1;i++){
    txt[i].replace(/\W/g, '');
  }
  return txt;
 }

  function createcloud(){
    var blogname = document.getElementById("name").value + ".tumblr.com";
    tumbl(blogname);
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