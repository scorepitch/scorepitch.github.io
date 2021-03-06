$(document).ready(function () {

  $('#playersModal').on('shown.bs.modal', function () {
    ClearPlayers();
    $('body').addClass('modal-open');
  });

  // Check storage for game
  $('#clearStorage').click(function() {
    localStorage.clear();
  });

  if(localStorage.getItem('player1') != null)
  {
    $('#gameModal').modal('show');
  }
  else {
    $('#playersModal').modal('show');
  }

  $('#playersModal').on('shown.bs.modal', function () {
    $('body').addClass('modal-open');
  });

  // New game
  $('.newGameButton').click(function () {
    $('#playersModal').modal('show');
    ClearPlayers();
  });

  // Start game
  $('#startGameButton').click(function () {
    $('#gameModal').modal('hide');
    NewGame();
  });

  // Load game
  $('#loadGameButton').click(function () {
    LoadGame();
  });

  // Score round
  $('#scoreButton').click(function() {
    if(!Validate())
    {
      return;
    }
    ScoreRound();
  });

  // Undo round
  $('#undoButton').click(function() {
    UndoRound();
  });

  // Play again
  $('#playAgainButton').click(function() {
    PlayAgain();
  });

  // Toggle player buttons, 2 max
  $('.playerGroup button').click(function() {
    var thisButton = $(this);
    if(numSelected > 1)
    {
        $('.playerGroup button').removeClass('active');
        numSelected = 1;
        lastSelected.addClass('active');
    }
    thisButton.addClass('active');
    lastSelected = thisButton;
    numSelected++;
    if(numSelected == 2)
    {
      $('#partnerMessage').removeClass('hidden');
      $('#partnerMessage').addClass('hidden');
    }
  });

  // Toggle bid buttons, 1 max
  $('.bidGroup button').click(function() {
    var thisButton = $(this);
    $('.bidGroup button').removeClass('active');
    thisButton.addClass('active');
    $('#bidMessage').removeClass('hidden');
    $('#bidMessage').addClass('hidden');
  });

  /* Number input  http://bootsnipp.com/snippets/featured/buttons-minus-and-plus-in-input */
  $('.btn-number').click(function(e){
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $('input[name="'+fieldName+'"]');
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {

            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {

    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $('.btn-number[data-type="minus"][data-field="'+name+'"]').removeAttr('disabled')
    } else {
        //alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $('.btn-number[data-type="plus"][data-field="'+name+'"]').removeAttr('disabled')
    } else {
        //alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
});
$('input-number').keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});
/* End number input */

var player1 = 'Player 1', player2 = 'Player 2', player3 = 'Player 3', player4 = 'Player 4', player5 = 'Player 5';
var p1Score = 0, p2Score = 0, p3Score = 0, p4Score = 0, p5Score = 0;
var p1PrevScore = 0, p2PrevScore = 0, p3PrevScore = 0, p4PrevScore = 0, p5PrevScore = 0;
var numSelected = 0;
var lastSelected;
var shootIt = 1;

function ScoreRound()
{
  var points = $('#pointsScored').val();
  var otherPoints = 13-points;
  var bid = $('.bidGroup button.active').html();

  // Did they shoot the moon?
  if (bid == "S")
  {
    bid = 13;
    shootIt = 2;
  }

  // Did they double shoot the moon?
  if (bid == "DS")
  {
    bid = 13;
    shootIt = 4;
  }

  // Did they make their bid?
  if (+points < +bid)
    points = -1*bid*shootIt;

  // Get text from partner buttons
  var partners = $('.playerGroup button.active');
  var partner1 = partners.eq(0).html();
  var partner2 = partners.eq(1).html();

  // Read previous round score from the table to add new points for new score
  try
  {
    var lastRow = $('.scoreTable tbody tr:last');
    var p1PrevScore = lastRow.get(0).children[0].firstChild.data;
    var p2PrevScore = lastRow.get(0).children[1].firstChild.data;
    var p3PrevScore = lastRow.get(0).children[2].firstChild.data;
    var p4PrevScore = lastRow.get(0).children[3].firstChild.data;
    var p5PrevScore = lastRow.get(0).children[4].firstChild.data;
  } catch (e)
  {
    var p1PrevScore = 0;
    var p2PrevScore = 0;
    var p3PrevScore = 0;
    var p4PrevScore = 0;
    var p5PrevScore = 0;
  }

  // Check if each player was a partner, give points
  var p1Score = player1 == partner1 || player1 == partner2 ? (+p1PrevScore + +points * +shootIt) : (+p1PrevScore + +otherPoints);
  var p2Score = player2 == partner1 || player2 == partner2 ? (+p2PrevScore + +points * +shootIt) : (+p2PrevScore + +otherPoints);
  var p3Score = player3 == partner1 || player3 == partner2 ? (+p3PrevScore + +points * +shootIt) : (+p3PrevScore + +otherPoints);
  var p4Score = player4 == partner1 || player4 == partner2 ? (+p4PrevScore + +points * +shootIt) : (+p4PrevScore + +otherPoints);
  var p5Score = player5 == partner1 || player5 == partner2 ? (+p5PrevScore + +points * +shootIt) : (+p5PrevScore + +otherPoints);

  // Add scores to table
  var roundData = '<tr><td>' + p1Score + '</td><td>' + p2Score + '</td><td>' + p3Score + '</td><td>' + p4Score + '</td><td>' + p5Score + '</td><td>' + bid + '</td></tr>';
  var table = $('.scoreTable tbody');
  table.append(roundData);

  // Reset form
  $('.playerGroup button').removeClass('active');
  $('.bidGroup button').removeClass('active');
  lastSelected = 0;
  numSelected = 0;

  var p1Win = p1Score >= 52 && p1Score >= Math.max(p2Score, p3Score, p4Score, p5Score);
  var p2Win = p2Score >= 52 && p2Score >= Math.max(p1Score, p3Score, p4Score, p5Score);
  var p3Win = p3Score >= 52 && p3Score >= Math.max(p1Score, p2Score, p4Score, p5Score);
  var p4Win = p4Score >= 52 && p4Score >= Math.max(p1Score, p2Score, p3Score, p5Score);
  var p5Win = p5Score >= 52 && p5Score >= Math.max(p1Score, p2Score, p3Score, p4Score);
  if(p1Win || p2Win || p3Win || p4Win || p5Win)
  {
    WinGame(p1Win, p2Win, p3Win, p4Win, p5Win);
  }
  SaveGame();
}

function WinGame(p1Win, p2Win, p3Win, p4Win, p5Win)
{
  var winners = [];
  if(p1Win)
  {
    winners.push([player1, p1Score]);
  }

  if(p2Win)
  {
    winners.push([player2, p2Score]);
  }

  if(p3Win)
  {
    winners.push([player3, p3Score]);
  }

  if(p4Win)
  {
    winners.push([player4, p4Score]);
  }

  if(p5Win)
  {
    winners.push([player5, p5Score]);
  }

  var message = '';
  if(winners.length > 0)
  {
    for(var i = 0; i < winners.length; i++)
    {
      if(i == 0)
      {
        message += winners[i][0];
      }
      else if(i == winners.length-1)
      {
        message += ' and ' + winners[i][0];
      }
      else
      {
        message += ', ' + winners[i][0];
      }

    }
    if(winners.length > 1)
    {
      message += ' tie<br>with a score of ' + winners[0][1] + '!';
    }
    else {
      message += ' wins<br>with a score of ' + winners[0][1] + '!';
    }
  }

  $('#winMessage').html(message);
  $('#winModal').modal('show');
}

function UndoRound()
{
  var lastRow = $('.scoreTable tbody tr:last');
  lastRow.remove();
  SaveGame();
}

function NewGame()
{
  var p1 = $('input[name=player1]').val();
  var p2 = $('input[name=player2]').val();
  var p3 = $('input[name=player3]').val();
  var p4 = $('input[name=player4]').val();
  var p5 = $('input[name=player5]').val();
  SetPlayers(p1, p2, p3, p4, p5);
  ClearGame();
  SaveGame();
}

function LoadGame()
{
  player1 = localStorage.getItem('player1');
  player2 = localStorage.getItem('player2');
  player3 = localStorage.getItem('player3');
  player4 = localStorage.getItem('player4');
  player5 = localStorage.getItem('player5');
  $('.scoreTable tbody').append(localStorage.getItem('table'));
  SetPlayers(player1, player2, player3, player4, player5);
}

function PlayAgain()
{
  ClearGame();
}

function SaveGame()
{
  localStorage.setItem('player1', player1);
  localStorage.setItem('player2', player2);
  localStorage.setItem('player3', player3);
  localStorage.setItem('player4', player4);
  localStorage.setItem('player5', player5);
  localStorage.setItem('table', $('.scoreTable tbody').html());
}

function ClearPlayers()
{
  $('#players-input input').each(function(i, element)
  {
    element.val('');
  });
  SetPlayers('Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5');
}

function ClearGame()
{
  // If it was on the max or min value, the plur or minus will still be disabled
  //$('#pointsScored').val(7);
  $('.scoreTable tbody').empty();
  p1Score = 0;
  p2Score = 0;
  p3Score = 0;
  p4Score = 0;
  p5Score = 0;
}

function SetPlayers(p1, p2, p3, p4, p5)
{
  player1 = p1 ? p1 : "Player 1";
  player2 = p2 ? p2 : "Player 2";
  player3 = p3 ? p3 : "Player 3";
  player4 = p4 ? p4 : "Player 4";
  player5 = p5 ? p5 : "Player 5";
  if(p1)
  {
    $('#p1Button').html(p1);
    $('#p1Table').html(p1);
  }

  if(p2)
  {
    $('#p2Button').html(p2);
    $('#p2Table').html(p2);
  }

  if(p3)
  {
    $('#p3Button').html(p3);
    $('#p3Table').html(p3);
  }

  if(p4)
  {
    $('#p4Button').html(p4);
    $('#p4Table').html(p4);
  }

  if(p5)
  {
    $('#p5Button').html(p5);
    $('#p5Table').html(p5);
  }
}

function Validate()
{
  var result = true;
  var bid = $('.bidGroup button.active');
  var partners = $('.playerGroup button.active');
  $('.validate').removeClass('hidden');

  if(bid.length == 0)
  {
    result = false;
  }
  else {
    $('#bidMessage').addClass('hidden');
  }

  if(partners.length < 2)
  {
    result = false;
  }
  else {
    $('#partnerMessage').addClass('hidden');
  }

  if(result)
  {
    $('.validate').addClass('hidden');
  }
  return result;
}
