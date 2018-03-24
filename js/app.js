$('window').ready(() => {
  /************************************************
    START SCREEN AND WIN SCREEN
  ************************************************/

  // Create space for names, if entered
  $('#player1').append('<span></span>');
  $('#player2').append('<span></span>');

  // Create start and win screens
  const $startScreen = $(`
      <div class="screen screen-start" id="start">
        <header>
          <h1>Tic Tac Toe</h1>
          <label for="#p1-name">Player 1</label><br>
          <input type="text" id="p1-name" placeholder="Enter name"><br>
          <label for="#p2-name">Player 2</label><br>
          <input type="text" id="p2-name" placeholder="Enter name"><br>
          <a href="#" class="button" name="pvp">P1 vs P2</a>
          <a href="#" class="button" name="pve">P1 vs AI</a>
        </header>
      </div>
    `);
    const $winScreen = $(`
        <div class="screen screen-win" id="finish">
          <header>
            <h1>Tic Tac Toe</h1>
            <p class="message">Winner</p>
            <a href="#" class="button">New game</a>
          </header>
        </div>
      `).hide();

  $startScreen.find('a').click(e => {
    // On click of an anchor element, pull appropriate info and hide start screen...
    const gameInfo = { p1: $('#p1-name').val() };
    if (e.target.name === 'pvp') {
      gameInfo.p2 = $('#p2-name').val();
      gameInfo.ai = false;
    } else {
      gameInfo.p2 = 'Computer';
      gameInfo.ai = true;
    }
    $startScreen.hide();

    // ...then fill board with proper info, give 'name' to #player2 in order to tell app later which was selected
    $('#player1 span').text(gameInfo.p1);
    $('#player2 span').text(gameInfo.p2);
    if (gameInfo.ai) $('#player2 span').prop('name', 'ai');
    else $('#player2 span').prop('name', 'p2');
    $('#board').show();
    $('#player1').addClass('active');
  });

  // On clicking anchor element on win screen, reset and hide win screen, then show start screen
  $winScreen.find('a').click(() => {
    $winScreen.hide()
              .removeClass('screen-win-tie')
              .removeClass('screen-win-one')
              .removeClass('screen-win-two')
              .find('p').text('Winner');
    $('#start').show();
  });

  // Hide game board, then insert start and win screens before and after
  $('#board').hide()
             .before($startScreen)
             .after($winScreen);



  /************************************************
    BOARD SCREEN - BASIC
  ************************************************/

  const $boxes = $('.boxes');

  // Give each box a unique name
  /*
    00yc  01s   02zc   - Horiz lines marked by first digit
    10s   11yz  12s    - Vert lines marked by second digit
    20zc  21s   22yc   - Diag marked by 'y' (00 -> 22) and 'z' (02 -> 20); 's' for side
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
  });

  // Test boxes against winning patterns; on victory or full board, load win screen
  const checkForWin = player => {
    const checkedBoxes = findCheckedBoxes(player);
    if (testCheckedBoxes(checkedBoxes)) {
      loadVictory(player);
      return false;
    } else if (checkedBoxes.split(/\d\d/).length === 6) {
      loadVictory('cat');
      return false;
    } else return true;
  }

  // Combine the names of a player's boxes into a string for regex testing
  const findCheckedBoxes = player => {
    let boxInfo = '';
    if (player === 'player1') $boxes.find('.box-filled-1').each(function () { boxInfo += this.name });
    else                      $boxes.find('.box-filled-2').each(function () { boxInfo += this.name });
    return boxInfo;
  }

  // Test a string representing checked boxes against winning patterns
  const testCheckedBoxes = boxesString => {
    if ( /0\d\w*0\d\w*0\d/.test(boxesString)
      || /1\d\w*1\d\w*1\d/.test(boxesString)
      || /2\d\w*2\d\w*2\d/.test(boxesString)
      || /\d0\w*\d0\w*\d0/.test(boxesString)
      || /\d1\w*\d1\w*\d1/.test(boxesString)
      || /\d2\w*\d2\w*\d2/.test(boxesString)
      ||       /y\w*y\w*y/.test(boxesString)
      ||       /z\w*z\w*z/.test(boxesString) ) return true;
  }

  // On win or tie, reset and hide the board, then load the proper win screen
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
      $victoryScreen.find('p').text("It's a Tie!");
    } else if (player === 'player1') {
      let text = $('#player1 span').text();
      if (text !== '') text += ' wins!';
      else text = 'Winner!';
      $victoryScreen.addClass('screen-win-one');
      $victoryScreen.find('p').text(text);
    } else {
      let text = $('#player2 span').text();
      if (text !== '') text += ' wins!';
      else text = 'Winner!';
      $victoryScreen.addClass('screen-win-two');
      $victoryScreen.find('p').text(text);
    }
    $('#board').hide();
    $victoryScreen.show();
  }

  // On mouseover of an un-filled box, display an O or X
  $boxes.mouseover(e => {
    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) {
      const player = $('.active').prop('id');
      if (player === 'player1') $(e.target).css('background-image', "url('img/o.svg')");
      if (player === 'player2') $(e.target).css('background-image', "url('img/x.svg')");
    }
  });

  // On mouseover of an un-filled box, remove an O or X
  $boxes.mouseout(e => {
    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) $(e.target).css('background-image', 'none');
  });

  // Upon clicking an un-filled box: add 'box-filled' class, indicate the next player's turn, then check for victory. Calls A.I. scripts when needed.
  $boxes.click(e => {
    const player = $('.active').prop('id');

    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) {
      $('.active').removeClass('active');
      if (player === 'player1') {
        $(e.target).addClass('box-filled-1');
        $('#player2').addClass('active');
      } else {
        $(e.target).addClass('box-filled-2');
        $('#player1').addClass('active');
      }

      if (checkForWin(player)
      && $('#player2 span').prop('name') === 'ai') aiBrain();
    }
  });







  /************************************************
    BOARD SCREEN - vs A.I.
  ************************************************/

  // Search for immediate threats; unblocked rows of 2
    // Args: (AI, P1) finds win, (P1, AI) finds block
  const winOrBlock = (subject, other) => {
    if      (/0\d\w*0\d/.test(subject) && !/0\d/.test(other)) return /0\d/;
    else if (/1\d\w*1\d/.test(subject) && !/1\d/.test(other)) return /1\d/;
    else if (/2\d\w*2\d/.test(subject) && !/2\d/.test(other)) return /2\d/;
    else if (/\d0\w*\d0/.test(subject) && !/\d0/.test(other)) return /\d0/;
    else if (/\d1\w*\d1/.test(subject) && !/\d1/.test(other)) return /\d1/;
    else if (/\d2\w*\d2/.test(subject) && !/\d2/.test(other)) return /\d2/;
    else if (    /y\w*y/.test(subject) &&   !/y/.test(other)) return /y/;
    else if (    /z\w*z/.test(subject) &&   !/z/.test(other)) return /z/;
    else return false;
  }

  // Prevent potential forks; only one possible since someone always starts mid
  const findFork = (o, x) => {
    if ( !/s/.test(x)
       && (  /yc\w*yc/.test(o) && !/zc/.test(x)
          || /zc\w*zc/.test(o) && !/yc/.test(x)) ) return /01/;
    else return false;
  }

  // Prioritize other squares: mid, opposite corners, other corners, then sides
  const findOther = (player, comp) => {
    if (!/11/.test(player + comp)) { return /11/; }
    else if (/yc/.test(player)
         && !/yc\w*yc/.test(player + comp)) { return /yc/; }
    else if (/zc/.test(player)
         && !/zc\w*zc/.test(player + comp)) { return /zc/; }
    else if (!/c\w*c\w*c\w*c/.test(player + comp)) { return /c/; }
    else { return /s/ }
  }

  // Style a given box after a slight pause (immediate play felt wrong/weird)
  const markBoard = $box => {
    setTimeout(() => {
      $box.addClass('box-filled-2').css('background-image', "url('img/x.svg')");
    }, 100);
  };

  // Survey the board, decide which square to mark, and check for victory
  const aiBrain = () => {
    const o = findCheckedBoxes('player1');
    const x = findCheckedBoxes('player2');

    // In order test for: win, block, potential fork, otherwise find best remaining square
    const regex = winOrBlock(x, o) ||
                  winOrBlock(o, x) ||
                  findFork(o, x) ||
                  findOther(o, x);

    // Test regex against unfilled boxes, mark the proper box, and end turn
    const $box = $('.boxes').children().filter(function () {
      if (!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')) return regex.test(this.name) });

    if ($box.length === 1) markBoard($box);
    else markBoard($($box[0]));

    $('#player2').removeClass('active');
    $('#player1').addClass('active');

    setTimeout(() => checkForWin('player2'), 150);
  }
});
