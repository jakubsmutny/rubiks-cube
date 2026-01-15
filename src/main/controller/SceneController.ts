import {SceneView} from "../view/SceneView";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";

export class SceneController {

    sceneView: SceneView
    trackballControls: TrackballControls

    constructor(sceneView: SceneView) {
        this.sceneView = sceneView
        this.trackballControls = this.setupControls()
    }

    update(): void {
        this.trackballControls.update()
    }

    private setupControls(): TrackballControls {
        let controls = new TrackballControls(
            this.sceneView.camera, this.sceneView.renderer.domElement
        )
        controls.rotateSpeed = 2;
        controls.noZoom = true;
        controls.noPan = true;
        controls.target.set(0, 0, 0);
        return controls;
    }
}

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
