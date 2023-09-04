import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { AboutPageComponent } from './shared/pages/about-page/about-page.component';
import { ContactPageComponent } from './shared/pages/contact-page/contact-page.component';

//Rutas definidas para la navegación en nuestra página

const routes:Routes=[
  /* {//al colocar /home en el directorio de la app-web éste lo mandará a la página principal, esta lógica se aplica con los demás routers
    path:'',
    component:HomePageComponent
  }, */
  {
    path:'about',
    component:AboutPageComponent
  },
  {
    path:'contact',
    component:ContactPageComponent
  },
  {
    path:'countries',
    //función de carga -->import es promesa | then=si se hace correcatmente
    //tenemos un módulo m, y de éste módulo quiero cierto módulo en espécifico ...
    loadChildren: ()=>import('./countries/countries.module').then(m=> m.CountriesModule)
  },
  {/*eN CASO DE QUE EL SUSUARIO NO COLOQUE EL DIRECTORIO SIN ALGUNO DE ESTAS PARABRAS DESPUÉS DE UN SLASH,
    SE CARGARÁ ESTO POR DEFECTO:*///(http://localhost:4200) por ejemplo
    path:'**',
    redirectTo:'countries'
  }
]

@NgModule({
  imports:[
    RouterModule.forRoot(routes)//A nuestro módulo de indicamos que éste es nuestro directorio inicial, el "directorio padre"
  ],
  exports:[
    RouterModule,
  ]
})
export class AppRoutingModule { }
