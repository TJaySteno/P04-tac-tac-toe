$('window').ready(() => {
  /************************************************
    START SCREEN AND WIN SCREEN
  ************************************************/

  // Create start screen and assign 'click' listener to 'Start game' button
  const $startScreen = $(`
      <div class="screen screen-start" id="start">
        <header>
          <h1>Tic Tac Toe</h1>
          <label for="#p1-name">Player 1</label><br>
          <input type="text" id="p1-name" placeholder="Enter your name"><br>
          <label for="#p2-name">Player 2</label><br>
          <input type="text" id="p2-name" placeholder="Enter your name"><br>
          <a href="#" class="button">P1 vs P2</a>
          <a href="#" class="button">P1 vs AI</a>
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

  const $boxes = $('.boxes');

  /* Give each box a unique name
    00yc 01s  02zc
    10s  11yz 12s
    20zc 21s  22yc

    Horiz lines marked by first digit
    Vert lines marked by second digit
    'y' for 00 to 22 line, and 'z' for 02 to 20 line
    'c' for corner, 's' for side, 'yz' is mid
  */
  let tens = 0;
  let ones = -1;
  $boxes.children().each(function (i) {
    if (i === 3 || i === 6) {
      tens++;
      ones = 0;
    } else {
      ones++;
    };
    $(this).prop('name', String(tens) + ones);
    if (i === 4) this.name += 'yz';
    else if (i % 2 === 1) this.name += 's';
    else if (i === 0 || i === 8) this.name += 'yc';
    else if (i === 2 || i === 6) this.name += 'zc';
    console.log(this.name);
  });

  // Check clicked boxes and test against winning patterns; on victory, loads win screen
  const checkForWin = player => {
    const checkedBoxes = findCheckedBoxes(player);
    if (testCheckedBoxes(checkedBoxes)) loadVictory(player);
    else if (checkedBoxes.split(/\d\d/).length === 6) loadVictory('cat');
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
    if ( /0\d\w*0\d\w*0\d/.test(checkedBoxes)
      || /1\d\w*1\d\w*1\d/.test(checkedBoxes)
      || /2\d\w*2\d\w*2\d/.test(checkedBoxes)
      || /\d0\w*\d0\w*\d0/.test(checkedBoxes)
      || /\d1\w*\d1\w*\d1/.test(checkedBoxes)
      || /\d2\w*\d2\w*\d2/.test(checkedBoxes)
      || /y\w*y\w*y/.test(checkedBoxes)
      || /z\w*z\w*z/.test(checkedBoxes) ) return true;
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
});
