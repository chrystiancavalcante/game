import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  state = {
    time: 60,
    gameState: 'stopped',
    word:'',
    words:[
      {word:'AMAR', discovered: false},
      {word:'MARA', discovered: false},
      {word:'ARMA', discovered: false},
      {word:'RAM', discovered: false},
      {word:'MAR', discovered: false}
    ],
    available:[
      { letter: 'A', used: false},
      { letter: 'M', used: false},
      { letter: 'A', used: false},
      { letter: 'R', used: false}

    ]
  }
  renderWord(word, key){
     if (word.discovered) {
      const letters = word.word.split('')
      return <p key={key}>{letters.map(l => <span className='letter-empty'>{l}</ span>)}</p>
  
     }
     const len = word.word.length
     const letters = ''.padStart(len, '_').split('')
     return <p key={key}>{letters.map(l => <span className='letter-empty'></ span>)}</p>
  }
  renderAvailable(letter, key) {
    if (!letter.used){
      return <span key={key} className='letter-available'>{letter.letter}</span>
    }
    return;
  }
  componentDidMount(){
    setInterval(() => {
      if(this.state.gameState === 'playing'){
        if(this.state.time % 10 === 0){
          this.random()
        }
      this.setState({
        time: this.state.time -1
      })
    }
    }, 1000)
    window.addEventListener('keydown', evt => {
      const letter = evt.key.toUpperCase()
      if ( letter === 'ENTER'){
        const word = this.state.word
        const wordIndex = this.state.words.findIndex(w => {
          return w.word === word && !w.discovered
        })
        if(wordIndex >= 0){
        const words = [...this.state.words]
        words[wordIndex].discovered = true

       const available = this.state.available.map(w => {
         return {...w, used: false}
       })

        this.setState({
          words,
          available,
          word:''
        })
        }
      }else if(letter === 'BACKSPACE'){
        const len = this.state.word.length
        if( len > 0){
           const currentLetter = this.state.word.substr(len-1, len)
           const word = this.state.word.substr(0, len-1)
           let index = -1
           this.state.available.forEach((l, key) => {
             if(l.used && l.letter === currentLetter){
               index = key   
             }
           })
         const available = [...this.state.available]
         available[index].used = false
           this.setState({
             available,
             word
           })
        }
      }else{
        const index = this.state.available.findIndex( l => {
          return l.letter === letter && !l.used
        })
        if(index >= 0){
         const available = [...this.state.available]
         available[index].used = true
         const word = this.state.word+letter
         this.setState({ available, word }) 
       
        }
      }
    })
  }
  componentWillUnmount(){
    window.removeEventListener('keydown')
  }
  random = () => {
    const availableCopy = [...this.state.available]
    const available = []

    const t = this.state.available.length
    for(let i=0; i<t; i++){
      const random = parseInt(Math.random()*(t-i))
      const item = availableCopy.splice(random, 1)
      available.push(item[0])
      this.setState({
        available
      })
    }
  }
  render() {
    if(this.state.gameState === 'stopped'){
      return (
        <div>
       <button onClick={() => {
         this.setState({
           gameState: 'playing',
           time: 60
         })
       }}> Iniciar Jogo </button>
        </div>
      )
    }
    if(this.state.time < 0){
      return <div className='game'>Game Over</div>
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">ANAGRAMA SOFTWARE PRO</h1>
          <p>Tempo restante: {this.state.time}</p>
        </header>
        <div className="App-intro">
        <p className='word'>
          {
          this.state.available.map((letter, key) => this.renderAvailable(letter, key))
          }
        </p>
        <p className='word'> { this.state.word } </p>

           {
             this.state.words.map((word, key )=> this.renderWord(word, key))
           }          
        </div>
      </div>
    )
  }
}

export default App
