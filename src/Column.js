import React, { Component } from "react";

var symbolsMap = {
	2: ["marking", "32"],
	0: ["marking marking-x", 9587],
	1: ["marking marking-o", 9711]
};

class Column extends Component {
	constructor(props) {
		super(props);
		this.handleNewMove = this.handleNewMove.bind(this);
	}
  
	handleNewMove(e) {
		if (!this.props.active) {
		document.querySelector("#message1").style.display = "none";
		document.querySelector("#message2").innerHTML =
			"Game is already over! Reset if you want to play again.";
		document.querySelector("#message2").style.display = "block";
		return false;
		} else if (this.props.marking === 2)
		this.props.onNewMove(parseInt(e.target.id));
	}
	chcksymbol(){
		if(this.props.marking === 2){
		return symbolsMap[2];
		}
		else if(this.props.marking){
		return this.props.aiSymbol;
		}
		else {
		return this.props.userSymbol;
		}
	} 
	render() {
		var symbol=this.chcksymbol();
		return (
		<div className="col" onClick={this.handleNewMove}>
			<div className={symbol[0]} id={this.props.id}>
			{String.fromCharCode(symbol[1])}
			</div>
		</div>
		);
	}
}

export default Column;
