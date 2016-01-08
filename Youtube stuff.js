var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var section_finishing_time = Array(29,177,295,548,738,909,animation_beginning_second,99999999999);
var pausing_times = Array(37,185,321,550,747,939);
var secondsthroughvid = 0;
function react_to_video(){
	/* Note that it is *finishing* time
	 * the second one is the time that we want the break-apart to BEGIN
	 * the opening of the QC is also when that animation will begin
	 * 
	 * with both QC and DNA, if the player goes into any other section, we should reset their coords
	 */
//	var section_finishing_time = new Uint16Array([34,182,300,553,743,914,99999999999]);
//	var pausing_times = new Uint16Array([54,213,326,555,752,944]);
	
	var timeupdate = ytplayer.getCurrentTime();
	if(timeupdate != Math.floor(secondsthroughvid) ){
		var discrepancy = timeupdate - Math.floor(secondsthroughvid);
		if(discrepancy == 1) //a very normal update
			secondsthroughvid = timeupdate;
		else if(discrepancy > 1 ) //either our framerate is completely hopeless or they skipped ahead
			secondsthroughvid = timeupdate;
		else if(discrepancy == -1) //we've gone a full second ahead, so maybe they've paused or our delta_t's are more than the sum of their parts. Hopefully they'll catch up
			secondsthroughvid = Math.floor(secondsthroughvid);
		else if(discrepancy < -1) //they've gone back, we should follow
			secondsthroughvid = timeupdate;
		//if it's 0 then things are as normal
		//there are much better ways of checking for a pause but this is not hugely important
	}
	secondsthroughvid += delta_t;
		
	for(var i = 0; i < section_finishing_time.length /*or whichever mode is last*/; i++) {
		if( section_finishing_time[i-1] <= secondsthroughvid && secondsthroughvid < section_finishing_time[i] && MODE != i)
			ChangeScene(i);
	}
	for(var i = 0; i < pausing_times.length /*or whichever mode is last*/; i++) {
		if( pausing_times[i] <= secondsthroughvid && secondsthroughvid < pausing_times[i] + 1 ){
			pausing_times[i] = -1; //won't need that again
			ytplayer.pauseVideo();
		}
	}
}

function onPlayerReady(event) {
	MODE = 0;
	init();
	render();
}

/* _MF2DVU8oB0: tall video
 * lDMaeDoSNvM: test video
 * 8JndSqOn9ac: Robin video
 * Xa_m6yggMdU: V2 video
 * D_DkCTT8azI: V2 resized
 */
function onYouTubeIframeAPIReady(){
	ytplayer = new YT.Player('player', {
		videoId:'D_DkCTT8azI',
		height: window_height,
		width: window_height / 3 * 4,//9:16 is probably pushing it too far, but you should try it
		events: {
	        'onReady': onPlayerReady
	    },
		playerVars: {
			autoplay: 1,
//			controls: 0,
			fs: 0,
			rel: 0,
			showinfo: 0,
			modestbranding: 1,
		}
	});
}