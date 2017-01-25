//---Storage & variable declarations--->
var player_symbol, comp_symbol, current_symbol, player_moves, comp_moves,open_spaces,human_turn, game_started,winning_combo, winning_move, last_move, one_player, next_move;

var wins = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7] 
];

var forks = [
  [[1,3,9],[2,6]],
  [[1,3,7],[2,4]],
  [[1,7,9],[4,8]],
  [[3,7,9],[6,8]],
  
  [[3,5,9],[6,7]],
  [[1,3,5],[6,8]],
  [[1,5,7],[2,6]],
  [[5,7,9],[1,8]],
  
  [[6,8,9],[3,7]],
  [[2,3,6],[1,9]],
  [[1,2,4],[3,7]],
  [[4,7,8],[1,9]],
];

var corners = [
  1,3,7,9
]

var edges = [
  2,4,6,8
]

//---Initial Conditions-->
game_started = false;
last_move = 0;
one_player = true;

//---Initialize Input Squares--->
function Square(id, code, type) {
  this.name = id.substr(1);
  this.id = $(id);
  this.code = code;
  this.type = type;
  this.Listen = $(id).click(function() {
    if (!game_started) {
      if (id == "#ML") {
        player_symbol = "X";
        last_move = 1;
        gameStart();
      }
      else if (id == "#MR") {
        player_symbol = "O";
        last_move = 0;
        gameStart();
      }
    }
    
    else if (game_started && inArray(open_spaces, code)) { 
      $(id).text(current_symbol);
      last_move = id.substr(1);
      current_symbol = (current_symbol == "X") ? "O" : "X";
      
      if (human_turn) {
        player_moves.push(code);
        remove(code);
        human_turn = false;
        
        aiController();
      }
      else {
        comp_moves.push(code);
        remove(code);
        human_turn = true;
      }
      console.log("clicked: "+code)
      console.log("player: "+player_moves);
      console.log("comp: "+comp_moves);
      console.log("remaining: "+open_spaces);
      setTimeout(function() {
        if (winPresent(player_moves)) {
        window.alert("You have won!");
      }
      else if (open_spaces.length == 0) {
        window.alert("There was a tie!");
      }
      }, 2000);
      
    }
    
    else if (game_started && !inArray(open_spaces, code)) {
      console.log("clicked already!");
    }
    
    else {}
           
  });
  this.Mark = function() {
    $(id).text(current_symbol);
    current_symbol = (current_symbol == "X") ? "O" : "X";
    console.log(id);
    comp_moves.push(code);
    remove(code);
    human_turn = true;
    setTimeout(function() {
      if (winPresent(comp_moves)) {
        window.alert("The computer won!");
      }
    }, 2000);
    
    
  }
  this.Clear = function() {
    $(id).text("");
  }
 
}
var UL = new Square('#UL', 1, "corner");
var UM = new Square('#UM', 2, "edge");
var UR = new Square('#UR', 3, "corner");
var ML = new Square('#ML', 4, "edge");
var MM = new Square('#MM', 5, "center");
var MR = new Square('#MR', 6, "edge");
var LL = new Square('#LL', 7, "corner");
var LM = new Square('#LM', 8, "edge");
var LR = new Square('#LR', 9, "corner");
var square_list = [UL,UM,UR,ML,MM,MR,LL,LM,LR];

//---ResetGame--->
function Reset() {
  UL.Clear();
  UM.Clear();
  UR.Clear();
  ML.id.text("X");
  MM.id.text("or");
  MR.id.text("O");
  LL.Clear();
  LM.Clear();
  LR.Clear();
  game_started = false;
}

$('.restart').click(function() {
  Reset();
});

//---Start the Game--->
function gameStart() {
  ML.Clear();
  MM.Clear();
  MR.Clear();
  comp_symbol = (player_symbol == "X") ? "O" : "X";
  current_symbol = "X";
  player_moves = [];
  comp_moves = [];
  open_spaces = [1,2,3,4,5,6,7,8,9];
  human_turn = (player_symbol == "X") ? true : false;
  game_started = true;
  aiController();
}


