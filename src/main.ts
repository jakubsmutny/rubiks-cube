import { Shuffle } from './Shuffle';
import { View } from './View';

main();

function main(): void {

    const mainView = new View(1, 3, 3, document.getElementById("mainView")!);
    const view = new View(1, 4, 3, document.getElementById("view")!);

}


// Testing user input
// document.getElementById("shuffleButton")!.addEventListener("click", addShuffle);
// document.querySelector('#shuffle')!.addEventListener('keypress', (e) => {
//     const event = e as KeyboardEvent;
//     if(event.key === 'Enter') addShuffle();
// });
// 
// function addShuffle() {
//     let inputField = document.getElementById("shuffle")! as HTMLInputElement;
//     let value = inputField.value;
//     let shuffle = Shuffle.fromNotation(value, rubiksCube.dimension);
//     rubiksCube.manipulate(shuffle);
//     inputField.value = "";
// }
