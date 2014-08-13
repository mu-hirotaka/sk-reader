$(function() {
  var HONOR = ['ヒヨッコ', 'サッカー少年', 'アマチュア', 'セミプロ', 'プロ'];
  var GAUGEWIDTH = 80;
  var max = 100;

  var $hpValue = $('.hp-value');
  var $hpGauge = $('.hp-gauge');
  var $level = $('.level');

  var level = localStorage.getItem('level');
  if (level) {

  } else {
    level = 1;
  }
  $level.text('Lv: ' + level + ' (' + HONOR[level - 1] + ')');

  var exp = localStorage.getItem('exp');
  if (exp) {
    exp = parseInt(exp);
  } else {
    exp = 0;
  }
  $hpValue.text(exp);

  var beforeWidth = parseInt( (exp/max) * GAUGEWIDTH);
  $hpGauge.css('width', beforeWidth + '%');

  exp += 30;
  var width = Math.min(parseInt((exp/max) * GAUGEWIDTH), GAUGEWIDTH);

  $hpGauge.animate({ width: width + '%' }, { duration: 2000, complete: function() {
    $hpValue.text(exp);
    if (exp >= max) {
      $hpGauge.animate({ width: '0%' }, { duration: 1000, complete: function() {
        $hpValue.text(0);
        localStorage.setItem('exp', 0);
        localStorage.setItem('level', ++level);
        $level.text('Lv: ' + level + ' (' + HONOR[level - 1] + ')');
        history.back();
      }});
    } else {
      localStorage.setItem('exp', exp);
      history.back();
    }
  }});


  function getUrlVars() { 
    var vars = [], hash; 
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
    for(var i = 0; i < hashes.length; i++) { 
      hash = hashes[i].split('='); 
      vars[hash[0]] = hash[1]; 
    }
    return vars; 
  }
});
