const dangerButton = document.getElementById("danger-button");
const airhorn = document.getElementById("airhorn");
const alaphama = document.getElementById("alaphama");
const lilNose = document.getElementById("lil-nose");
const recipe = document.getElementById("name-a-recipe");
const niceFingernails = document.getElementById("nice-fingernails");
const ghost = document.getElementById("swallowed-a-ghost");

const sounds = [alaphama, lilNose, recipe, niceFingernails, ghost];

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

let firstClick = true;

dangerButton.addEventListener("click", () => {
    if(firstClick){
        airhorn.play();
        firstClick = false;
    } else {
        sounds.random().play();
    }
});
