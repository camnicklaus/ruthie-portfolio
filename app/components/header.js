import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @service router;

  @tracked isMobileMenuOpen = false;

  get isActive() {
    // Access router.currentURL to mark it as a "dependent key" so this recalculates
    this.router.currentURL;
    let isRouteActive = {};
    for (let route of ['portfolio', 'blog', 'about', 'contact']) {
      isRouteActive[route] = this.router.isActive(route);
    }
    return isRouteActive;
  }
}
