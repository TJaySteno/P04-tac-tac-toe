const loadVictory = player => {
  $(`#player2`).removeClass('active');
  console.log($(`#${player}`).hasClass('active'));
  $('.boxes').children().each(function () {
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

// Test a checkedBoxes string against winning patterns
const playerWins = checkedBoxes => {
  if ( /123/.test(checkedBoxes)
    || /456/.test(checkedBoxes)
    || /789/.test(checkedBoxes)
    || /1\d*4\d*7/.test(checkedBoxes)
    || /2\d*5\d*8/.test(checkedBoxes)
    || /3\d*6\d*9/.test(checkedBoxes)
    || /1\d*5\d*9/.test(checkedBoxes)
    || /3\d*5\d*7/.test(checkedBoxes) ) return true;
}

// Check clicked boxes and test against winning patterns; on victory, loads win screen
const checkForWin = player => {
  let checkedBoxes = function () {
    let message = '';
    if (player === 'player1') $('.boxes').find('.box-filled-1').each(function () { message += this.name });
    else $('.boxes').find('.box-filled-2').each(function () { message += this.name });
    return message;
  }();
  console.log(checkedBoxes.length);
  if (checkedBoxes.length === 5) loadVictory('cat');
  else if (playerWins(checkedBoxes)) loadVictory(player);
}

(() => {
  // Store board and assign unique names to each box
  const $boxes = $('.boxes');

  $boxes.children().each(function (i) { $(this).prop('name', i + 1) });

  $boxes.mouseover(e => {
    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) {
      const player = $('.active').prop('id');
      if (player === 'player1') $(e.target).css('background-image', "url('img/o.svg')");
      if (player === 'player2') $(e.target).css('background-image', "url('img/x.svg')");
    }
  });

  $boxes.mouseout(e => {
    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) $(e.target).css('background-image', 'none');
  });

  $boxes.click(e => {
    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) {
      const player = $('.active').prop('id');
      $('.active').removeClass('active');

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
    $('#start').show();
  });

  $('#board').hide().before($startScreen).after($winScreen);

})()
