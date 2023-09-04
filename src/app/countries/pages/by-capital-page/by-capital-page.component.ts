import { Component, Input, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styles: [
  ]
})
export class ByCapitalPageComponent implements OnInit{

  public countries:Country[]=[]
  public isLoading: boolean=false;//Para la animación de "Buscando" cuando se hace el request
  public initialValue:string='';


  constructor(private countriesService:CountriesService){}

  ngOnInit(): void {
    this.countries=this.countriesService.cacheStorage.byCapital.countries;//cargo la búsqueda guarada en caché
    this.initialValue=this.countriesService.cacheStorage.byCapital.term;
  }

  SearchByCapital(term:string):void{
   /*  console.log('Desde ByCapitalPage')
    console.log({term})*/

    this.isLoading=true;

    //Debemos suscribirnos al observable para proceder con la consulta
    this.countriesService.searchCapital(term).subscribe(countries=>{
      this.countries=countries;
      this.isLoading=false;
    });
  }
}
