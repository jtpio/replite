import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { CommandToolbarButton, Dialog, Toolbar } from '@jupyterlab/apputils';

import { IConsoleTracker } from '@jupyterlab/console';

import { ITranslator } from '@jupyterlab/translation';

import { clearIcon, refreshIcon, runIcon } from '@jupyterlab/ui-components';

import { liteIcon } from '@jupyterlite/ui-components';

import { Panel, Widget } from '@lumino/widgets';

/**
 * A plugin to add buttons to the console toolbar.
 */
const buttons: JupyterFrontEndPlugin<void> = {
  id: 'replite:buttons',
  autoStart: true,
  requires: [ITranslator],
  optional: [IConsoleTracker],
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    tracker: IConsoleTracker | null
  ) => {
    if (!tracker) {
      return;
    }

    const { commands } = app;
    const trans = translator.load('retrolab');

    // wrapper commands to be able to override the icon
    const runCommand = 'replite:run';
    commands.addCommand(runCommand, {
      caption: trans.__('Run'),
      icon: runIcon,
      execute: () => {
        return commands.execute('console:run-forced');
      }
    });

    const runButton = new CommandToolbarButton({
      commands,
      id: runCommand
    });

    const restartCommand = 'replite:restart';
    commands.addCommand(restartCommand, {
      caption: trans.__('Restart'),
      icon: refreshIcon,
      execute: () => {
        return commands.execute('console:restart-kernel');
      }
    });

    const restartButton = new CommandToolbarButton({
      commands,
      id: restartCommand
    });

    const clearCommand = 'replite:clear';
    commands.addCommand(clearCommand, {
      caption: trans.__('Clear'),
      icon: clearIcon,
      execute: () => {
        return commands.execute('console:clear');
      }
    });

    const clearButton = new CommandToolbarButton({
      commands,
      id: clearCommand
    });

    tracker.widgetAdded.connect((_, console) => {
      const { toolbar } = console;

      console.toolbar.addItem('run', runButton);
      console.toolbar.addItem('restart', restartButton);
      console.toolbar.addItem('clear', clearButton);

      toolbar.addItem('spacer', Toolbar.createSpacerItem());

      const wrapper = new Panel();
      wrapper.addClass('jp-PoweredBy');

      const node = document.createElement('a');
      node.textContent = trans.__('Powered by JupyterLite');
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

      wrapper.addWidget(poweredBy);
      wrapper.addWidget(icon);
      toolbar.addItem('powered-by', wrapper);
    });
  }
};

/**
 * A plugin to parse custom parameters from the query string arguments.
 */
const parameters: JupyterFrontEndPlugin<void> = {
  id: 'replite:parameters',
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
    const toolbar = urlParams.get('toolbar');

    tracker.widgetAdded.connect(async (_, widget) => {
      const { console } = widget;

      // hide the first select kernel dialog if a kernel is specified
      // TODO: support specifying kernel preference in upstream RetroLab
      if (kernel) {
        const hideFirstDialog = (_: unknown, w: Dialog<unknown>) => {
          Dialog.tracker.widgetAdded.disconnect(hideFirstDialog);
          requestAnimationFrame(() => w.resolve(0));
        };
        Dialog.tracker.widgetAdded.connect(hideFirstDialog);

        await console.sessionContext.changeKernel({ name: kernel });
      }

      if (code) {
        await console.sessionContext.ready;
        code.forEach(line => console.inject(line));
      }

      if (!toolbar) {
        // hide the toolbar by default if not specified
        widget.toolbar.dispose();
      }
    });
  }
};

const plugins: JupyterFrontEndPlugin<any>[] = [buttons, parameters];

export default plugins;
