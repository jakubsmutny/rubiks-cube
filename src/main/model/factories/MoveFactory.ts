import {Axis} from "../geometry/Axis";
import {Move} from "../manipulation/Move";
import {Drag} from "../../controller/Drag";
import {Vector} from "../geometry/Vector";

export class MoveFactory {

    dimension: number

    constructor(dimension: number) {
        this.dimension = dimension
    }

    createFromNotation(notation: string): Move {

        if(!this.isNotationValid(notation)) return MoveFactory.createEmpty();

        // Some notations use small numbers meaning wide rotations
        notation = notation.replace(/[rludfb]/, match => match.toUpperCase() + 'w');

        let turnDirection = 1;
        if(/'$/.test(notation)) turnDirection *= -1;
        if(/2$/.test(notation)) turnDirection *= 2;
        if(/[RUFSxyz]/.test(notation)) turnDirection *= -1;

        let axis = Axis.undefined;
        if(/[RLMx]/.test(notation)) axis = Axis.X;
        if(/[UDEy]/.test(notation)) axis = Axis.Y;
        if(/[FBSz]/.test(notation)) axis = Axis.Z;

        let wide = /[wxyz]/.test(notation);

        let planeInverse = /[RUF]/.test(notation);

        let planeNumber = /w/.test(notation) ? 2 : 1;
        let newPlaneNumber = +(/^[0-9]*/.exec(notation)![0]);
        if(newPlaneNumber) planeNumber = newPlaneNumber;
        if(/[MES]/.test(notation)) planeNumber = (this.dimension + 1) / 2;
        if(/[xyz]/.test(notation)) planeNumber = this.dimension;

        let planes: Array<number> = new Array<number>();
        for(let i = 1; i <= planeNumber; i++) {
            if(wide || i == planeNumber) {
                planes.push(planeInverse ? this.dimension - i : i - 1)
            }
        }

        return new Move(axis, planes, turnDirection);
    }

    // TODO Make compatible with Animation
    createFromDrag(drag: Drag): Move {
        const axis: Vector = drag.rotationAxis ? drag.rotationAxis : Axis.undefined
        const planes: number[] = new Array<number>()
        if(axis.equals(Axis.X)) planes.push(drag.clickedCubie.position.i)
        if(axis.equals(Axis.Y)) planes.push(drag.clickedCubie.position.j)
        if(axis.equals(Axis.Z)) planes.push(drag.clickedCubie.position.k)
        return new Move(axis, planes, Math.round(drag.getInRailSize() / 200))
    }

    createRandom(): Move {
        let randomAxis = Math.random();
        let axis = Axis.X;
        if(randomAxis >= 0.33) axis = Axis.Y;
        if(randomAxis >= 0.66) axis = Axis.Z;

        let randomPlane = Math.floor(Math.random() * this.dimension);
        let planes = Array.of(randomPlane);

        let turnDirection = 1;
        if(Math.random() > 0.5) turnDirection = -1;

        return new Move(axis, planes, turnDirection);
    }

    static createEmpty(): Move {
        return new Move(Axis.undefined, new Array<number>(), 0);
    }

    isNotationValid(notation: string): boolean {
        if(+(/^[0-9]*/.exec(notation)![0]) > this.dimension) return false;
        if(/^[0-9]*([RLUDFB])w?(['2])?$/.test(notation))return true;
        if(/^[0-9]*([rludfb])(['2])?$/.test(notation))return true;
        if(/^([MES])(['2])?$/.test(notation) && this.dimension % 2) return true;
        if(/^([xyz])(['2])?$/.test(notation)) return true;
        return false;
    }
}
