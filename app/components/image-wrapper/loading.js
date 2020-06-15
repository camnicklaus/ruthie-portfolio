import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';

export default class LoadingComponent extends Component {
  get style() {
    return htmlSafe(`height:${Math.round(this.args.loadingHeight)}px;`);
  }
}