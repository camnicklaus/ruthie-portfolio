import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
// import ENV from 'ruthie-portfolio/config/environment';
import { next } from '@ember/runloop';

// const urlRoot = 'http://ec2-54-201-90-233.us-west-2.compute.amazonaws.com:3000'
// const devUrlRoot = 'http://10.0.0.66:8080'


export default class PortfolioController extends Controller {
  @tracked showModal = false;

  @action
  toggleModal() {
    this.showModal = !this.showModal;
    if (this.showModal) {
      next(this, 'renderPaypalButtons');
    }

  }

  @action
  renderPaypalButtons() {
    window.paypal.Buttons().render('#paypal-button-container');
  }
}