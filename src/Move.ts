import * as THREE from 'three';

import { Axis } from './Axis';

export class Move {

    axis: THREE.Vector3;
    planes: Array<number>;
    radians: number;

    constructor(axis: THREE.Vector3, planes: Array<number>, radians: number) {
        this.axis = axis;
        this.planes = Array<number>();
        for(let plane of planes)
            this.planes.push(plane);
        this.radians = this.#normalizeRadians(radians);
    }
    static fromNotation(notation: string, dimension: number): Move {
        
        if(!this.notationValid(notation, dimension)) return Move.empty();

        // Some notations use small numbers meaning wide rotations
        notation = notation.replace(/r|l|u|d|f|b/, match => match.toUpperCase() + 'w');

        let turnDirection = 1;
        if(/\'$/.test(notation)) turnDirection *= -1;
        if(/2$/.test(notation)) turnDirection *= 2;
        if(/R|U|F|S|x|y|z/.test(notation)) turnDirection *= -1;

        let axis = Axis.undefined;
        if(/R|L|M|x/.test(notation)) axis = Axis.X;
        if(/U|D|E|y/.test(notation)) axis = Axis.Y;
        if(/F|B|S|z/.test(notation)) axis = Axis.Z;

        let wide = /w|x|y|z/.test(notation);

        let planeInvers = /R|U|F/.test(notation);

        let planeNumber = /w/.test(notation) ? 2 : 1;
        let newPlaneNumber = +(/^[0-9]*/.exec(notation)![0]);
        if(newPlaneNumber) planeNumber = newPlaneNumber;
        if(/M|E|S/.test(notation)) planeNumber = (dimension + 1) / 2;
        if(/x|y|z/.test(notation)) planeNumber = dimension;

        let planes = [];
        for (let i = 1; i <= planeNumber; i++)
            if(wide || i == planeNumber)
                planes.push(planeInvers ? dimension - i : i - 1);

        return new Move(axis, planes, Math.PI / 2 * turnDirection);
    }
    static random(dimension: number): Move {
        let randomAxis = Math.random();
        let axis = Axis.X;
        if(randomAxis >= 0.33) axis = Axis.Y;
        if(randomAxis >= 0.66) axis = Axis.Z;

        let randomPlane = Math.floor(Math.random() * dimension);
        let planes = Array.of(randomPlane);

        let turnDirection = 1;
        if(Math.random() > 0.5) turnDirection = -1;

        return new Move(axis, planes, Math.PI / 2 * turnDirection);
    }
    static empty(): Move {
        return new Move(Axis.undefined, new Array<number>(), 0);
    }

    clone(): Move {
        let planes = [];
        for(let plane of this.planes)
            planes.push(plane);
        return new Move(this.axis, planes, this.radians);
    }

    copy(other: Move): void {
        this.axis = other.axis;
        for(let plane of other.planes)
            this.planes.push(plane);
        this.radians = other.radians;
    }

    static notationValid(notation: string, dimension: number): boolean {
        if(+(/^[0-9]*/.exec(notation)![0]) > dimension) return false;
        if(/^[0-9]*(R|L|U|D|F|B)w?(\'|2)?$/.test(notation))return true;
        if(/^[0-9]*(r|l|u|d|f|b)(\'|2)?$/.test(notation))return true;
        if(/^(M|E|S)(\'|2)?$/.test(notation) && dimension % 2) return true;
        if(/^(x|y|z)(\'|2)?$/.test(notation)) return true;
        return false;
    }

    getInverse(): Move {
        return new Move(this.axis, this.planes, this.radians * -1);
    }

    sameAxisPlanes(other: Move): boolean {
        if(this.axis != other.axis) return false;
        for (let plane of this.planes)
            if(!other.planes.includes(plane)) return false;
        for (let plane of other.planes)
            if(!this.planes.includes(plane)) return false;
        return true;
    }

    addRadiansFrom(other: Move): void {
        let angle = this.radians + other.radians;
        this.radians = this.#normalizeRadians(angle);
    }

    #normalizeRadians(angle: number): number {
        let start = Math.PI * -1;
        let range = Math.PI * 2;
        let rounds = Math.floor((angle - start) / range);
        return angle - rounds * range;
    }

    isEmpty(): boolean {
        if(this.axis == Axis.undefined) return true;
        if(this.planes.length == 0) return true;
        if(+this.radians.toFixed(3) == 0) return true;
        return false;
    }
}
