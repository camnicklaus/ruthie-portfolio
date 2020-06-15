import Controller from '@ember/controller';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import ENV from 'ruthie-portfolio/config/environment';
import { isEmpty } from '@ember/utils';

const urlRoot = 'http://ec2-54-201-90-233.us-west-2.compute.amazonaws.com:3000';
// const devUrlRoot = 'http://10.0.0.66:8080'

function email(value) {
  const emailPattern = /^\S+@\S+\.\S+$/;

  const noValueToValidate = isEmpty(value);
  const validValue = emailPattern.exec(value) && value.indexOf(',') === -1;

  return noValueToValidate || validValue;
}

export default class ContactController extends Controller {
  @tracked email = '';
  @tracked message = '';
  @tracked isInvalidEmail = false;
  @tracked isTouched = false;

  @action
  setEmail({ target: { value } }) {
    this.email = value;
    if (this.isTouched) {
      this.validate();
    }
  }

  @action
  validate() {
    this.isInvalidEmail = !email(this.email);
    this.isTouched = true;
  }

  @task
  onSubmit = function*(e) {
    e.preventDefault();
    let data = {
      email: this.email,
      message: this.message,
    };

    let response;

    try {

      response = yield fetch(`${urlRoot}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch(error) {
      throw new Error(error);
    }

    let result = yield response.json();
    console.log('success: ', result);

  }
}

