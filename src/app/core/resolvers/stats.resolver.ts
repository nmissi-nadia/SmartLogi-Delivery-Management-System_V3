import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StatistiquesService, StatistiquesOverview } from '../services/statistiques.service';
import { Observable } from 'rxjs';

/**
 * Resolver pour précharger les statistiques générales
 */
export const statsResolver: ResolveFn<StatistiquesOverview> = (route, state) => {
    const statsService = inject(StatistiquesService);
    return statsService.getStatistiquesOverview();
};
