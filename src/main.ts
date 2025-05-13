import { Shuffle } from './cube/Shuffle';
import { View } from './cube/View';

main();

function main(): void {

    const mainView = new View(2, 3, 5, document.getElementById("mainView")!);
    const view = new View(2, 4, 5, document.getElementById("view")!);

}
