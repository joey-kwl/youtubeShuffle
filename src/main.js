document.addEventListener('DOMContentLoaded', () => {
	const date = new Date();
	const now = date.getTime();
	let musicItem = [];
	const nextBtn = document.getElementById('next');

	// Load Youtube player API.
	function loadPlayer() {
		if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
	  		const tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
			window.onYouTubePlayerAPIReady = function() {
				onYouTubePlayer();
			};
	  
		} else {
		 	 onYouTubePlayer();
		}
	}
	
	// Load Youtube player.
	function onYouTubePlayer() {
		player = new YT.Player('player', {
			videoId: start(),
			width: '100%',
			height: '100%',
			playerVars: {
				autoplay:1,
				controls:1,
				showinfo: 0,
				rel: 0,
				showsearch: 0,
				iv_load_policy: 3
			},
			events: {
				'onReadt': onPlayerStateChange,
				'onStateChange': onPlayerStateChange,
				'onError': onError
			}
		});
	}

	// Next video when state change.
	function onPlayerStateChange(event) {	
		switch (player.getPlayerState(event)) {
			case 0:
				next();
				break;
			case -1:
					player.playVideo();
				break;
		}
	}

	// Next video on error.
	function onError(){
		next();
	}

	// Fetch playlist and save to localstorage else get playlist from localstorage.
	if (
		!(localStorage.getItem('youtubeExpireDate')) ||
		localStorage.getItem('playlist') === null ||
		now > JSON.parse(localStorage.getItem('youtubeExpireDate'))
		) {
		const api_key = window.key;
		const playlist_id = 'PLL_i49YplGU2ZTUGyAo0aBe1NOoFZ-rVk';
		const api_url = `https://www.googleapis.com/youtube/v3/playlistItems?&part=snippet&maxResults=50&playlistId=${playlist_id}&key=${api_key}`;
		
		let page_token = '';
		
		// Load all music from playlist.
		function loadPlaylist() {
			fetch(api_url + `&pageToken=${page_token}`)
				.then(result => result.json())
				.then(data => {
					musicItem.push(...data.items);

					if (data.nextPageToken) {
						page_token = data.nextPageToken;
						loadPlaylist();
					} else {
						savePlaylist();
					}
				}).catch(err => {
					console.log(err)
				})
		}

		// Save playlist in localstorage.
		function savePlaylist() {
			localStorage.setItem('playlist', JSON.stringify(musicItem));
			localStorage.setItem('youtubeExpireDate', JSON.stringify(date.setDate(date.getDate() + 1)));
			loadPlayer();
		}

		loadPlaylist();

		
	} else {
		musicItem = JSON.parse(localStorage.getItem('playlist'));
		loadPlayer()
	}

	// Start music.
	function start() {
		musicItem = JSON.parse(localStorage.getItem('playlist'));
		let rand = musicItem[Math.floor(Math.random() * musicItem.length)];
		return (rand.snippet.resourceId.videoId)
	}

	// Play next video.
	function next() {
		let rand = musicItem[Math.floor(Math.random() * musicItem.length)];
		player.loadVideoById(rand.snippet.resourceId.videoId)
		
	}

	// Play next video when button is pressed.
	nextBtn.addEventListener('click', () => {
		next();
	})

})
