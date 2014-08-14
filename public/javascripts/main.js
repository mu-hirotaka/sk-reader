$(function() {
  var HONOR = ['ヒヨッコ', 'サッカー少年', 'アマチュア', 'セミプロ', 'プロ'];
  var HONOR_IMAGE = ['1.jpg', '2.jpg', '3.jpg', '4.gif', '5.jpg'];
  var GAUGEWIDTH = 100;
  var max = 100;

  var $hpValue = $('.hp-value');
  var $hpGauge = $('.hp-gauge > span');
  var $level = $('.level');
  var $playerImage = $('#player-image');

  var level = localStorage.getItem('level');
  if (level) {

  } else {
    level = 1;
  }
  var honor = (typeof HONOR[level - 1] === "undefined") ? 'レジェンド' : HONOR[level - 1];
  var honor_img = (typeof HONOR_IMAGE[level-1] === "undefined") ? '5.jpg' : HONOR_IMAGE[level-1];
  if (level >= 10) {
    honor_img = '6.jpg';
  }
  $level.text('Lv: ' + level + ' (' + honor + ')');
  $playerImage.css("background-image", "url('/images/" + honor_img + "')");
  $playerImage.addClass('player-image');

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

  exp = Math.min(max, exp);
  $hpValue.animateNumber(exp, { duration: 2000 });
  $hpGauge.animate({ width: width + '%' }, { duration: 2000, complete: function() {
    if (exp >= max) {
      $playerImage.fadeOut();
      $hpGauge.animate({ width: '0%' }, { duration: 1000, complete: function() {
        $hpValue.text(0);
        localStorage.setItem('exp', 0);

        var tmpValue = localStorage.getItem('tag3');
        if (tmpValue >= 5 && level == 4) {
          level = 10;
        } else {
          level++;
        }
        localStorage.setItem('level', level);

        var honor = (typeof HONOR[level - 1] === "undefined") ? 'レジェンド' : HONOR[level - 1];
        var honor_img = (typeof HONOR_IMAGE[level-1] === "undefined") ? '5.jpg' : HONOR_IMAGE[level-1];
        if (level >= 10) {
          honor_img = '6.jpg';
        }

        $level.text('Lv: ' + level + ' (' + honor + ')');
        $playerImage.css("background-image", "url('/images/" + honor_img + "')");
        $playerImage.fadeIn();
//        history.back();
      }});
    } else {
      localStorage.setItem('exp', exp);
//      history.back();
    }
  }});

  createGraph();

  function createGraph() {
    var TAG = {
      1: { label: 'Jリーグ', color: '#aaf2fb', img: '1.png' },
      2: { label: '日本代表', color: '#ffb6b9', img: '2.jpg' },
      3: { label: 'バルセロナ', color: '#ffe361', img: '3.jpg' },
      4: { label: 'ミラン', color: '#fbaa6e', img: '4.jpg' },
      5: { label: 'ギグス', color: '#A8BECB', img: '5.jpg' }
    };
    var BADGE = {
      1: 'Jオタ',
      2: '代表の誇り',
      3: 'カタルーニャの魂',
      4: 'ミラニスタ',
      5: 'レジェンド',
    };
    var vars = getUrlVars();
    var tagId = vars.tag;
    var segments = [];
    _.each(TAG, function(value, key, list) {
      var tmpValue = localStorage.getItem('tag' + key);
      var count = 0;
      if (tmpValue) {
        count = parseInt(tmpValue);
      }
      if (tagId == key) {
        localStorage.setItem('tag' + key, ++count);
        segments.push({ label: value.label, color: value.color, value: count });
        if (count >= 5) {
          $('#honor').prepend('<div class="honor" id="honor-id' + key + '">' + BADGE[key]+ '</div>');
          $('#honor-id' + key).css("background-image", "url('/images/honor/" + TAG[key].img + "')");
        }
      } else if (count > 0) {
        segments.push({ label: value.label, color: value.color, value: count });
        if (count >= 5) {
          $('#honor').prepend('<div class="honor" id="honor-id' + key + '">' + BADGE[key] + '</div>');
          $('#honor-id' + key).css("background-image", "url('/images/honor/" + TAG[key].img + "')");
        }
      }
    });

    var options = {
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\">&nbsp;&nbsp;&nbsp;</span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };
    var ctx = $("#myChart").get(0).getContext("2d");
    var myChart = new Chart(ctx).Doughnut(segments, options);
    $("#my-chart-legend").html(myChart.generateLegend());
  }

  function getUrlVars() {
    var vars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
    for(var i = 0; i < hashes.length; i++) { 
      hash = hashes[i].split('='); 
      vars[hash[0]] = hash[1]; 
    }
    return vars; 
  }
});
