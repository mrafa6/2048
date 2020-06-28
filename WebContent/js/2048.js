$(document).ready(function(){
	$(".box").css("background","#eee4da59");
	$(".box").css("color","black");
	
	var color = ["#FFFFFF","#eee4da","#ede0c8","#f2b179","#f2b179","#f67c5f","#f65e3b",
	             "#edcf72","#00FF80","#00FFCC","#00FFFF","#00CCFF","0080FF",
	             "#0040FF","#0000FF","#4000FF","#8000FF","#CC00FF","#FF00FF",
	             "#FF00CC","#FF0080","#FF0040"];
	let sizes = ["64pt","48pt","40pt","32pt"];
	function getBlankArray(){
		var blankArray = [[0,0,0,0],
		 	             [0,0,0,0],
		 	             [0,0,0,0],
		 	             [0,0,0,0]];
		return blankArray;
	}
	
	function getPowerValue(val){
		let ans =0;
		while(val>=2){
	        ans++;
	        val = val/2;
	    }
		return ans;
	}
	
	
	var score = 0;
	var grid = getBlankArray();
	
	function transposeGrid(grid){
		var grid1= getBlankArray();
		for (let i = 0; i <=3; i++){
			for (let j = 0; j <=3; j++){
				grid1[j][i] = grid[i][j]
			}
		}
		return grid1;
	}
	
	
	
$("#new-game").click(function(){
	resetGame();
	addNumber(grid);
	addNumber(grid);
	
	
});

function isGameOver(){
	for (let i = 0; i <=3; i++){
		for (let j = 0; j <=3; j++){
			if(grid[i][j] == 0){
				return false;
			}
			if(i<3 && grid[i][j] == grid[i+1][j] ){
				return false;
			}
			if(j<3 && grid[i][j] == grid[i][j+1]){
				return false;
			}
		}
	}
	return true;
}

function addNumber(grid){
	let options =[];
	for (let i = 0; i < 4; i++){
		for (let j = 0; j < 4; j++){
			if(grid[i][j] === 0 && !isGameOver()){
				options.push({
					x: i,
					y:j
				});
			}
		}
	}
	
	if(options.length > 0 && options!= null);{
	let spot = randomBlankSpot(options);
	if(spot != null){
		let r = Math.random(1);
		grid [spot.x][spot.y] = r > 0.85 ? 4 : 2;
		let val = grid [spot.x][spot.y];
		console.log(spot);
		updateCell(spot, val);
		//console.table(grid);
	}
}
}

function process(grid){
	if(!isGameOver()){
		for (let i = 0; i < 4; i++){
			grid[i] = operateRow(grid[i]);
		}
	}else{
		$("#game-over").text("GAME OVER!!");
	}
	return grid;
}


function moveRight(){
console.log("Inside Right function>>>>>>>>>>");
	let prevGrid = copyGrid(grid);
	grid = process(grid);
	let changed = compareGrid(prevGrid,grid);
	if(changed){
		addNumber(grid); 
	}
	updateGrid(grid);
	console.table(grid);
}

function moveLeft(){
	console.log("Inside Left function>>>>>>>>>>");
	let prevGrid = copyGrid(grid);
	grid = flipGrid(grid);
	grid = process(grid);
	grid = flipGrid(grid);
	let changed = compareGrid(prevGrid,grid);
	if(changed){
		addNumber(grid); 
	}
	updateGrid(grid);
	console.table(grid);
}

function moveDown(){
	console.log("Inside down function>>>>>>>>>>");
	let prevGrid = copyGrid(grid);
	grid = transposeGrid(grid);
	grid = process(grid);
	grid = transposeGrid(grid);
	let changed = compareGrid(prevGrid,grid);
	if(changed){
		addNumber(grid); 
	}
	updateGrid(grid);
	console.table(grid);
}

function moveUp(){
	console.log("Inside down function>>>>>>>>>>");
	let prevGrid = copyGrid(grid);
	grid = flipGrid(transposeGrid(grid));
	grid = process(grid);
	grid = transposeGrid(flipGrid(grid));
	let changed = compareGrid(prevGrid,grid);
	if(changed){
		addNumber(grid); 
	}
	updateGrid(grid);
	console.table(grid);
}


$("#right").click(function(){
	moveRight();
});

$("#left").click(function(){
	moveLeft();
});

$("#down").click(function(){
	moveDown();
});

$("#up").click(function(){
	moveUp();
}); 


function compareGrid(a,b){
	for (let i = 0; i < 4; i++){
		for (let j = 0; j < 4; j++){
			if(a[i][j] != b[i][j]){
				return true;
			}
		}
	}
	return false;
}

function copyGrid(grid){
	let extra = getBlankArray();
	for (let i = 0; i < 4; i++){
		for (let j = 0; j < 4; j++){
			extra[i][j] = grid[j][i];
		}
	}
	return extra;
	
}

function flipGrid(grid){
	for (let i = 0; i < 4; i++){
		grid[i].reverse();
	}
	return grid;
}

function rotateGrid(grid){
	let newGrid = getBlankArray();
	for (let i = 0; i < 4; i++){
		for (let j = 0; j < 4; j++){
			newGrid[i][j] = grid[j][i];
		}
	}
	return newGrid;
}

function slide(row){
	let arr = row.filter(val => val);
	let missing = 4 - arr.length;
	let zeros = Array(missing).fill(0);
	arr = zeros.concat(arr);
	return arr;
}

function combine(row){
	for(let i = 3; i >= 1; i-- ){
		let a = row[i];
		let b = row[i-1];
		
		if(a == b){
			row [i] = a + b;
			if((a+b) == 2048){
				$("#won").text("CONGRATULATIONS YOU REACHED TO 2048!!");
			}
			score += row[i];
			row [i-1] = 0;
			$("#score").text("Score "+score);
		}
	}
	return row;
}

function operateRow(row){
	row = slide(row);
	row = combine(row);
	row = slide(row);
	return row;
}

function updateGrid(grid){
	var ids;
	for (let i = 0; i < 4; i++){
		for (let j = 0; j < 4; j++){
			
			ids = ""+j+i;
			let xx = "cell"+ids;
			
			if(grid[i][j]!==0){
				updateGridCell(xx, grid[i][j]);
			}else{
				updateGridCell(xx, "");
			}	
		}
	}
}

function updateGridCell(cell, val){
	//console.log("cell>>>>>>>"+cell);
	$("#"+cell).text(val);
	var col = color[getPowerValue(val)];
	let s =""+val;
	var font = sizes[s.length-1];
	$("#"+cell).css("background",col);
	$("#"+cell).css("font-size",font);
}

function updateCell(spot, val){
	var ids = ""+spot.y+spot.x;
	console.log(ids);
	$("#cell"+ids).text(val);
	var col = color[getPowerValue(val)];
	let s =""+val;
	var font = sizes[s.length-1];
	$("#cell"+ids).css("background",col);
	$("#cell"+ids).css("font-size",font);
}


function randomBlankSpot(arr){
	var len = arr.length;
	return arr[Math.floor(Math.random(1)*len)];
}

function resetGame(){
	score = 0;
	grid = getBlankArray();
	$(".box").text("");
	$(".box").css("background","white");
	$("#score").text("Score "+score);
}

document.onkeydown = function(e) { 
    switch (e.keyCode) { 
	  case 37:
		  moveLeft();
		  break;
	  case 38:
		  moveUp();
		  break;
	  case 39:
		  moveRight();
		  break;
	  case 40:
		  moveDown();
		  break; 
    }
}

});

