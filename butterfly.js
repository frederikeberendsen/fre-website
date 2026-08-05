// 🦋 Butterfly cursor + stardust — shared by every page. Paired with butterfly.css.
// Exposes window.spark(x, y, opts) so pages can throw their own stardust.
(function(){
  var glyphs = ['✦', '✧', '⋆', '·', '✺'];

  function spark(x, y, opts){
    opts = opts || {};
    var s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = glyphs[(Math.random() * glyphs.length) | 0];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    // random gradient angle => each fleck catches the light differently (reflective silver)
    s.style.backgroundImage = 'linear-gradient(' + ((Math.random() * 360) | 0) + 'deg, #ffffff, #d4e3f8, #6f9be0, #f3f6fc, #a9bbdd)';
    var dist = opts.dist != null ? opts.dist : (10 + Math.random() * 16);
    var ang = opts.ang != null ? opts.ang : Math.random() * Math.PI * 2;
    s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--dy', (Math.sin(ang) * dist - (opts.rise || 10)) + 'px');
    var base = opts.small ? 4 : 6;
    s.style.fontSize = (base + Math.random() * 7) + 'px';
    s.style.animation = 'sparkle-fade ' + (650 + Math.random() * 550) + 'ms ease-out forwards';
    document.body.appendChild(s);
    setTimeout(function(){ s.remove(); }, 1250);
  }
  window.spark = spark;

  function start(){
    var bf = document.querySelector('.butterfly-cursor');
    if (!bf){
      bf = document.createElement('div');
      bf.className = 'butterfly-cursor';
      bf.setAttribute('aria-hidden', 'true');
      bf.innerHTML = '<img src="images/butterfly-white.png" alt="" />';
      document.body.appendChild(bf);
    }

    var mx = innerWidth / 2, my = innerHeight / 2;
    var bx = mx, by = my, px = bx, py = by;
    var ang = 0; // current heading (deg); butterfly art points "up" by default
    window.addEventListener('mousemove', function(e){ mx = e.clientX; my = e.clientY; });

    function loop(){
      bx += (mx - bx) * 0.13;
      by += (my - by) * 0.13;
      var vx = bx - px, vy = by - py; px = bx; py = by;
      var speed = Math.hypot(vx, vy);
      if (speed > 0.6) {
        // point the butterfly's head toward the direction it's flying
        var target = Math.atan2(vy, vx) * 180 / Math.PI + 90;
        var diff = ((target - ang + 540) % 360) - 180; // shortest turn
        ang += diff * 0.18; // ease into the turn
      } else {
        // mouse still → gracefully stabilize back to upright
        ang = ((ang + 180) % 360 + 360) % 360 - 180; // normalize to [-180,180]
        ang += (0 - ang) * 0.06;
      }
      var bob = Math.sin(Date.now() / 420) * 2.2;
      bf.style.transform = 'translate(' + bx + 'px,' + (by + bob) + 'px) translate(-50%,-50%) rotate(' + ang + 'deg)';
      // stardust where the butterfly flies
      if (speed > 0.8 && Math.random() < 0.7) spark(bx + (Math.random() * 22 - 11), by + (Math.random() * 22 - 11), { dist: 7, rise: 5, small: true });
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // click burst
    window.addEventListener('click', function(e){
      for (var i = 0; i < 18; i++) spark(e.clientX, e.clientY, { ang: (i / 18) * Math.PI * 2, dist: 30 + Math.random() * 40, rise: 0 });
    });

    // sparkle over titles + logo
    document.querySelectorAll('h2, .logo, .disco h4').forEach(function(el){
      el.addEventListener('mouseenter', function(){
        var r = el.getBoundingClientRect();
        for (var i = 0; i < 14; i++) spark(r.left + Math.random() * r.width, r.top + Math.random() * r.height, { dist: 14, rise: 20, small: true });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // click-to-load YouTube: no request reaches Google until the visitor presses play
  function wireVideos(){
    document.querySelectorAll('.ytfacade').forEach(function(el){
      if (el.dataset.wired) return;
      el.dataset.wired = '1';
      el.addEventListener('click', function(){
        var id = el.getAttribute('data-embed');
        if (!id) return;
        var ifr = document.createElement('iframe');
        ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
        ifr.title = el.getAttribute('data-title') || 'Video';
        ifr.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        ifr.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        ifr.setAttribute('allowfullscreen', '');
        el.innerHTML = '';
        el.classList.remove('ytfacade');
        el.appendChild(ifr);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireVideos);
  else wireVideos();
})();
