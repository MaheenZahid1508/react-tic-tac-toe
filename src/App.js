import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./Row";
import "./App.css";
import _ from 'lodash';

var symbolsMap = {
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};
var userSymbol = symbolsMap[0];
var aiSymbol = symbolsMap[1];
var levels = ["easy","intermediate","expert"];
var patterns = [
  //horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6]
];

var AIScore = { 2: 1, 0: 2, 1: 0 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: new Array(9).fill(2),
      turn: 0,
      noOfTurns: 0,
      active: true,
      mode: "AI",
      level:levels[0]
    };
    this.handleNewMove = this.handleNewMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.processBoard = this.processBoard.bind(this);
    this.makeAIMove = this.makeAIMove.bind(this);
    this.changeSymbol = this.changeSymbol.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
  }
  changeSymbol(){
    aiSymbol=symbolsMap[0];
    userSymbol=symbolsMap[1];
      this.makeAIMove();
    

  }
  processBoard() {
    var won = false;
    patterns.forEach(pattern => {
      var firstMark = this.state.boardState[pattern[0]];

      if (firstMark != 2) {
        var marks = this.state.boardState.filter((mark, index) => {
          return pattern.includes(index) && mark == firstMark; 
        });

        if (marks.length == 3) {
          document.querySelector("#message1").innerHTML =
            String.fromCharCode(marks[0]?aiSymbol[1]:userSymbol[1]) + " wins!";
          document.querySelector("#message1").style.display = "block";
          pattern.forEach(index => {
            var id = index + "-" + firstMark;
            document.getElementById(id).parentNode.style.background = "#d4edda";
          });
          this.setState({ active: false });
          won = true;
        }
      }
    });

    if (!this.state.boardState.includes(2) && !won) {
      document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
      document.querySelector("#message2").style.display = "block";
      this.setState({ active: false });
    } else if (this.state.mode == "AI" && this.state.turn == 1 && !won) {
      if(this.state.noOfTurns==1 && userSymbol!=symbolsMap[0])
        {
        // this.setState({noOfTurns=this.state.noOfTurns++})
        return;
      }
      this.makeAIMove();
    
    }
  }
randomIndex(min,max){
  const rand = Math.random() * (max - min);
  return parseInt(rand);
}
  makeAIMove() {
    var emptys = [];
    var scores = [];
    var humanIndexes = new  Array(9).fill(0);
    var res=[];
    var maxIndex = 0;
    this.state.boardState.forEach((mark, index) => {
      if (mark == 2) emptys.push(index);
      else if(mark == 0) humanIndexes[index]='1';
    });


      emptys.forEach(index => {
        var score = 0;
        patterns.forEach(pattern => {
          if (pattern.includes(index)) {
            var xCount = 0;
            var oCount = 0;
            pattern.forEach(p => {
              if (this.state.boardState[p] == 0) xCount += 1;
              else if (this.state.boardState[p] == 1) oCount += 1;
              score += p == index ? 0 : AIScore[this.state.boardState[p]];
            });
            if (xCount >= 2) score += 10;
            if (oCount >= 2) score += 20;
          }
        });
        scores.push(score);
      });
      if(!this.state.boardState.includes(0)&&!this.state.boardState.includes(1)){
        maxIndex=this.randomIndex(0,8);
      }
      else if(this.state.level==levels[0]){
        
        patterns.map((value, key) => {
          let d = _.intersection(value, emptys)

          if (d && !_.isEmpty(_.difference(value, d))) {
              res.push(d)
          }
      })
      let mostSpot = _.flattenDeep(res)
      let uniq = _.uniq(mostSpot)
      let availtoSpot = uniq

      let rand = availtoSpot[Math.floor(Math.random() * emptys.length)]
      maxIndex=rand;
      }
      else if(this.state.level==levels[1]){
        let coverIndex = null
        patterns.map((value, key) => {
            let intersept = _.intersection(value, humanIndexes)
            if (intersept.length == 2) {
                let j = _.difference(value, intersept)

                if (this.state.boardState[j[0]] === 2) {
                    coverIndex = j[0]
                }

            }
        })

        if (coverIndex) {
          maxIndex=coverIndex;
            return;
        }
        else{
          patterns.map((value, key) => {
            let d = _.intersection(value, emptys)
  
            if (d && !_.isEmpty(_.difference(value, d))) {
                res.push(d)
            }
        })
        let mostSpot = _.flattenDeep(res)
        let uniq = _.uniq(mostSpot)
        let availtoSpot = uniq
  
        let rand = availtoSpot[Math.floor(Math.random() * emptys.length)]
        maxIndex=rand;
  
        }
      }
      else{
      maxIndex = 0;
      scores.reduce(function(maxVal, currentVal, currentIndex) {
        if (currentVal >= maxVal) {
          maxIndex = currentIndex;
          return currentVal;
        }

        return maxVal;
      });
    }
    this.handleNewMove(emptys[maxIndex]);
  }
  changeLevel (e){
    this.setState({level:e.target.value});
  }

  handleReset(e) {
    if (e) e.preventDefault();
    document
      .querySelectorAll(".alert")
      .forEach(el => (el.style.display = "none"));
    this.setState({
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true,
      noOfTurns: 0
    });
  }
  handleNewMove(id) {
    this.setState(
      prevState => {
        return {
          boardState: prevState.boardState
            .slice(0, id)
            .concat(prevState.turn)
            .concat(prevState.boardState.slice(id + 1)),
          turn: (prevState.turn + 1) % 2,
          noOfTurns: (prevState.noOfTurns++)
        };
      },
      () => {
        this.processBoard();
      }
    );
  }

  

  render() {
    const rows = [];
    for (var i = 0; i < 3; i++)
      rows.push(
        <Row
          row={i}
          boardState={this.state.boardState}
          onNewMove={this.handleNewMove}
          active={this.state.active}
          userSymbol={userSymbol}
          aiSymbol={aiSymbol}
        />
      );
    return (
      <div>
        <div class="container jumbotron" id="container">
          <h3>TIC TAC TOE</h3>
          {this.state.noOfTurns==0 &&
            <p>
              <input type="radio" value="O" onChange={this.changeSymbol}/>
              O
            </p>
          }
          <p>
            <select onChange={this.changeLevel}>
              {levels.map(level=>
<option id={level} name={level} value={level} selected={this.state.level==level?true:false}  >{level}</option>
              )}
            </select>
            ||
            <a href="#" onClick={this.handleReset}>
              {" "}
              Reset board
            </a>
          </p>
          <div className="board">{rows}</div>
          <p class="alert alert-success" role="alert" id="message1"></p>
          <p class="alert alert-info" role="alert" id="message2"></p>
        </div>
      </div>
    );
  }
}

export default App;