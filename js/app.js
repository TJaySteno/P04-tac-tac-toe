/************************************************
  START AND WIN SCREENS
************************************************/

// Create start screen and assign 'click' listener to 'Start game' button
const $startScreen = $(`
    <div class="screen screen-start" id="start">
      <header>
        <h1>Tic Tac Toe</h1>
        <a href="#" class="button">Start game</a>
      </header>
    </div>
  `);
$startScreen.find('a').click(() => {
  $startScreen.hide();
  $('#board').show();
  $('#player1').addClass('active');
});

// Create win screen and assign 'click' listener to 'New game' button. This listener also resets win screen.
const $winScreen = $(`
    <div class="screen screen-win" id="finish">
      <header>
        <h1>Tic Tac Toe</h1>
        <p class="message">Winner</p>
        <a href="#" class="button">New game</a>
      </header>
    </div>
  `).hide();
$winScreen.find('a').click(() => {
  $winScreen.hide().find('p').text('Winner');
  $winScreen.removeClass('screen-win-tie')
            .removeClass('screen-win-one')
            .removeClass('screen-win-two');
  $('#start').show();
});

// Hide game board, then insert start and win screens before and after
$('#board').hide().before($startScreen).after($winScreen);



/************************************************
  BOARD SCREEN - BASIC
************************************************/

// Store game board in variable and give its children unique names
const $boxes = $('.boxes');
$boxes.children().each(function (i) { $(this).prop('name', i + 1) });

// Check clicked boxes and test against winning patterns; on victory, loads win screen
const checkForWin = player => {
  const checkedBoxes = findCheckedBoxes(player);
  if (checkedBoxes.length === 5) loadVictory('cat');
  else if (testCheckedBoxes(checkedBoxes)) loadVictory(player);
}

// Combine the names of a player's boxes into a string
const findCheckedBoxes = player => {
  let message = '';
  if (player === 'player1') $boxes.find('.box-filled-1').each(function () { message += this.name });
  else $boxes.find('.box-filled-2').each(function () { message += this.name });
  return message;
}

// Test a string representing checked boxes against winning patterns
const testCheckedBoxes = checkedBoxes => {
  if ( /123/.test(checkedBoxes)
    || /456/.test(checkedBoxes)
    || /789/.test(checkedBoxes)
    || /1\d*4\d*7/.test(checkedBoxes)
    || /2\d*5\d*8/.test(checkedBoxes)
    || /3\d*6\d*9/.test(checkedBoxes)
    || /1\d*5\d*9/.test(checkedBoxes)
    || /3\d*5\d*7/.test(checkedBoxes) ) return true;
}

// Resets the board, then loads the victor's win screen
const loadVictory = player => {
  $(`#player2`).removeClass('active');
  $boxes.children().each(function () {
    $(this).removeClass('box-filled-1')
           .removeClass('box-filled-2')
           .css('background-image', 'none');
  })

  const $victoryScreen = $('#finish');
  if (player === 'cat') {
    $victoryScreen.addClass('screen-win-tie');
    $victoryScreen.find('p').text("It's a Tie!"); }
  else if (player === 'player1') $victoryScreen.addClass('screen-win-one');
  else $victoryScreen.addClass('screen-win-two');
  $('#board').hide();
  $victoryScreen.show();
}

// On mouseover of a box not yet selected, display an O or X
$boxes.mouseover(e => {
  if (!$(e.target).hasClass('box-filled-1')
  &&  !$(e.target).hasClass('box-filled-2')) {
    const player = $('.active').prop('id');
    if (player === 'player1') $(e.target).css('background-image', "url('img/o.svg')");
    if (player === 'player2') $(e.target).css('background-image', "url('img/x.svg')");
  }
});

// On mouseout from a box not yet selected, remove an O or X
$boxes.mouseout(e => {
  if (!$(e.target).hasClass('box-filled-1')
  &&  !$(e.target).hasClass('box-filled-2')) $(e.target).css('background-image', 'none');
});

// When a box not yet selected is clicked, add a class to that box, indicate the next player's turn, then check for victory
$boxes.click(e => {
  const player = $('.active').prop('id');
  $('.active').removeClass('active');

  if (!$(e.target).hasClass('box-filled-1')
  &&  !$(e.target).hasClass('box-filled-2')) {
    if (player === 'player1') {
      $(e.target).addClass('box-filled-1');
      $('#player2').addClass('active');
    } else {
      $(e.target).addClass('box-filled-2');
      $('#player1').addClass('active');
    }

    checkForWin(player);
  }
});
