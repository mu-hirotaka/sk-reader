$(function() {
  var HONOR = ['種', 'ヒヨッコ', 'サッカー少年', 'アマチュア', 'セミプロ', 'プロ', 'レジェンド'];
  var HONOR_IMAGE = ['0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.gif', '5.jpg', '6.jpg'];

  var Person = function (exp, level) {
    this.exp = exp;
    this.level = level;
    this.levelUp = 0;
  }
  Person.prototype = {
    getMaxExp       : function() { return 100; },
    getCurrentExp   : function() { return this.exp; },
    getCurrentLevel : function() { return this.level; },
    addExp : function(value) {
      this.exp += value;
      if (this.getCurrentExp() >= this.getMaxExp()) {
        this.exp = this.getMaxExp();
        this.levelUp = 1;
        this.level++;
      }
    },
    getAvailableExpValue : function() { 
      var exp = [40, 40, 40, 40, 30, 30];
      if (typeof exp[this.getCurrentLevel() - 1] === "undefined") {
        return exp[exp.length - 1];
      } else {
        return exp[this.getCurrentLevel() - 1];
      }
    },
    levelUpNow : function() { return this.levelUp == 1 ? 1 : 0; },
    getLevelName : function() {
      if (typeof HONOR[this.getCurrentLevel() - 1] === "undefined") {
        return HONOR[HONOR.length - 1];
      } else {
        return HONOR[this.getCurrentLevel() - 1];
      }
    },
    getFormattedLevelText : function() { return 'Lv: ' + this.getCurrentLevel() + ' (' + this.getLevelName() + ')' },
    getLevelImagePath : function() { return '/images/' + this.getLevelImage(); },
    getLevelImage : function() {
      if (typeof HONOR_IMAGE[this.getCurrentLevel()-1] === "undefined") {
        return HONOR_IMAGE[HONOR_IMAGE.length - 1];
      } else {
        return HONOR_IMAGE[this.getCurrentLevel()-1];
      }
    }
  };

  var $hpValue = $('.hp-value');
  var $hpGauge = $('.hp-gauge > span');
  var $level = $('.level');
  var $playerImage = $('#player-image');

  var level = parseInt(localStorage.getItem('level')) || 1;
  var exp = parseInt(localStorage.getItem('exp')) || 0;
  var person = new Person(exp, level);
  var honor_img = person.getLevelImage();

  $level.text(person.getFormattedLevelText());
  $hpValue.text(person.getCurrentExp());
  $hpGauge.css('width', parseInt((person.getCurrentExp()/person.getMaxExp()) * 100) + '%');
  $playerImage.css("background-image", "url('" + person.getLevelImagePath() + "')");
  $playerImage.addClass('player-image');

  person.addExp(person.getAvailableExpValue());
  var width = Math.min(parseInt((person.getCurrentExp()/person.getMaxExp()) * 100), 100);

  $hpValue.animateNumber(person.getCurrentExp(), { duration: 2000 });
  $hpGauge.animate({ width: width + '%' }, { duration: 2000, complete: function() {
    if (person.levelUpNow()) {
      $playerImage.fadeOut();
      $hpGauge.animate({ width: '0%' }, { duration: 1000, complete: function() {
        $hpValue.text(0);
        localStorage.setItem('exp', 0);
        localStorage.setItem('level', person.getCurrentLevel());
        $level.text(person.getFormattedLevelText());
        $playerImage.css("background-image", "url('" + person.getLevelImagePath() + "')");
        $playerImage.fadeIn();
//        history.back();
      }});
    } else {
      localStorage.setItem('exp', person.getCurrentExp());
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
