export class Station {
    Name: string;
    Multiplier: number;
    To: number;
    From: number;

    constructor(name:string, mult:number, to:number, from:number){
        this.Name = name;
        this.Multiplier = mult;
        this.To = to;
        this.From = from;
    }
}