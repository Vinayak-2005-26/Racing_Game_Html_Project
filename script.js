document.addEventListener("DOMContentLoaded", function () {
  let anim_id;

  const container = document.getElementById("container");
  const car = document.getElementById("car");
  const car_1 = document.getElementById("car_1");
  const car_2 = document.getElementById("car_2");
  const car_3 = document.getElementById("car_3");
  const line_1 = document.getElementById("line_1");
  const line_2 = document.getElementById("line_2");
  const line_3 = document.getElementById("line_3");
  const restart_div = document.getElementById("restart_div");
  const restart_btn = document.getElementById("restart");
  const score = document.getElementById("score");

  const container_width = container.offsetWidth;
  const container_height = container.offsetHeight;
  const car_width = car.offsetWidth;
  const car_height = car.offsetHeight;

  let game_over = false;
  let score_counter = 1;
  let speed = 2;
  let line_speed = 5;

  let move_right = false;
  let move_left = false;
  let move_up = false;
  let move_down = false;

  document.addEventListener("keydown", function (e) {
    if (!game_over) {
      const key = e.keyCode;
      if (key === 37 && !move_left) {
        move_left = requestAnimationFrame(left);
        if (window.sfx?.move_left) window.sfx.move_left.play();
      } else if (key === 39 && !move_right) {
        move_right = requestAnimationFrame(right);
      } else if (key === 38 && !move_up) {
        move_up = requestAnimationFrame(up);
      } else if (key === 40 && !move_down) {
        move_down = requestAnimationFrame(down);
      }
    }
  });

  document.addEventListener("keyup", function (e) {
    if (!game_over) {
      const key = e.keyCode;
      if (key === 37) {
        cancelAnimationFrame(move_left);
        move_left = false;
      } else if (key === 39) {
        cancelAnimationFrame(move_right);
        move_right = false;
      } else if (key === 38) {
        cancelAnimationFrame(move_up);
        move_up = false;
      } else if (key === 40) {
        cancelAnimationFrame(move_down);
        move_down = false;
      }
    }
  });

  function left() {
    const currentLeft = parseInt(getComputedStyle(car).left);
    if (!game_over && currentLeft > 0) {
      car.style.left = currentLeft - 5 + "px";
      move_left = requestAnimationFrame(left);
    }
  }

  function right() {
    const currentLeft = parseInt(getComputedStyle(car).left);
    if (!game_over && currentLeft < container_width - car_width) {
      car.style.left = currentLeft + 5 + "px";
      move_right = requestAnimationFrame(right);
    }
  }

  function up() {
    const currentTop = parseInt(getComputedStyle(car).top);
    if (!game_over && currentTop > 0) {
      car.style.top = currentTop - 3 + "px";
      move_up = requestAnimationFrame(up);
    }
  }

  function down() {
    const currentTop = parseInt(getComputedStyle(car).top);
    if (!game_over && currentTop < container_height - car_height) {
      car.style.top = currentTop + 3 + "px";
      move_down = requestAnimationFrame(down);
    }
  }

  anim_id = requestAnimationFrame(repeat);

  function repeat() {
    if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
      stop_the_game();
      return;
    }

    score_counter++;

    if (score_counter % 20 === 0) {
      score.innerText = parseInt(score.innerText) + 1;
    }

    if (score_counter % 500 === 0) {
      speed++;
      line_speed++;
    }

    car_down(car_1);
    car_down(car_2);
    car_down(car_3);
    line_down(line_1);
    line_down(line_2);
    line_down(line_3);

    anim_id = requestAnimationFrame(repeat);
  }

  function car_down(car_obj) {
    let top = parseInt(getComputedStyle(car_obj).top);
    if (top > container_height) {
      top = -200;
      const left = Math.floor(Math.random() * (container_width - car_width));
      car_obj.style.left = left + "px";
    }
    car_obj.style.top = top + speed + "px";
  }

  function line_down(line_obj) {
    let top = parseInt(getComputedStyle(line_obj).top);
    if (top > container_height) {
      top = -300;
    }
    line_obj.style.top = top + line_speed + "px";
  }

  restart_btn.addEventListener("click", () => {
    location.reload();
  });

  function stop_the_game() {
    game_over = true;
    cancelAnimationFrame(anim_id);
    cancelAnimationFrame(move_right);
    cancelAnimationFrame(move_left);
    cancelAnimationFrame(move_up);
    cancelAnimationFrame(move_down);

    restart_div.style.display = "block";
    restart_btn.focus();

    const song = document.getElementById("song");
    song.pause();
    song.currentTime = 0;
  }

  document.addEventListener("click", () => {
    if (game_over) location.reload();
  });

  function collision(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
      rect1.top + rect1.height < rect2.top ||
      rect1.top > rect2.top + rect2.height ||
      rect1.left + rect1.width < rect2.left ||
      rect1.left > rect2.left + rect2.width
    );
  }
  let isReady = false;

  window.addEventListener("click", () => {
    const song = document.getElementById("song");
    if (!isReady) {
      song.play().then(() => {
        song.pause();
        isReady = true;
      }).catch(() => {});
    } else {
      song.play();
    }
  });
});
