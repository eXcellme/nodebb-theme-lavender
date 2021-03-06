$('document').ready(function() {
	requirejs([
		RELATIVE_PATH + '/plugins/nodebb-theme-lavender/vendor/masonry.js',
		RELATIVE_PATH + '/plugins/nodebb-theme-lavender/vendor/imagesLoaded.js',
	], function(Masonry, imagesLoaded) {
		var fixed = localStorage.getItem('fixed') || 0,
			masonry;

		function doMasonry() {
			if($('.home').length) {
				masonry = new Masonry('.row.home > div', {
					itemSelector: '.category-item',
					columnWidth: '.category-item',
					transitionDuration: 0
				});

				$('.row.home > div p img').imagesLoaded(function() {
					masonry.layout();
				});
			}
		}

		function resize(fixed) {
			fixed = parseInt(fixed, 10);

			var container = fixed ? $('.container-fluid') : $('.container');
			container.toggleClass('container-fluid', fixed !== 1).toggleClass('container', fixed === 1);
			localStorage.setItem('fixed', fixed);
			doMasonry();
		}

		$(window).on('action:ajaxify.end', function(ev, data) {
			var url = data.url;

			if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				if (url === "") {
					doMasonry();
					$('.category-header .badge i').tooltip();
				}

				resize(fixed);
			}
		});

		$(window).on('action:widgets.loaded', function(ev, data) {
			doMasonry();
		});

		var div = $('<div class="panel resizer pointer"><div class="panel-body"><i class="fa fa-bars fa-2x"></i></div></div>');
		div.css({
			position:'fixed',
			bottom: '20px',
			right: '20px'
		}).hide().appendTo(document.body);

		$(window).on('mousemove', function(ev) {
			if (ev.clientX > $(window).width() - 150 && ev.clientY > $(window).height() - 150) {
				div.fadeIn();
			} else {
				div.stop(true, true).fadeOut();
			}
		});

		div.on('click', function() {
			fixed = parseInt(fixed, 10) === 1 ? 0 : 1;
			resize(fixed);
		});
	});

	(function() {
		// loading animation
		var ajaxifyGo = ajaxify.go,
			loadData = ajaxify.loadData,
			refreshTitle = app.refreshTitle,
			loadingBar = $('.loading-bar');

		ajaxify.go = function(url, callback, quiet) {
			loadingBar.fadeIn(0).removeClass('reset')
			return ajaxifyGo(url, callback, quiet);
		};

		$(window).on('action:ajaxify.loadingTemplates', function() {
			loadingBar.css('width', '90%');
		});

		app.refreshTitle = function(url) {
			loadingBar.css('width', '100%');
			setTimeout(function() {
				loadingBar.fadeOut(250);

				setTimeout(function() {
					loadingBar.addClass('reset').css('width', '0%');
				}, 250);
			}, 750);

			return refreshTitle(url);
		};
	}());
});