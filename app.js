// Selectors
const gameBoard = document.querySelector('#board')
const info = document.querySelector('#info')
let turn
const winningCombos = [
  [0, 1, 2], //top row
  [3, 4, 5], //middle row
  [6, 7, 8], //bottom row
  [0, 3, 6], //left col
  [1, 4, 7], //middle col
  [2, 5, 8], //right col
  [0, 4, 8], //left-right diag
  [2, 4, 6], //right-left diag
]

// Create the game board
function createGameBoard() {
  const emptyTiles = ' '.repeat(9).split('')
  const tileGrid = emptyTiles
    .map((t) => `<button class='tile'></button>`)
    .join('')
  gameBoard.innerHTML = tileGrid
  turn = 'X'
  document.documentElement.style.setProperty('--hue', 10)
  info.textContent = `${turn}'s turn`
  gameBoard.addEventListener('click', handleGameBoardClick)
  const allTiles = gameBoard.querySelectorAll('.tile')
  allTiles.forEach((t) => {
    t.addEventListener('mouseenter', handleMouseEnter)
    t.addEventListener('mouseleave', handleMouseLeave)
  })
  gameBoard.removeAttribute('inert')
}

createGameBoard()

// Update player turn
function updateTurn() {
  turn = turn === 'X' ? 'O' : 'X'
  info.textContent = `${turn}'s turn`
  document.documentElement.style.setProperty('--hue', turn === 'X' ? 10 : 220)
}

// Restart game
function restartGame() {
  let seconds = 3
  const timer = setInterval(() => {
    info.textContent = `Restarting game in... ${seconds}`
    seconds--
    if (seconds < 0) {
      // clear the interval
      clearInterval(timer)
      // restart game
      createGameBoard()
    }
  }, 1000)
}

// Congratulate winner
function showCongrats() {
  info.textContent = `${turn} wins!`
  gameBoard.removeEventListener('click', handleGameBoardClick)
  gameBoard.setAttribute('inert', true)
  const jsConfetti = new JSConfetti()
  jsConfetti.addConfetti({
    emojis: ['🥳', '👏', '🎊', '🎉'],
  })
  setTimeout(restartGame, 1000)
}

// Check score and display winner
function checkScore() {
  const allTiles = [...document.querySelectorAll('.tile')]
  const tilevalues = allTiles.map((t) => t.dataset.value)
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo
    return (
      tilevalues[a] &&
      tilevalues[a] === tilevalues[b] &&
      tilevalues[a] === tilevalues[c]
    )
  })
  if (isWinner) {
    return showCongrats()
  }
  updateTurn()
}

// Handle click for each tile
function handleGameBoardClick(e) {
  const valueExists = e.target.dataset.value
  if (!valueExists) {
    e.target.dataset.value = turn
    e.target.style.setProperty('--hue', turn === 'X' ? 10 : 220)
    checkScore()
  }
}

// Handle mouse enter for each tile
function handleMouseEnter(e) {
  const valueExists = e.target.dataset.value
  if (!valueExists) {
    e.target.dataset.hover = turn
    e.target.style.setProperty('--hue', turn === 'X' ? 10 : 220)
  }
}

// Handle mouse leave for each tile
function handleMouseLeave(e) {
  e.target.dataset.hover = ''
}
