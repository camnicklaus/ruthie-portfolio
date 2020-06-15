import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';

export default class ModalComponent extends Component {
  @tracked showModal = false;
  @tracked addModalClass = false;

  @action
  async toggleModal() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.toggle('modal-active');
    if (this.showModal) {
      document.removeEventListener('keydown', this.onKeyDown);
      this.addModalClass = false;
      await timeout(250);
      this.showModal = false;
      return;
    }
    document.addEventListener('keydown', this.onKeyDown);
    this.showModal = true;
    await timeout(250);
    this.addModalClass = true;
  }

  @action
  onKeyDown(evt) {
    let showModal = this.showModal;
    let toggleModal = this.args.toggleModal;

    evt = evt || window.event
    let isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
      isEscape = (evt.keyCode === 27)
    }
    if (isEscape && showModal) {
      toggleModal()
    }
  }
}
