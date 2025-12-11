

let music = new Audio();
let currentSongIndex = -1;     // to track current song index
let songsData = [];            // store all songs
let playbtn = document.querySelector(".play img");
let songList = document.getElementById("songList");
let nextbtn = document.querySelector(".next"); // NEXT BUTTON
let previousbtn = document.querySelector(".previous"); // previous button
let songinfo = document.querySelector(".songinfo");
let songtime = document.querySelector(".songtime");
// let circle = document.querySelector(".circle");
const seekbar = document.querySelector(".seekbar");
const progress = document.querySelector(".progress");
const circle = document.querySelector(".circle");
let playNow = document.getElementsByClassName(".playNow");


async function loadSongs(jsonpath, folderPath) {
    let response = await fetch(jsonpath);
    let data = await response.json();
    songsData = data.songs;
    console.log(songsData[0].file);


    // store songs globally
    songList.innerHTML = "";

    //  data.folderPath = folderPath; 

    data.songs.forEach((song, index) => {
        let li = document.createElement("li");
        li.className = "first-list";

        li.innerHTML = `
        <div class="firstdiv">
            <img src="music.png" alt="music">
            <div class="info">
                 
                <div class="artistname">${song.title}</div>
            </div>
        </div>

        <div class="playNow">
            Play
            <img src="playNow.png" alt="play">
        </div>
        `;

        // When user clicks list item
        li.addEventListener("click", () => {
            // If same song clicked: toggle play/pause
            if (currentSongIndex === index) {
                if (music.paused) {
                    music.play();
                    playbtn.src = "pause.png";
                }
                else music.pause();
                return;
            }

            // Otherwise play selected song
            console.clear();
            playSong(index);


        });

        songList.appendChild(li);
    });


    window.currentFolder = folderPath;
    if (songsData.length > 0) {
        playSong(0);
    }
}

// All cards select karo
let cards = document.querySelectorAll(".cards");

let isLoaded = false;

cards.forEach((card, index) => {
    card.addEventListener("click", () => {
        document.querySelector('.left').classList.add('active');
        cards.forEach(c => c.classList.remove("active-card"));

        // Add active class to clicked card
        card.classList.add("active-card");
        // Already loaded => prevent repeat
        // if (isLoaded) return;

        // First card = Mixed Songs
        if (index === 0) {
            loadSongs("Songs/Mixed Songs/songs.json", "Songs/Mixed Songs/");
        }

        // Second card = Vivah Songs
        if (index === 1) {
            loadSongs("Songs/Vivah Movie Songs/songs.json", "Songs/Vivah Movie Songs/");
        }

        if(index === 2){
            loadSongs("Songs/90s Sadabahar/songs.json", "Songs/90s Sadabahar/")
        }

        if(index === 3){
            loadSongs("Songs/English Songs/songs.json", "Songs/English Songs/")
        }
        if(index === 4){
            loadSongs("Songs/Hindi Songs/songs.json", "Songs/Hindi Songs/")
        }

        isLoaded = true;
    });
});




function songsControl() {

    // PLAY / PAUSE BUTTON (GLOBAL)
    playbtn.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            playbtn.src = "pause.png";
        }
        else {
            music.pause();
            playbtn.src = "songplay.png";
        }

    });
    music.addEventListener("ended", () => {
        playNextSong();
    });

    // NEXT BUTTON
    nextbtn.addEventListener("click", () => {
        playNextSong();
    });

    previousbtn.addEventListener("click", () => {
        playPreviousSong();
    });

    music.addEventListener("timeupdate", () => {
        if (!isNaN(music.duration)) {
            let current = formatTime(music.currentTime);
            let total = formatTime(music.duration);

            songtime.innerHTML = `${current} / ${total}`;
            circle.style.left = (music.currentTime / music.duration) * 100 + "%";
        }
    });

    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector('.left').classList.add('active');
    });
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector('.left').classList.remove('active');
    });

    document.querySelector(".range input").addEventListener("change" , (e) => {
        console.log(e , e.target , e.target.value);
        music.volume = parseInt(e.target.value)/100;
    });
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    return mins + ":" + secs;
}


// 🔥 PLAY SONG FUNCTION
function playSong(index) {
    let song = songsData[index];
    music.pause();

    music.src = window.currentFolder + song.file;
    music.play();

    currentSongIndex = index;
    playbtn.src = "pause.png";
    songinfo.innerHTML = song.title;
    songtime.innerHTML = "00:00 / 00:00";

    highlightSongs(index);
}


// 🔥 NEXT SONG FUNCTION
function playNextSong() {
    if (currentSongIndex === -1) return;

    let nextIndex = currentSongIndex + 1;

    // If last song → go back to first
    if (nextIndex >= songsData.length) {
        nextIndex = 0;
    }

    playSong(nextIndex);
}

function playPreviousSong() {
    if (currentSongIndex === -1) return;

    let previousIndex = currentSongIndex - 1;

    // If first song → go to last song
    if (previousIndex < 0) {
        previousIndex = songsData.length - 1;
    }

    playSong(previousIndex);
}


songsControl();



/// SEEKBAR CLICK EVENT
seekbar.addEventListener("click", function (e) {
    let rect = seekbar.getBoundingClientRect(); // seekbar position
    let clickX = e.clientX - rect.left;         // where user clicked
    let width = rect.width;

    let percentage = (clickX / width) * 100;
    progress.style.width = percentage + "%";
    circle.style.left = percentage + "%";

    // Update song time
    music.currentTime = (percentage / 100) * music.duration;
});

/// UPDATE WHILE SONG PLAYS
music.addEventListener("timeupdate", () => {
    let current = music.currentTime;
    let total = music.duration;

    if (!isNaN(total)) {
        let percent = (current / total) * 100;
        progress.style.width = percent + "%";
        circle.style.left = percent + "%";
    }
});

function highlightSongs(index) {
    let allSongs = document.querySelectorAll("#songList li");

    allSongs.forEach(li => {
        li.classList.remove("active-song");
        if (allSongs[index]) {
            allSongs[index].classList.add("active-song");
        }

    });
}