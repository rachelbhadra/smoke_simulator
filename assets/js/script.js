$(document).ready(function() {
  let curr = 1;
  let end = 6;
  display(1);

  function display(x) {
    var projects = $("#stuff").children(); // jQuery Function Number 1
    for (var i = 0; i < end; i++) {
      $(projects[i]).hide(); // jQuery Function Number 2
    }
    $(projects[x-1]).show(); // jQuery Function Number 3
    showDot(x-1); 
  }

  function showDot(x) {
    $(".dot").removeClass("active"); // jQuery Function Number 4
    $(".dot:eq(" + String(x) +")").addClass("active"); // jQuery Function Number 5
  }

  $("#next").click(function() { // jQuery Function Number 6
    curr++;
    if (curr > end) {
      $("#next").css("opacity", 0.5); // jQuery Function Number 7
      $("#prev").css("opacity", 1);
      curr = end;
    } else {
      $("#next").css("opacity", 1);
      $("#prev").css("opacity", 1);
    }
    display(curr);
  });

  $("#prev").click(function() {
    curr--;
    if (curr < 1) {
      $("#prev").css("opacity", 0.5);
      $("#next").css("opacity", 1);
      curr = 1;
    } else {
      $("#prev").css("opacity", 1);
      $("#next").css("opacity", 1);
    }
    display(curr);
  });

  $(".dot:eq(0)").click(function() {
    $(this).addClass("active");
    $("#prev").css("opacity", 1);
    $("#next").css("opacity", 1);
    curr = 1;
    display(curr);
  });

  $(".dot:eq(1)").click(function() {
    $(this).addClass("active");
    $("#prev").css("opacity", 1);
    $("#next").css("opacity", 1);
    curr = 2;
    display(curr);
  });

  $(".dot:eq(2)").click(function() {
    $(this).addClass("active");
    $("#prev").css("opacity", 1);
    $("#next").css("opacity", 1);
    curr = 3;
    display(curr);
  });

  $(".dot:eq(3)").click(function() {
    $(this).addClass("active");
    $("#prev").css("opacity", 1);
    $("#next").css("opacity", 1);
    curr = 4;
    display(curr);
  });

  $(".dot:eq(4)").click(function() {
    $(this).addClass("active");
    $("#prev").css("opacity", 1);
    $("#next").css("opacity", 1);
    curr = 5;
    display(curr);
  });

  $(".dot:eq(5)").click(function() {
    $(this).addClass("active");
    $("#prev").css("opacity", 1);
    $("#next").css("opacity", 1);
    curr = 6;
    display(curr);
  });


});
