$(document).ready(function () {
  
  $('#gameModal').modal("show");
  
  $('#newGameButton').click(function () {
    $('#playersModal').modal("show");
  });
  
  $('#startGameButton').click(function () {
    NewGame($('input[name=player1]').val(), $('input[name=player2]').val(), $('input[name=player3]').val(), $('input[name=player4]').val(), $('input[name=player5]').val());
  });
    
  $('#loadGameButton').click(function () {
    LoadGame();
  });
  
  $('.playerGroup button').click(function() {
    var thisButton = $(this);
    $('.playerGroup button').removeClass('active');
    thisButton.addClass('active');
  });
  
  $('.bidGroup button').click(function() {
    var thisButton = $(this);
    $('.playerGroup button').removeClass('active');
    thisButton.addClass('active');
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
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $('.btn-number[data-type="plus"][data-field="'+name+'"]').removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
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

var player1, player2, player3, player4, player5;

function ScoreRound(bid, partner1, partner2)
{
  
}

function NewGame(p1, p2, p3, p4, p5)
{
  player1 = p1;
  player2 = p2;
  player3 = p3;
  player4 = p4;
  player5 = p5;
  SetPlayers(player1, player2, player3, player4, player5);
  SaveGame();
}

function LoadGame()
{
  player1 = localStorage.getItem('player1');
  player2 = localStorage.getItem('player2');
  player3 = localStorage.getItem('player3');
  player4 = localStorage.getItem('player4');
  player5 = localStorage.getItem('player5');
  SetPlayers(player1, player2, player3, player4, player5);
}

function SaveGame()
{
  localStorage.setItem('player1', player1);
  localStorage.setItem('player2', player2);
  localStorage.setItem('player3', player3);
  localStorage.setItem('player4', player4);
  localStorage.setItem('player5', player5);
}

function SetPlayers(p1, p2, p3, p4, p5)
{
  $('#p1Button').html(p1);
  $('#p2Button').html(p2);
  $('#p3Button').html(p3);
  $('#p4Button').html(p4);
  $('#p5Button').html(p5);
}