$('window').ready(() => {
  /************************************************
    START SCREEN AND WIN SCREEN
  ************************************************/

  $('#player1').append('<span></span>');
  $('#player2').append('<span></span>');

  // Create start screen and assign 'click' listener to 'Start game' button
  const $startScreen = $(`
      <div class="screen screen-start" id="start">
        <header>
          <h1>Tic Tac Toe</h1>
          <label for="#p1-name">Player 1</label><br>
          <input type="text" id="p1-name" placeholder="Enter your name"><br>
          <label for="#p2-name">Player 2</label><br>
          <input type="text" id="p2-name" placeholder="Enter your name"><br>
          <a href="#" class="button" name="pvp">P1 vs P2</a>
          <a href="#" class="button" name="pve">P1 vs AI</a>
        </header>
      </div>
    `);
  $startScreen.find('a').click(e => {
    const gameInfo = { p1: $('#p1-name').val() };
    if (e.target.name === 'pvp') {
      gameInfo.p2 = $('#p2-name').val();
      gameInfo.ai = false;
    } else {
      gameInfo.p2 = 'Computer';
      gameInfo.ai = true;
    }

    $startScreen.hide();
    $('#player1 span').text(gameInfo.p1);
    $('#player2 span').text(gameInfo.p2);
    if (gameInfo.ai) $('#player2 span').prop('name', 'ai');
    else $('#player2 span').prop('name', 'p2');
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
    's' for side
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

  // Check clicked boxes and test against winning patterns; on victory, loads win screen
  const checkForWin = player => {
    const checkedBoxes = findCheckedBoxes(player);
    if (testCheckedBoxes(checkedBoxes.string)) {
      loadVictory(player);
      return false;
    } else if (checkedBoxes.string.split(/\d\d/).length === 6) {
      loadVictory('cat');
      return false;
    } else return true;
  }

  // Combine the names of a player's boxes into a string
  const findCheckedBoxes = player => {
    const boxInfo = { string: '' };
    if (player === 'player1') {
      boxInfo.$elements = $boxes.find('.box-filled-1');
      boxInfo.$elements.each(function () {
        boxInfo.string += this.name;
      });
    } else {
      boxInfo.$elements = $boxes.find('.box-filled-2');
      boxInfo.$elements.each(function () { boxInfo.string += this.name });
    }
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
      || /y\w*y\w*y/.test(boxesString)
      || /z\w*z\w*z/.test(boxesString) ) return true;
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

    if (!$(e.target).hasClass('box-filled-1')
    &&  !$(e.target).hasClass('box-filled-2')) {
      $('.active').removeClass('active');
      console.log('no class');
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

  // This function looks at the board, decides which line or square to mark, then makes the changes to the DOM. Triggers victory when appropriate.
    // P1 === 0
    // AI === X
  const aiBrain = () => {
    const o = findCheckedBoxes('player1');
    const x = findCheckedBoxes('player2');

    const regex = winOrBlock(x.string, o.string) ||
                  winOrBlock(o.string, x.string) ||
                  findFork(o.string, x.string) ||
                  findOther(o, x);
    const $li = $('.boxes').children().filter(function () {
      if (!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')) {
        return regex.test(this.name);
      }
    });
    markBoard($li);

    $('#player2').removeClass('active');
    $('#player1').addClass('active');

    setTimeout(() => checkForWin('player2'), 300);
  }

  // Search the board for unblocked rows of 2. Args: (you, them) finds win, (them, you) finds block.
  const winOrBlock = (active, reactive) => {
    if      (/0\d\w*0\d/.test(active) && !/0\d/.test(reactive)) return /0\d/;
    else if (/1\d\w*1\d/.test(active) && !/1\d/.test(reactive)) return /1\d/;
    else if (/2\d\w*2\d/.test(active) && !/2\d/.test(reactive)) return /2\d/;
    else if (/\d0\w*\d0/.test(active) && !/\d0/.test(reactive)) return /\d0/;
    else if (/\d1\w*\d1/.test(active) && !/\d1/.test(reactive)) return /\d1/;
    else if (/\d2\w*\d2/.test(active) && !/\d2/.test(reactive)) return /\d2/;
    else if (    /y\w*y/.test(active) &&   !/y/.test(reactive)) return /y/;
    else if (    /z\w*z/.test(active) &&   !/z/.test(reactive)) return /z/;
    else return false;
  }

  // Search the board for potential forks. Args: (you, them) creates your fork, (them, you) blocks theirs.
  const findFork = (active, reactive) => {
    if ( (/yc\w*yc/.test(active) && !/zc/.test(reactive)
          || /zc\w*zc/.test(active) && !/yc/.test(reactive))
        && !/s/.test(reactive) ) {
        return /01/;
    } else return false;
  }

  const findOther = (player, comp) => {
    if (!/11/.test(player.string + comp.string)) {
      // Mid first
      return /11/;
    } else if (/yc/.test(player.string)
            && !/yc\w*yc/.test(player.string)
            && !/yc/.test(comp.string)) {
      // Opposite corner, y
      return /yc/;
    } else if (/zc/.test(player.string)
            && !/zc\w*zc/.test(player.string)
            && !/zc/.test(comp.string)) {
      // Opposite corner, z
      return /zc/;
    } else if (!/c\w*c\w*c\w*c/.test(player.string + comp.string)) {
      // Empty corner
      return /c/;
    } else {
      // Empty side
      return /s/
    }
  }

  const markBoard = $li => {
    setTimeout(() => {
      $li.addClass('box-filled-2').css('background-image', "url('img/x.svg')");
    }, 100);
  };
});
