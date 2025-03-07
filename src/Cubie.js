import * as THREE from 'three';
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

import {ColorPicker} from "./ColorPicker.js";

export class Cubie {
    
    size;
    positionX; positionY; positionZ;

    box;
    edges = [];
    graphics = new THREE.Group();

    constructor(size, positionX, positionY, positionZ) {
        this.size = size;
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;

        let geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        let materials = [
                new THREE.MeshBasicMaterial( { color: ColorPicker.RIGHT } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.LEFT } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.UP } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.DOWN } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.FRONT } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.BACK } ),
            ];
        this.box = new THREE.Mesh(geometry, materials );
        this.box.position.set(this.positionX, this.positionY, this.positionZ);
        this.graphics.add(this.box);

        // Get vertice vectors from box geometry
        let coordArray = geometry.attributes.position.array;
        let points = [];
        for (let i = 0; i < coordArray.length; i += 3) {
            let x = coordArray[i];
            let y = coordArray[i + 1];
            let z = coordArray[i + 2];
            let vector = new THREE.Vector3(x, y, z);
            points.push(vector);
        }

        let representedEdges = new Set();
        for (let firstVec of points) {
            for (let secondVec of points) {
                
                // Show line only on the edge of the cubie
                let vectorDistance = firstVec.distanceTo(secondVec);
                if(vectorDistance.toFixed(3) != this.size.toFixed(3))
                    continue;
                
                // Show each edge only once
                if(representedEdges.has(JSON.stringify(firstVec) + JSON.stringify(secondVec)))
                    continue;
                representedEdges.add(JSON.stringify(firstVec) + JSON.stringify(secondVec));
                representedEdges.add(JSON.stringify(secondVec) + JSON.stringify(firstVec));
                
                let edgeGeometry = new LineGeometry().setFromPoints([firstVec, secondVec]);
                let edgeMaterial = new LineMaterial({
                    color: ColorPicker.BASE,
                    linewidth: this.size * 18,
                    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
                });
                
                let edge = new LineSegments2(edgeGeometry, edgeMaterial);
                edge.position.set(this.positionX, this.positionY, this.positionZ);

                this.edges.push(edge);
                this.graphics.add(edge);
            }
        }
    }

}
