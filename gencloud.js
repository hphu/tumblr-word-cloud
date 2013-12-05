

  //var color = d3.scale.ordinal().range(["#F77825","#D3CE3D","#F1EFA5", "#60B99A", "#CC2A41"]);
  
  var color = d3.scale.category20b();
  var words = [{ "text": "Heero", "size": 1 }, { "text": "Villain", "size": 6 }, { "text": "Comics", "size": 4 }, { "text": "fire", "size": 3 }, {"text": "dragons", "size":1},
  { "text": "This", "size": 1 },{ "text": "soul", "size": 1 },{ "text": "death", "size": 3 },{ "text": "wounded", "size": 2 },{ "text": "try", "size": 1 },{ "text": "king", "size": 1 }, { "text": "archer", "size": 1 }, { "text": "tribute", "size": 2 },{ "text": "hello", "size": 2 },{ "text": "man", "size": 1 }, { "text": "rescue", "size": 2 },
  { "text": "lol", "size": 2 },{ "text": "knight", "size": 1 },{ "text": "school", "size": 1 },{ "text": "dream", "size": 1 },{ "text": "gladiator", "size": 2 },{ "text": "duel", "size": 2 }];


  var width = Math.sqrt(words.length)*80, height = Math.sqrt(words.length)*60;
  var fontsize = d3.scale.log().range([18,80]);
  var cloud;

  var key = 'v0mQ8w4YAXML1K79SzARtQLhK0K2dPLWiMQUn2p9nQbSmtPJ15';



function tumbl(blogname){
    $.ajax({
      url: 'http://api.tumblr.com/v2/blog/'+blogname+'/posts?api_key='+key,
      dataType: "jsonp",
      notes_info: 'false',
      success: function(data) { 
        console.log(eval(data));
       }
    });
  }

  function createcloud(){
    d3.select("svg")
       .remove();
    var blogname = document.getElementById("name").value + ".tumblr.com";
    console.log(blogname);
    tumbl(blogname);
    words = [{ "text": "Heero", "size": 1 }, { "text": "Villain", "size": 6 }];
    cloud = d3.layout.cloud().size([width, height])
        .words(words)
        .font("Impact")
        .fontSize(function(d) { return fontsize(d.size); })
        .rotate(function() { return 0; })
        .on("end", draw)
        .start();
      }

  function draw(words) {
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