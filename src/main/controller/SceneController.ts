export class SceneController {

}

// TODO User input
/*document.getElementById("shuffleButton")!.addEventListener("click", () => { this.addShuffle(); });
document.querySelector('#shuffle')!.addEventListener('keypress', (e) => {
    const event = e as KeyboardEvent;
    if(event.key === 'Enter') this.addShuffle();
});

const select = document.getElementById("dimensionSelect") as HTMLSelectElement;
select.addEventListener("change", () => {
    const dim = Number(select.value);
    for (let cubie of this.rubiksCube.cubies)
        this.scene.remove(cubie.graphics);
    this.rubiksCube = new RubiksCube(this.cubeSize, dim);
    for (let cubie of this.rubiksCube.cubies)
        this.scene.add(cubie.graphics);
    this.dimension = dim;
});*/

// TODO User input
/*addShuffle(): void {
    let inputField = document.getElementById("shuffle")! as HTMLInputElement;
    let value = inputField.value;
    let shuffle = Shuffle.fromNotation(value, this.rubiksCube.dimension);
    this.rubiksCube.manipulate(shuffle);
    inputField.value = "";
}*/

// TODO User Input
/*document.addEventListener('mousedown', onMouseDown);
//document.addEventListener('touchstart', onMouseDown);
document.addEventListener('mouseup' , onMouseUp);

function onMouseUp(event: MouseEvent): void {
    console.log(`Mouse up at (${event.clientX}, ${event.clientY})`);
}

function onMouseDown(event: MouseEvent): void {
    console.log(`Mouse down at (${event.clientX}, ${event.clientY})`);
}*/
