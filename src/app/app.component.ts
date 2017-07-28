import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Station } from './Station';
import * as Rx from "rxjs/Rx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: Http) { }
  
  ngOnInit() {
    var parent = this;
    Rx.Observable.forkJoin(
      this.http.get(this.url.replace('{0}', this.isotopes[0].toString())),
      this.http.get(this.url.replace('{0}', this.isotopes[1].toString())),
      this.http.get(this.url.replace('{0}', this.isotopes[2].toString())),
      this.http.get(this.url.replace('{0}', this.isotopes[3].toString()))
    ).subscribe(function(x) {
        var lowestIsotopePrices = x.map(function(regionData) {
            return Math.min(...regionData.json().items.filter(function(item) {
                return item.location.id === 60003760;
            }).map(function(item) {
                return item.price;
            }));
        });
        parent.fuelCost = lowestIsotopePrices.reduce(function(a, b) { return a + b; }) / lowestIsotopePrices.length;
      });
  }

  fuelCost;

  stations: Station[] = [
    new Station("Jita", 1, 5.545, 8.931),
    new Station("Hek", 2, 3, 3.355),
    new Station("Amarr", 1.5, 13.213, 14.015),
    new Station("Dodixie", 1.5, 9.075, 7.744),
    new Station("Rens", 1.5, 6.294, 6.959),
    new Station("Other", 3.5, null, null)
  ];


  url = "https://crest-tq.eveonline.com/market/10000002/orders/sell/?type=https://public-crest.eveonline.com/inventory/types/{0}/";

 // jitaId = 60003760;

  isotopes = [
    17888,//Nitrogen
    17887,//Oxygen
    17889,//Hydrogen
    16274//Helium
  ];

  maxLoad = 350000;
  JfcSkill = 4;
  JfSkill = 4;
  dotlanUrl = "http://evemaps.dotlan.net/jump/Rhea,544,S,I/{0}:{1}:{0}";
  priceMultiplier = 2;
  basePrice = 20000000;
  cynoPrice = 3000000;

  packaged: boolean;
  rush: boolean;
  loadSize: number;
  lightyears: number;
  selectedStation: Station;

  title = 'Jump Cost Calculator';

  //TODO: This is a gross violation of everything architecture
  errors = function() {
    let text: string[] = [];
    if(this.loadSize > 350000 || this.loadSize < 1) text.push("Load size must be between 1 and 350,000m3");
    else if(this.lightyears < 0 || this.lightyears > 120) text.push("Lightyears must be between 0 and 120");
    return text.join("\r\n");
  }
  desc = function() {
      let desc: string = (this.rush ? "RUSH!" : "") + " " + (this.packaged ? "Containers" : "");
      return desc.trim();
  }
  displayAmount = function() {
    return this.selectedStation && this.loadSize && (!(this.selectedStation.Name == "Other") || this.lightyears);
  }

  amount = function() {
    if(!this.selectedStation) return 0;
    let roundTripLy: number = (this.lightyears * 2) || (this.selectedStation.To + this.selectedStation.From);
    let fuel: number = roundTripLy * (4400 * (1 - 0.1 * this.JfcSkill) * (1 - 0.1 * this.JfSkill));
    let cargoPrice: number = (this.packaged ? 1.5 : 1) * this.priceMultiplier * (((this.rush ? Math.min(this.loadSize, 175000) : Math.min(this.loadSize, 50000)) / this.maxLoad) * fuel * this.fuelCost);
    let isk: number = (this.selectedStation.Multiplier * (this.rush ? 2 : 1) * this.basePrice + this.cynoPrice + cargoPrice);
    return ~~isk;
  }
  displayLightyears = function(){
    return this.selectedStation && this.selectedStation.Name == "Other";
  }
}