function aiController() {
  if (one_player && !human_turn) {
    setTimeout(runAI, 800);
  }
  else {}
  
  
}

function runAI() {
//Check for a winning move 
if (possibleMove(comp_moves, winPresent)) {
  next_move = eval(squareHasValue("code", winning_move)[0]);
  next_move.Mark();
} 
  
//Check for a block
 else if (possibleMove(player_moves, winPresent)) {
  next_move = eval(squareHasValue("code", winning_move)[0]);
  next_move.Mark();
}  
  
//play an edge if player has two corners
else if (secondMove()) {
    anyEdge();
}   
    
//Check for own fork  
else if (possibleMove(comp_moves, forkPresent)) {
  next_move = eval(squareHasValue("code", winning_move)[0]);
  next_move.Mark();
}
  
//Check for opponent fork  
else if (possibleMove(player_moves, forkPresent)) {
  next_move = eval(squareHasValue("code", winning_move)[0]);
  next_move.Mark();
}
  

//mark the center, unless it is the first move
else if (open_spaces.indexOf(5) != -1 && last_move != 0) {
  MM.Mark();
} 
  
//mark the corner, since it is the first move
else if (last_move == 0) {
  eval(pickAny(squareHasValue("type", "corner"))).Mark();
}   
  

  
//mark the opposite corner
else if (oppositeCorner()) {
   next_move.Mark();    
}
  
//mark any corner
else if (anyCorner()) {
  for (var i = 0; i < corners.length; i++) {
    if (open_spaces.indexOf(corners[i]) != -1) {
      next_move = eval(squareHasValue("code", corners[i])[0]);
      next_move.Mark();
      break;
    }
  }
}  
  
//mark the edge with a chance to win
  else if (oppositeEdge() && comp_moves.indexOf(5) != -1) {
    next_move.Mark(); 
  }
  
//mark any edge
else if (last_move != 0) {
  anyEdge();
}  
  
  /*
//computer goes first  

else if (player_moves.length == 1 && (eval(last_move).type == "corner" || eval(last_move).type == "edge")) {
  eval(pickAny(squareHasValue("type", "center"))).Mark();
}  
  
else if (player_moves.length == 1 && (eval(last_move).type == "center")) {
  eval(pickAny(squareHasValue("type", "corner"))).Mark();
}    
  */
else {
  //pick a random space
   /*var random = Math.floor((Math.random() * open_moves.length) + 0);
   var next_move = eval(squareHasValue("code", random));
   next_move.Mark();*/
};
  
  
};

//---Check if there is a win available given a move set and the remaining spaces--->
function possibleMove(moves_array, func) {
  //for each remaining open space
  for (var i = 0; i < open_spaces.length; i++) {
    //create a copy
    var hypo_array = [];
    for (var j = 0; j < moves_array.length; j++) {
      hypo_array.push(moves_array[j]);
    }
    //add open_spaces one by one to move set    
    hypo_array.push(open_spaces[i]);
    if (func(hypo_array)) {
      winning_move = open_spaces[i];
      return true;
    }
  }
  return false;
}


//---Checks if there is a winning combination in a given move set--->
function winPresent(moves_array) {
  //for each array of winning combinations
  for (var i = 0; i < wins.length; i++) {
    var count = 0;
    //for each value in a winning combo array
    for (var j = 0; j < wins[i].length; j++) {
      if (moves_array.indexOf(wins[i][j]) !== -1) {
        count++;
      }
    }
    //check if all three values were found
    if (count == 3) {
      winning_combo = wins[i];
      return true;
    }
  }
  
  return false;
}

