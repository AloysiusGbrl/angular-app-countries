import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit{

  public country?:Country;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private CountriesService:CountriesService,
    ){}

  ngOnInit(): void {
    this.activatedRoute.params//params es un observable, porque me estoy suscribiendo:
    .pipe(
      //switchMap recibe el valor anterior para regresar un nuevo observable
      switchMap(({ id })=> this.CountriesService.searchCountryByAlphaCode(id))
      )
    .subscribe(country=>{
      //console.log({ country })
      if(!country){//Si el país no se encueentra, entonces mandaré por defecto a un lugar de la página
        return this.router.navigateByUrl('');//en este paso, según mi configuración de mis rutas, me mandará al apartadode capital
      }//Si el país existe entonces:
      console.log('TENEMOS UN PAPIS');

      return this.country=country;
    });
  }
}
