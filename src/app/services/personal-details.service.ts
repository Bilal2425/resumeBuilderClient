import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PersonalDetails } from "../models/personal-details.model";
import { getApiUrl } from "../config/api-config";


@Injectable({
    providedIn: 'root'
})

export class PersonalDetailsService {
    private apiUrl = getApiUrl('PersonalDetails');

    constructor(private http: HttpClient){}

    savePersonalDetails(details: PersonalDetails): Observable<any> {
        return this.http.post<any>(this.apiUrl, details)
    }
}