//---Checks if there is a forking combination in a given move set--->
function forkPresent(moves_array) {
  //for each array of fork combinations
  for (var i = 0; i < forks.length; i++) {
    
    var count = 0;
    //for each value in the move set array (index 0)
    for (var j = 0; j < forks[i][0].length; j++) {
      if (moves_array.indexOf(forks[i][0][j]) !== -1) {
        count++;
      }
    }
    
    //check if all three values were found
    if (count == 3) {
      
      var second_count = 0;
      //check if open_spaces are remaining too
      for (var k = 0; k < forks[i][1].length; k++) {
        if (open_spaces.indexOf(forks[i][1][k]) !== -1) {
        second_count++;
        }
      }
      //check if open spaces are available
      if (second_count == 2) {
       return true; 
      }
    }
  }  
  return false;
}

open_spaces = [2,6,7];
console.log(possibleMove([1,5], forkPresent));

//---Remove current move code from remaining spaces array--->
function remove(code) {
  for (var i = 0; i < open_spaces.length; i++) {
    if (code == open_spaces[i]) {
      open_spaces.splice(i, 1);
    }
  }
}
//---Checks if the current move code is still in remaing spaces array--->
function inArray(array, el) {
  for ( var i = array.length; i--; ) {
    if ( array[i] === el ) return true;
  }
  return false;
}

//---Checks for a key/value pair within an object--->
function objectHasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
}
//---Checks if any of the squares have a given key/value pair, and returns an array of all the names of the squares that do--->
function squareHasValue(key,value) {
  var results = [];
  for (var i = 0; i < square_list.length; i++) {
    
    if (objectHasValue(square_list[i], key, value)) {
      results.push(square_list[i].name);
    }
  }
  if (results.length == 0) {
    return false;
  }
  return results;
}
//---This function takes an input array, and returns one of the items in the array--->
function pickAny(array_of_square_options) {
  if (!array_of_square_options) {
    return false;
  }  
  else {
    var random = Math.floor((Math.random() * array_of_square_options.length) + 0);
      return array_of_square_options[random];                  
  }                         
}

//---returns true if the opposite corner is available of the last move--->
function oppositeCorner() {
  var last_move_code = eval(last_move).code;
  
  if (last_move_code == 1 && open_spaces.indexOf(9) != -1) {
    next_move = 9;
    return true;
  }
  else if (last_move_code == 9 && open_spaces.indexOf(1) != -1) {
    next_move = 1;
    return true;
  }
  else if (last_move_code == 3 && open_spaces.indexOf(7) != -1) {
    next_move = 7;
    return true;
  }
  else if (last_move_code == 7 && open_spaces.indexOf(3) != -1) {
    next_move = 3;
    return true;
  }
  return false;
}

//---returns true if the edge is available for the last move--->
function oppositeEdge() {
  var last_move_code = eval(last_move).code;
  
  if (last_move_code == 2 && open_spaces.indexOf(8) != -1) {
    next_move = 8;
    return true;
  }
  else if (last_move_code == 8 && open_spaces.indexOf(2) != -1) {
    next_move = 2;
    return true;
  }
  else if (last_move_code == 4 && open_spaces.indexOf(6) != -1) {
    next_move = 6;
    return true;
  }
  else if (last_move_code == 6 && open_spaces.indexOf(4) != -1) {
    next_move = 4;
    return true;
  }
  return false;
}

//---Any corner available?--->
function anyCorner() {
  for (var i = 0; i < corners.length; i++) {
    if (open_spaces.indexOf(corners[i]) != -1) {
      return true;
    }
  }
  return false;
}

//---Any edge available--->
function anyEdge() {
  for (var i = 0; i < edges.length; i++) {
    if (open_spaces.indexOf(edges[i]) != -1) {
      next_move = eval(squareHasValue("code", edges[i])[0]);
      next_move.Mark();
      break;
    }
  }
}

//---Mark an edge if beginning of game and other player has two corners--->
function secondMove() {
  if (player_moves.length == 2 && comp_moves.length == 1) {
    if ((player_moves.indexOf(1) != -1 && player_moves.indexOf(9) != -1) || (player_moves.indexOf(3) != -1 && player_moves.indexOf(7) != -1)) {
      
      return true;
    }
  }
  return false;
}

