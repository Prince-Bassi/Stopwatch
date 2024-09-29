const watchElem = document.querySelector(".watch"); //watch element
const startBtn = document.querySelector("#start"); //button to start the watch
const stopBtn = document.querySelector("#stop"); //button to stop the watch
const resetBtn = document.querySelector("#reset"); //button to reset the watch
const modeDisplay = document.querySelector("#mode"); //Text elem to display the current mode
const modeBtn = document.querySelector("#modeChange"); //button to change the watch mode
const timerInput = document.querySelector(".timerInput"); //The container for the time input and submit button
const timeElem = document.querySelector(".timerInput input[type=time]"); //time element which lets user define the time in timer mode
const changeTimer = document.querySelector(".timerInput #changeTimer"); //button which sets the time in timer mode

class Watch {
       constructor(elem, delay, mode, ms) {
              this.elem = elem;
              this.ms = ms; //time will be broken down to miliseconds for easier calculation
              this.delay = delay; //the speed with which the watch runs
              this.state = "paused";
              this.mode = mode; //timer or stopwatch mode
       }

       calculateMs(time) { //function to calculate milisecs from a string with format hh:mm:ss
              const timeArr = time.split(":");
              const hour = timeArr[0];
              const min = timeArr[1];
              const sec = timeArr[2];
              return ((+ sec) * 1000) + ((+ min) * 60000) + ((+ hour) * 3600000);
       }

       update() { //funtion to update the watch based on the current ms value
              let hour, min, sec, ms;

              hour = Math.floor(this.ms / 3600000);
              min = Math.floor(this.ms / 60000);
              sec = Math.floor(this.ms / 1000);

              //checks for mins and secs going above 60
              min = (min > 59) ? min - (60 * Math.floor(min / 60)) : min; 
              sec = (sec > 59) ? sec - (60 * Math.floor(sec / 60)) : sec;

              [hour, min, sec] = this.checkForBelowZero(hour, min, sec);

              //pads the number with a 0 if its single digit
              hour = (hour < 10) ? "0" + hour : hour;
              min = (min < 10) ? "0" + min : min;
              sec = (sec < 10) ? "0" + sec : sec;
              ms = (this.ms.toString().slice(-3, -2) != "") ? this.ms.toString().slice(-3, -2) : 0; //gets the ms value from the total miliseconds

              this.elem.textContent = `${hour}:${min}:${sec}.${ms}`; //displays the time
       }

       checkForBelowZero(hour, min, sec) { //check for time being below zero and stops the watch if its a timer
              const _hour = (hour < 0) ? 0 : hour;
              const _min = (min < 0) ? 0 : min;
              const _sec = (sec < 0) ? 0 : sec;

              if (this.mode == "timer" && this.ms <= 0) {
                     this.stop();
              }

              return [_hour, _min, _sec]
       }

       start() { //stats the watch
              if (this.state == "paused") {
                     this.interval = setInterval(() => { //the main interval of the watch
                            if (this.mode == "stopwatch") {
                                   this.ms += this.delay;
                            }
                            else if (this.mode == "timer" && this.ms > 0) { //time is subtracted if its a timer
                                   this.ms -= this.delay;
                            }
                            this.update();
                     }, this.delay);
                     this.state = "running";
              }
       }

       stop() { //function to stop the watch
              if (this.state == "running") {
                     clearInterval(this.interval);  //clears the main interval
                     this.state = "paused";
              }
       }

       reset() { //function to reset the watch
              this.ms = 0;
              this.update();
              this.stop();
              if (this.state == "timer") { //resets the time input as well
                     timeElem.value = "00:00:00";
              }
       }
}

const watch = new Watch(watchElem, 100, "stopwatch", 0); //main watch object

//event listeners for start, stop and reset buttons
startBtn.addEventListener("click", () => {
       watch.start();
});
stopBtn.addEventListener("click", () => {
       watch.stop();
});
resetBtn.addEventListener("click", () => {
       watch.reset();
});

//event listener for the mode changing button
modeBtn.addEventListener("click", () => {
       if (watch.mode == "stopwatch") {
              watch.reset();
              timerInput.style.display = "block"; //displays the time inputs for timer mode
              watch.mode = "timer";
              modeDisplay.textContent = "Timer";
              modeBtn.textContent = "Change mode to Stopwatch";
       }
       else if (watch.mode == "timer") {
              watch.reset();
              watch.mode = "stopwatch";
              timerInput.style.display = "none"; //hides the time inputs
              modeDisplay.textContent = "Stopwatch";
              modeBtn.textContent = "Change mode to Timer";
       }
});

//event listener for setting the time in timer mode
changeTimer.addEventListener("click", () => {
       if (watch.state != "running") {
              watch.ms = watch.calculateMs(timeElem.value);
              watch.update();
       }
});
