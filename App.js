//import logo from './logo.svg';
import logo from './w.png';
import './App.css';
import React from "react";

class WordleRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputArray: ["", "", "", "", ""],
      correctLetterCount: 0,
      successfulLetters: "",
      disabled: false
    }

    //var updateTracker = " ";
    //var successfulLetters = "";

    // Binding method so these functions have props/state in scope "this"
    this.checkInputs = this.checkInputs.bind(this);

  }

  componentDidMount() {
    // move focus to first (leftmost) input
    this.i0.focus();
  }
  
  handleChange (changeIndex, event) {
    // make shallow copy of input array
    let array = [...this.state.inputArray];
    // modify array item at changeIndex index location
    array[changeIndex] = event.target.value.toUpperCase();
    // replace inputArray in state
    this.setState({
      inputArray: array
    })

    // stores last character entered
    this.updateTracker = event.target.value.toUpperCase();

    // move focus to next input if character is entered
    this.moveFocus(event.target.value);
  }


  moveFocus (val) {
    if (val !== "")
    {
      switch (document.activeElement)
      {
        case this.i0: this.i1.focus(); break;
        case this.i1: this.i2.focus(); break;
        case this.i2: this.i3.focus(); break;
        case this.i3: this.i4.focus(); break;
        case this.i4: this.i5.focus(); break;
        default: break;
      }
    }
  }

  changeColor (index, color) {
    switch (index)
    {
      case 0: this.i0.style.backgroundColor = color; break;
      case 1: this.i1.style.backgroundColor = color; break;
      case 2: this.i2.style.backgroundColor = color; break;
      case 3: this.i3.style.backgroundColor = color; break;
      case 4: this.i4.style.backgroundColor = color; break;
      default: break;
    }
  }

  checkInputs() {
    var countCorrect = 0;
    this.setState({correctLetterCount: 0, disabled: true});

    // for each element in inputArray
    this.state.inputArray.map( (currentValue, index) => {
      
      // if entered letter is in wordleArray, change to yellow
      if (this.props.wordleArray.includes(currentValue))
        this.changeColor(index, "yellow");
      else
        this.changeColor(index, "#4e5156");

      // if entered letter is in same position in wordleArray, change to green
      if (currentValue === this.props.wordleArray[index]) {
        this.changeColor(index, "green");
        // Update correct letter count in state
        countCorrect++;
      }

      // FOR DEBUGGING
      //console.log("count correct incrementer: " + countCorrect);

    });

    this.setState(
      { correctLetterCount: countCorrect },
      () => { 
        // USE SETSTATE'S CALLBACK FUNCTION TO DETERMINE WHETHER USER GUESSED CORRECTLY
        console.log("Correct letter count: " + this.state.correctLetterCount);
        if (this.state.correctLetterCount === 5)
        {
          this.props.setWinningRow();
        }
        else
        {
          // increment current row
          this.props.incrementCurrentRow();
        }
      } 
    );

  }

  render() {
    return(
      <>
        <tr className={this.state.disabled ? "disabled-row" : ""}>
          <td><input ref={ref => (this.i0 = ref)} type="text" size="1" maxLength="1" name="0" value={ this.state.inputArray[0] } onChange={ e => this.handleChange(0, e)} className="LetterInput"></input></td>
          <td><input ref={ref => (this.i1 = ref)} type="text" size="1" maxLength="1" name="1" value={ this.state.inputArray[1] } onChange={ e => this.handleChange(1, e)} className="LetterInput"></input></td>
          <td><input ref={ref => (this.i2 = ref)} type="text" size="1" maxLength="1" name="2" value={ this.state.inputArray[2] } onChange={ e => this.handleChange(2, e)} className="LetterInput"></input></td>
          <td><input ref={ref => (this.i3 = ref)} type="text" size="1" maxLength="1" name="3" value={ this.state.inputArray[3] } onChange={ e => this.handleChange(3, e)} className="LetterInput"></input></td>
          <td><input ref={ref => (this.i4 = ref)} type="text" size="1" maxLength="1" name="4" value={ this.state.inputArray[4] } onChange={ e => this.handleChange(4, e)} className="LetterInput"></input></td>
          <td><input ref={ref => (this.i5 = ref)} type="button" name="5" value="Submit" onClick={ !this.state.disabled ? this.checkInputs : undefined } className={this.state.disabled ? "disabled-button" : "submit-button"}></input></td>
        </tr>

      </>
    )
  }

}


