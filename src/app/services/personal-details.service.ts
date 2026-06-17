import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PersonalDetails } from "../models/personal-details.model";


@Injectable({
    providedIn: 'root'
})

export class PersonalDetailsService {
    private apiUrl = 'https://localhost:7216/api/PersonalDetails';

    constructor(private http: HttpClient){}

    savePersonalDetails(details: PersonalDetails): Observable<any> {
        return this.http.post<any>(this.apiUrl, details)
    }
}