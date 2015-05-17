$(document).ready(function(){
  $('#user-search').keydown(function(e) {
    var key = e.which;
    var newUser = { name : $('#user-search').val() }
    if (key == 13) {
      retrieveProfile(newUser)
    }
  });

  $('#search-button').click(function(){
    var newUser = { name : $('#user-search').val() }
    retrieveProfile(newUser)
  });

  function retrieveProfile(newUser) {
    $.ajax({
      type: 'POST',
      url: '/twitter',
      data: newUser,
      dataType: 'json',
      success: function(data) {
        var tweetArray = data.info[0]
        var currentUser = data.info[1]
        updateProfile(currentUser,tweetArray)
      }
    });
  }

  function updateProfile(user,tweets) {
    for (prop in user) {
      var userProperty = $("." + prop)
      if (userProperty.length == 1) {
        if (prop === "prof_pic") {
          $(userProperty[0].firstChild).attr("src",user[prop]);
        }else{
          userProperty[0].innerHTML = user[prop];
        }
      }else{
        if (prop === "background") {
          $('.jumbotron').css('background-image','url(' + user[prop] + ')')
        }else{
          $.each( userProperty, function(key,value ) {
            value.innerHTML = user[prop];
          });
        }
      }
    }

    $.each(tweets, function(key,value) {
      var $tweetDiv = $("#tweet" + (key + 1))
      $.each($tweetDiv[0].children, function(prop,val) {
        tweetVal = val.className
        if (tweetVal !== "username") {
          if (tweetVal === "tweet_pic") {
            if (value[tweetVal] !== null) {
              var $imgDiv = val.children[0]
              $(val).attr('value','1')
              $($imgDiv).attr('src', "http://" + value[tweetVal].host + value[tweetVal].path)
            }
          }else{
            val.innerHTML = value[tweetVal];
          }
        }
      });
    });
  }

  function sortByDate(elements, order) {
    var arr = [];
    elements.each(function() {
      var obj = {},
      $els = $(this),
      $el = $els[0]
      $created_div = $($el.children)
      time = $created_div[5].innerHTML,
      date = new Date(time),
      timestamp = date.getTime();
      obj.html = $created_div[5].parentElement;
      obj.time = timestamp;

      arr.push( obj );
    });

    var sorted = arr.sort(function(a, b) {
      if( order == 'ASC' ) {
        return a.time > b.time;
      } else {
        return b.time > a.time;
      }

    });
    return sorted;
  };

  function sortByRetweets(elements, order) {
    var arr = [];
    elements.each(function() {
      var obj = {},
      $els = $(this),
      $el = $els[0]
      $retweetDiv = $($el.children)
      $retweetCount = $retweetDiv[2].innerHTML,
      rtNum = parseInt($retweetCount),
      obj.html = $retweetDiv[2].parentElement;
      obj.retweets = rtNum;

      arr.push( obj );
    });

    var sorted = arr.sort(function(a, b) {
      if( order == 'ASC' ) {
        return a.retweets > b.retweets;
      } else {
        return b.retweets > a.retweets;
      }

    });
    return sorted;
  };

  function sortByPic(elements, order) {
    var arr = [];
    elements.each(function() {
      var obj = {},
      $els = $(this),
      $el = $els[0].children[4];
      $picVal = $($el).attr('value')
      hasPic = parseInt($picVal),
      obj.html = $el.parentElement;
      obj.pic = hasPic;

      arr.push( obj );
    });

    var sorted = arr.sort(function(a, b) {
      if( order == 'ASC' ) {
        return a.pic > b.pic;
      } else {
        return b.pic > a.pic;
      }

    });
    return sorted;
  };

  $(function() {
    var $content = $( "#sliderList" );
    var $elements = $( ".tweet" );

    $('#created').click(function() {
      $creationOrder = $( '#created' ).attr('value');
      if ($creationOrder == "newer"){
        var elements = sortByDate($elements, 'ASC');
        $( '#created' ).attr('value','older');
      }else{
        var elements = sortByDate($elements, 'DESC');
        $( '#created' ).attr('value','newer');
      }
      for( var i = 0; i < elements.length; ++i ) {
        $('#sliderList').append($(elements[i].html))
      }
      return false;
    });

    $('#rts').click(function() {
      $retweetOrder = $( '#rts' ).attr('value');
      if ($retweetOrder == 'highest'){
        var elements = sortByRetweets($elements, 'ASC');
        $('#rts').attr('value','lowest');
      }else{
        var elements = sortByRetweets($elements, 'DESC');
        $('#rts').attr('value','highest');
      }
      for( var i = 0; i < elements.length; ++i ) {
        $('#sliderList').append($(elements[i].html))
      }
      return false;
    });

    $('#anyPics').click(function() {
      $picOrder = $( '#anyPics' ).attr('value');
      if ($picOrder == 'yes'){
        var elements = sortByPic($elements, 'ASC');
        $('#anyPics').attr('value','no');
      }else{
        var elements = sortByPic($elements, 'DESC');
        $('#anyPics').attr('value','yes');
      }
      for( var i = 0; i < elements.length; ++i ) {
        $('#sliderList').append($(elements[i].html))
      }
      return false;
    });
  });

});
