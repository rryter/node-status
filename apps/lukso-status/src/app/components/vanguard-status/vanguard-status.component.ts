import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { VanguardServiceService } from '../../services/vanguard-service.service';

@Component({
  selector: 'lukso-vanguard-status',
  templateUrl: './vanguard-status.component.html',
  styleUrls: ['./vanguard-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VanguardStatusComponent {
  metrics$: Observable<any>;
  constructor(vanguardMetrics: VanguardServiceService) {
    this.metrics$ = vanguardMetrics.getMetrics$();
  }

  calculatePeersStatus(metrics: any) {
    const numberOfPeers = metrics['p2p_peer_count{state="Connected"}'];
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
