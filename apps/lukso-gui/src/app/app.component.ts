import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Settings } from './interfaces/settings';
import { NETWORKS } from './modules/launchpad/launchpad/helpers/create-keys';
import { SoftwareService } from './services/available-versions/available-versions.service';
import { GlobalState, GLOBAL_RX_STATE } from './shared/rx-state';

@Component({
  selector: 'lukso-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lukso-status';
  NETWORKS = NETWORKS;

  softwareService: SoftwareService;

  form: FormGroup = new FormGroup({
    network: new FormControl(NETWORKS.L15_DEV, [Validators.required]),
  });

  constructor(
    @Inject(GLOBAL_RX_STATE) private state: RxState<GlobalState>,
    private http: HttpClient,
    softwareService: SoftwareService
  ) {
    this.softwareService = softwareService;

    this.state.connect(
      'network',
      this.networkFormCtrl.valueChanges.pipe(
        startWith(this.networkFormCtrl.value)
      )
    );
    this.state.connect(
      'settings',
      this.state
        .select('network')
        .pipe(switchMap((network) => this.softwareService.getSettings(network)))
    );
    console.log('SETUP STATE');
    this.state.connect(
      'setupPerformed',
      this.softwareService.getDownloadedVersions$().pipe(
        map((a) => {
          console.log(
            !(
              a &&
              Object.keys(a).length === 0 &&
              Object.getPrototypeOf(a) === Object.prototype
            )
          );
          return !(
            a &&
            Object.keys(a).length === 0 &&
            Object.getPrototypeOf(a) === Object.prototype
          );
        })
      )
    );
  }

  startClients(network: string) {
    this.softwareService
      .getSettings(network)
      .pipe(
        switchMap((settings: Settings) => {
          const clients = ['pandora', 'vanguard', 'orchestrator', 'validator'];
          return this.softwareService.startClients(network, settings, clients);
        })
      )
      .subscribe();
  }

  stopClients() {
    this.softwareService
      .stopClients(['pandora', 'vanguard', 'orchestrator', 'validator'])
      .subscribe();
  }

  get networkFormCtrl() {
    return this.form.get('network') as FormControl;
  }
}
