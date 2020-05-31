import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./Row";
import "./App.css";

var symbolsMap = {
    2: ["marking", "32"],
    0: ["marking marking-x", 9587],
    1: ["marking marking-o", 9711],
};
var userSymbol = symbolsMap[0];
var aiSymbol = symbolsMap[1];
var levels = ["easy", "intermediate", "expert"];
var patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

var AIScore = { 2: 1, 0: 2, 1: 0 };

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        boardState: new Array(9).fill(2),
        turn: 0,
        noOfTurns: 0,
        active: true,
        mode: "AI",
        level: levels[0],
        started: false,
        };
        this.handleNewMove = this.handleNewMove.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.processBoard = this.processBoard.bind(this);
        this.makeAIMove = this.makeAIMove.bind(this);
        this.changeSymbol = this.changeSymbol.bind(this);
        this.changeLevel = this.changeLevel.bind(this);
        this.handleStartButton = this.handleStartButton.bind(this);
    }
    handleStartButton() {
        if (userSymbol !== symbolsMap[0]) {
        this.makeAIMove();
        }
        this.setState({ started: true });
    }
    changeSymbol() {
        aiSymbol = symbolsMap[0];
        userSymbol = symbolsMap[1];
    }
    processBoard() {
        var won = false;
        patterns.forEach((pattern) => {
        var firstMark = this.state.boardState[pattern[0]];

        if (firstMark !== 2) {
            var marks = this.state.boardState.filter((mark, index) => {
            return pattern.includes(index) && mark === firstMark;
            });

            if (marks.length === 3) {
            document.querySelector("#message1").innerHTML =
                String.fromCharCode(marks[0] ? aiSymbol[1] : userSymbol[1]) +
                " wins!";
            document.querySelector("#message1").style.display = "block";
            pattern.forEach((index) => {
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
        } else if (this.state.mode === "AI" && this.state.turn === 1 && !won) {
        if (this.state.noOfTurns === 1 && userSymbol !== symbolsMap[0]) {
            this.setState({ noOfTurns: this.state.noOfTurns+1 });
            return;
        }
        this.makeAIMove();
        }
    }
    randomIndex(min, max) {
        const rand = Math.random() * (max - min);
        return parseInt(rand);
    }
    makeAIMove() {
        var emptys = [];
        var scores = [];
        var humanIndexes = new Array(9).fill(0);
        var aiIndexes = new Array(9).fill(0);
        var maxIndex = 0;
        this.state.boardState.forEach((mark, index) => {
        if (mark === 2) emptys.push(index);
        else if (mark === 0) humanIndexes[index] = "1";
        else aiIndexes[index] = "1";
        });

        emptys.forEach((index) => {
        var score = 0;
        patterns.forEach((pattern) => {
            if (pattern.includes(index)) {
            var xCount = 0;
            var oCount = 0;
            pattern.forEach((p) => {
                if (this.state.boardState[p] === 0) xCount += 1;
                else if (this.state.boardState[p] === 1) oCount += 1;
                score += p === index ? 0 : AIScore[this.state.boardState[p]];
            });
            if (xCount >= 2) score += 10;
            if (oCount >= 2) score += 20;
            }
        });
        scores.push(score);
        });
        if (
            !this.state.boardState.includes(0) &&
            !this.state.boardState.includes(1)
            ) 
            {
            maxIndex = this.randomIndex(0, 8);
        } else if (this.state.level === levels[0]) {
        let index;
        do {
            index = this.randomIndex(0, emptys.length);
        } while (humanIndexes.includes(index));
        maxIndex = index;
        } else if (this.state.level === levels[1]) {
        patterns.map((value) => {
            value.forEach((patternIndex) =>{
                if(!aiIndexes.includes(patternIndex))
                    {
                        maxIndex=patternIndex;
                        return;
                    }
                return;
            })                  
        });
        } else {
        maxIndex = 0;
        scores.reduce(function (maxVal, currentVal, currentIndex) {
            if (currentVal >= maxVal) {
            maxIndex = currentIndex;
            return currentVal;
            }
            return maxVal;
        });
        }
        this.handleNewMove(emptys[maxIndex]);
    }
    changeLevel(e) {
        this.setState({ level: e.target.value });
    }

    handleReset(e) {
        if (e) e.preventDefault();
        document
        .querySelectorAll(".alert")
        .forEach((el) => (el.style.display = "none"));
        this.setState({
        boardState: new Array(9).fill(2),
        turn: 0,
        active: true,
        noOfTurns: 0,
        started: false,
        });
    }
    handleNewMove(id) {
        this.setState(
        (prevState) => {
            return {
            boardState: prevState.boardState
                .slice(0, id)
                .concat(prevState.turn)
                .concat(prevState.boardState.slice(id + 1)),
            turn: (prevState.turn + 1) % 2,
            noOfTurns: prevState.noOfTurns++,
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
            <div className="container jumbotron" id="container">
            <h3>TIC TAC TOE</h3>
            {!this.state.started && this.state.noOfTurns === 0 && (
                <p>
                <pre>
                    <select className="browser-default custom-select col-sm-3" onChange={this.changeLevel}>
                    {levels.map((level) => (
                        <option
                        id={level}
                        name={level}
                        value={level}
                        selected={this.state.level === level ? true : false}
                        >
                        {level}
                        </option>
                    ))}
                    </select>
                    ||
                    <input className="radio md-2" type="radio" value="O" onChange={this.changeSymbol} />
                    Select O 
                </pre>
                </p>
            )}
            <p>
                <a href="#" onClick={this.handleReset}>
                {" "}
                Reset board
                </a>
            </p>
            <div className="board">{rows}</div>
            <p className="alert alert-success" role="alert" id="message1"></p>
            <p className="alert alert-info" role="alert" id="message2"></p>
            </div>
        </div>
        );
    }
}

export default App;
