'use babel';

import BaconLoremView from './bacon-lorem-view';
import { CompositeDisposable } from 'atom';
import axios from 'axios';

export default {

  baconLoremView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bacon-lorem:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getWordUnderCursor()
      const regex = /^bacon[0-9]+$/i

      if (selection.match(regex)) {
        const regexTimes = /^bacon([0-9]+)$/
        let times = selection.match(regexTimes)[1];

        axios.get(`https://baconipsum.com/api/?type=all-meat&sentences=${times}&start-with-lorem=1`)
          .then((response) => {
            editor.deleteToBeginningOfWord()
            editor.insertText(response.data[0])
          })
          .catch((error) => {
            console.log('error')
          })

      }
    }
  }
};
