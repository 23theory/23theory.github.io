function scramble(name, score)
{
	return   score   +"{"+ name.replace(" ", "");
}
 
function get_tail()
{
	var str1 = window.location.href;
	if (str1.substring( str1.length - 4,  str1.length )==="rank")
	{	return 0;
		}
		else 
	{
		return 1;
	}
}
function getname() { 
	if (cur_score >= 2000)
	{
		var person = prompt( "          本次成绩： "+  cur_score  + "分 \r\n         请输入你的名字(长度<8):", "");
		if (person == null || person == "") {
				if ( person == ""){
					person = prompt("   名字不能为空(长度<10):", "");
			}
			window.location.replace(window.location.href);  
		} else {
      cur_score = parseFloat(Math.random().toPrecision(6))+cur_score;
		var final_desti = "http://www.4shu.net/cgi-bin/wgame/20481.php?a=" +scramble(person, cur_score);
				window.location.replace(final_desti); 
			
		} 
		return person;
	}
	else{
		alert('  不到2000分， 不能上榜。');			window.location.replace(window.location.href);  }
}
function set_title()
{
		
	document.title = '有益智商游戏2048！我得了'+cur_score+'分！还行吧';
		
	if(number_tips<max_number && (max_number == 1024 || max_number == 2048))
	{
		show_medal();
	}
	
	if(game_over==1 && cur_score>200 )
	{
    	getname();

		
		
		
		//$('#result_div').show();

		
	}
}
function HTMLActuator() {
  	if (get_tail()==0)
	{ var str1 = window.location.href;
		document.getElementById( "link1" ).innerHTML ="<a href ="+str1.substring(0,str1.length-5) +">返回游戏</a><br><br>";
		document.getElementById( "main1" ).innerHTML =  "<iframe src='http://www.4shu.net/cgi-bin/wgame/20482.php' width='400' height='600' frameborder='2' border='2'><iframe>";
	}
	else{
		document.getElementById( "link1" ).innerHTML ="<a href ="+window.location.href +"?rank>查看排名</a><br><br>";
	}
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart");
  }

  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

var game_over=0;
HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
  }

  //this.messageContainer.classList.add(type);
  //this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  //this.clearContainer(this.sharingContainer);
  this.messageContainer.classList.add(type);
  game_over = 1;
  $('#result_number').html(max_number+'！');
  $('#msg_box').show();
  set_title();
  
  //this.sharingContainer.appendChild(this.scoreTweetButton());
  //twttr.widgets.load();
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
/*
HTMLActuator.prototype.scoreTweetButton = function () {
  var tweet = document.createElement("a");
  tweet.classList.add("twitter-share-button");
  tweet.setAttribute("href", "https://twitter.com/share");
  tweet.setAttribute("data-via", "gabrielecirulli");
  tweet.setAttribute("data-url", "http://git.io/2048");
  tweet.setAttribute("data-counturl", "http://gabrielecirulli.github.io/2048/");
  tweet.textContent = "Tweet";

  var text = "I scored " + this.score + " points at 2048, a game where you " +
             "join numbers to score high! #2048game";
  tweet.setAttribute("data-text", text);

  return tweet;
};
*/