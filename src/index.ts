import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the replite extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'replite:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension replite is activated!');
  }
};

export default plugin;
