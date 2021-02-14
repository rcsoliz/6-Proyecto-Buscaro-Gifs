import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Git, SearchGifsResponse } from '../interfaces/gifs.intefaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey      : string = 'DaLAZEufQZPNY4risUc1IFy81oxtOuAH';
  private servicioUrl : string = 'https://api.giphy.com/v1/gifs';
  private _historial  : string[]=[];

  public resultados: Git[]=[];   //cambiar any por su tipo

  get historial(){
    return [...this._historial]; // [... ] con esto rompemos la referencia.
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) ||[];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) ||[];
  }

  buscarGifs(query: string){
    query = query.trim().toLocaleLowerCase();

    if(query !=''){
      if(!this._historial.includes(query)){
        this._historial.unshift(query);
        this._historial = this._historial.splice(0,9);

        localStorage.setItem('historial', JSON.stringify( this._historial));
      }
    }

    const params = new HttpParams()
                      .set('api_key', this.apiKey)
                      .set('limit', '10')
                      .set('q', query);
    console.log(params);

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
        .subscribe((resp) =>{
          this.resultados = resp.data;
          localStorage.setItem('resultados', JSON.stringify( this.resultados ));
    })

  }

}
