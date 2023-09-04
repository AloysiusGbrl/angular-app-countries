import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CahceStorage } from '../interfaces/cache-storage.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl:string='https://restcountries.com/v3.1';
  public cacheStorage:CahceStorage={
    byCapital:{term:'', countries:[]},
    byCountries:{term:'', countries:[]},
    byRegion:{region:'', countries:[]},
  }

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorge() {
    localStorage.setItem(/*Nombre de Cahché en memoria=*/'caheStorage', JSON.stringify(this.cacheStorage))
  }
  private loadFromLocalStorage() {
    if(!localStorage.getItem('caheStorage'))return;
    this.cacheStorage=JSON.parse(localStorage.getItem('caheStorage')!)
  }

  private getCountryRequest(url:string):Observable<Country[]>{
    return this.httpClient.get<Country[]>(url)
    .pipe(//Para el manejo de errores
    //cuando cacha error, lo que quiero es regresar un nuevo observable vacío (la la info esperada por suscriber) para seguir trabajando
      catchError(()=>of([])),//Si sucede un error , atrapo el error y regreso un arreglo vacío))
      //delay(1000),//Hará que la carga de de datos tenga un retraso de x segundos
    )

  }

  searchCountryByAlphaCode(code:string):Observable<Country | null>{//   -- term = mi query a la PI
    const url=`${this.apiUrl}/alpha/${code}`;

    return this.httpClient.get<Country[]>( url )
    .pipe(
      map(countries=>countries.length > 0 ? countries[0]: null),
      catchError(() => of(null))
    );
  }

  searchCapital(term:string):Observable<Country[]>{//   -- term = mi query a la PI
    const url=`${this.apiUrl}/capital/${term}`;
    return this.getCountryRequest(url)
    .pipe(//cuando venga nuevo mensaje en el observable pasará por el tap pero no influirá en el funcionamiento de la emisión del obserbale
      tap(countries=> this.cacheStorage.byCapital = {term, countries}),//guardo en caché la búsquqeda
      tap(()=>this.saveToLocalStorge())//al haber una nueva emisicón de info. actualizaré mi local Storage
    )
  }
  searchCountry(term:string):Observable<Country[]>{//   -- term = mi query a la PI
    const url=`${this.apiUrl}/name/${term}`
    return this.getCountryRequest(url)
    .pipe(
      tap(countries=> this.cacheStorage.byCountries = {term, countries}),
      tap(()=>this.saveToLocalStorge())
    )
  }
  searchRegion(region:Region):Observable<Country[]>{//   -- term = mi query a la PI
    const url=`${this.apiUrl}/region/${region}`
    return this.getCountryRequest(url)
    .pipe(
      tap(countries=> this.cacheStorage.byRegion = {region, countries}),
      tap(()=>this.saveToLocalStorge())
    )
  }
}
