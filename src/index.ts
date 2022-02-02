import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Dialog } from '@jupyterlab/apputils';

import { IConsoleTracker } from '@jupyterlab/console';

import { Panel, PanelLayout, Widget } from '@lumino/widgets';

import { liteIcon } from '@jupyterlite/ui-components';

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

      const populate = () => {
        if (console.promptCell) {
          // pre-populate code when the console is created
          if (code) {
            console.promptCell.model.value.text = code.join('\n');
          }

          const wrapper = new Panel();
          wrapper.addClass('jp-PoweredBy');

          const node = document.createElement('a');
          node.textContent = 'Powered by JupyterLite';
          node.href = 'https://github.com/jupyterlite/jupyterlite';
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
          const poweredBy = new Widget({ node });
          const icon = new Widget();
          liteIcon.element({
            container: icon.node,
            elementPosition: 'center',
            margin: '2px 2px 2px 8px',
            height: 'auto',
            width: '16px'
          });

          const layout = console.layout as PanelLayout;
          wrapper.addWidget(poweredBy);
          wrapper.addWidget(icon);
          layout.addWidget(wrapper);

          console.promptCellCreated.disconnect(populate);
        }
      };
      console.promptCellCreated.connect(populate);

      // hide the first select kernel dialog if a kernel is specified
      // TODO: support specifying kernel preference in upstream RetroLab
      if (kernel) {
        const hideFirstDialog = async (_: unknown, w: Dialog<unknown>) => {
          Dialog.tracker.widgetAdded.disconnect(hideFirstDialog);
          requestAnimationFrame(() => w.dispose());
        };
        Dialog.tracker.widgetAdded.connect(hideFirstDialog);

        void console.sessionContext.changeKernel({ name: kernel });
      }
    });
  }
};

export default plugin;
