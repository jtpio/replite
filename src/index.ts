import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Dialog } from '@jupyterlab/apputils';

import { IConsoleTracker } from '@jupyterlab/console';

/**
 * Initialization data for the replite extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'replite:plugin',
  autoStart: true,
  optional: [IConsoleTracker],
  activate: (app: JupyterFrontEnd, tracker: IConsoleTracker | null) => {
    if (!tracker) {
      return;
    }
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    const code = urlParams.getAll('code');
    const kernel = urlParams.get('kernel');

    tracker.widgetAdded.connect((_, widget) => {
      const { console } = widget;

      // pre-populate code when the console is created
      if (code) {
        const populate = () => {
          if (console.promptCell) {
            console.promptCell.model.value.text = code.join('\n');
            console.promptCellCreated.disconnect(populate);
          }
        };
        console.promptCellCreated.connect(populate);
      }

      // hide the first select kernel dialog if a kernel is specified
      // TODO: support specifying kernel preference in upstream RetroLab
      if (kernel) {
        const hideFirstDialog = (_: unknown, w: Dialog<unknown>) => {
          w.hide();
          Dialog.tracker.widgetAdded.disconnect(hideFirstDialog);
        };
        Dialog.tracker.widgetAdded.connect(hideFirstDialog);

        void console.sessionContext.changeKernel({ name: kernel });
      }
    });
  }
};

export default plugin;