class WordleTable extends React.Component {
  constructor() {

    super();

    this.wordleRows = [];

    this.word = "REACT";
    this.wordleArray = Array.from(this.word)
    
    this.state = {
      wordleArray: this.wordleArray,
      currentRow: 1,
      winningRow: 0,
      displayRows: [1,0,0,0,0],
      enableRows: [1,0,0,0,0]
    }

    // use bind method
    this.incrementCurrentRow = this.incrementCurrentRow.bind(this);
    this.setWinningRow = this.setWinningRow.bind(this);
  }

  incrementCurrentRow() {
    // FOR DEBUGGING
    console.log("Old current row: " + this.state.currentRow);
    
    let thisRow = this.state.currentRow;
    let thisIndex = thisRow - 1;
    let displayRowsCopy = this.state.displayRows;
    let enableRowsCopy = this.state.enableRows;

    // disable row just played
    enableRowsCopy[thisIndex] = 0;

    // if user hasn't lost yet (five tries not yet reached), play next row:
    if (thisIndex < 4)
    {
      // display next row
      displayRowsCopy[thisIndex + 1 ] = 1;
      // enable next row
      enableRowsCopy[thisIndex + 1] = 1;
    
      this.setState(
        {
          currentRow: thisRow + 1,
          displayRows: displayRowsCopy,
          enableRows: enableRowsCopy
        },
        () =>
        { 
          console.log("New current row: " + this.state.currentRow);
          console.log("New displayRows: " + this.state.displayRows);
          console.log("New enableRows: " + this.state.enableRows);
        }
      );
    }
    // else five tries already reached, end game.
    else
    {
      this.setState(
        {
          currentRow: thisRow + 1,
        },
        () => { console.log("Game Over! Five tries reached.") }
      );
    }
  }

  setWinningRow() {
    // FOR DEBUGGING
    console.log("Old winning row: " + this.state.winningRow);    

    let thisRow = this.state.currentRow;
    this.setState(
      { winningRow: thisRow },
      () => { 
        console.log("New winning row: " + this.state.winningRow);
      }
    );
  }


  render() {
    return(
      <div className="WTdiv">
        <table>
          <tbody>
            <WordleRow wordleArray={this.state.wordleArray} currentRow={this.state.currentRow} incrementCurrentRow={this.incrementCurrentRow} winningRow={this.state.winningRow} setWinningRow={this.setWinningRow} displayRows={this.state.displayRows} enableRows={this.state.enableRows} />
            { (this.state.displayRows[1] === 1) ? <WordleRow wordleArray={this.state.wordleArray} currentRow={this.state.currentRow} incrementCurrentRow={this.incrementCurrentRow} winningRow={this.state.winningRow} setWinningRow={this.setWinningRow} displayRows={this.state.displayRows} enableRows={this.state.enableRows} /> : "" }
            { (this.state.displayRows[2] === 1) ? <WordleRow wordleArray={this.state.wordleArray} currentRow={this.state.currentRow} incrementCurrentRow={this.incrementCurrentRow} winningRow={this.state.winningRow} setWinningRow={this.setWinningRow} displayRows={this.state.displayRows} enableRows={this.state.enableRows} /> : "" }
            { (this.state.displayRows[3] === 1) ? <WordleRow wordleArray={this.state.wordleArray} currentRow={this.state.currentRow} incrementCurrentRow={this.incrementCurrentRow} winningRow={this.state.winningRow} setWinningRow={this.setWinningRow} displayRows={this.state.displayRows} enableRows={this.state.enableRows} /> : "" }
            { (this.state.displayRows[4] === 1) ? <WordleRow wordleArray={this.state.wordleArray} currentRow={this.state.currentRow} incrementCurrentRow={this.incrementCurrentRow} winningRow={this.state.winningRow} setWinningRow={this.setWinningRow} displayRows={this.state.displayRows} enableRows={this.state.enableRows} /> : "" }
          </tbody>
        </table>
        <h5>{ (this.state.winningRow) ? "You Won! Attempts: " + this.state.winningRow : "" }</h5>
        <h5>{ (this.state.currentRow > 5) ? "Game Over! Five tries reached." : "" }</h5>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <a
          className="App-link"
          href="http://jontrexel.com"
          target="_blank"
          rel="noopener noreferrer"
          >
            Word Guess
          </a>
        </p>

        <WordleTable />
      </header>
    </div>
  );
}

export default App;
