import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { PandoraMetricsService } from '../../services/pandora-metrics.service';

@Component({
  selector: 'lukso-pandora-status',
  templateUrl: './pandora-status.component.html',
  styleUrls: ['./pandora-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PandoraStatusComponent {
  metrics$: Observable<any>;
  constructor(pandorsMetrics: PandoraMetricsService) {
    this.metrics$ = pandorsMetrics.getMetrics$();
  }

  calculatePeersStatus(numberOfPeers: number) {
    switch (true) {
      case numberOfPeers > 10:
        return {
          'has-background-success': true,
        };
      case numberOfPeers < 10 && numberOfPeers > 5:
        return {
          'has-background-warning': true,
        };
      case numberOfPeers < 5:
        return {
          'has-background-danger': true,
        };

      default:
        return {};
    }
  }
}
