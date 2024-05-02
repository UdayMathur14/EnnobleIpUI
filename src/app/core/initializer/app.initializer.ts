import { Router } from "@angular/router";
import { BootService } from "../service/boot.service";
import { Observable } from "rxjs";

export function initializeAppFactory(
    bootService: BootService,
    router: Router
): () => any {
    return () => bootService.load();
}