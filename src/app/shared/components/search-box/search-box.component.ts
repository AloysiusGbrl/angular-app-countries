import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy{
  //Subject es un tipo de observable que creamos manualmente, necesario para mandar request después de teclear en el input box
  private debouncer:Subject<string>=new Subject<string>();//debouncer = tubo de agua, fluye hasta que "cierro la llave"
  private debouncerSuscription?:Subscription;

  @Input()
  public placeHolder:string=''
  @Input()
  public initialValue:string=''

  @Output()//Creamos el emisor de evento para cuando el usuario da Enter parta buscar
  onValue=new EventEmitter<string>()

  @Output()//Creamos el emisor de eventom para auto buscar después de escribir
  onDebounce=new EventEmitter<string>()

  ngOnInit(): void {//es quien se encargará de hacer la emiciones será este debauncer del tipo observable
    this.debouncerSuscription = this.debouncer//debouncer emite un valor...
    .pipe(//el valor llega al pipe, el cual tiene un debounceTime...
      debounceTime(/*Tiempo de espera=*/3000)//el cual esperará cierto tiempo para recibir otro valor y no emitir nada
    )//Si pasa más del tiempo determiando sin recibir un nuevo valor entonces manda el valor al suscibe
    .subscribe(value=>{
      //console.log('debouncer value ', value)
      this.onDebounce.emit(value)
    })
  }

  ngOnDestroy(): void {//después de  destruido el componente, cancelaré suscribción al observable
    //console.log('destruido')
    //this.debouncer.unsubscribe();
    this.debouncerSuscription?.unsubscribe()
  }

  emitValue(value:string):void{
    this.onValue.emit(value)
  }

  onKeyPress(searchTerm:string){
    //console.log(searchTerm)
    //el next es para hacer la siguiente emición en observable y le mandamos el seachTerm
    this.debouncer.next(searchTerm);
  }

}
