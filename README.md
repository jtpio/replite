# replite

An embeddable REPL, powered by JupyterLite.

![replite-numpy](https://user-images.githubusercontent.com/591645/151983925-6e5dcc1e-b9be-4f1a-91bc-330579103e78.png)

## Usage

To embed the code console in your website:

```html
<iframe src="https://replite.vercel.app/retro/consoles/index.html" width="100%" height="100%">
</iframe>
```

## Configuration

The behavior and the look of the REPL can be configured via URL parameters.

### Select a kernel by default

To avoid the kernel selection dialog and choose a given kernel by default:

```html
<iframe src="https://replite.vercel.app/retro/consoles?kernel=python" width="100%" height="100%">
</iframe>
```

### Enable the toolbar

The toolbar can be enabled (opt-in) to add a couple of useful buttons:

```html
<iframe src="https://replite.vercel.app/retro/consoles?toolbar=1" width="100%" height="100%">
</iframe>
```

![toolbar](https://user-images.githubusercontent.com/591645/152152632-af6b7020-1dc4-450b-b9c8-1d320e6fd5a5.png)

### Auto execute code on startup

Custom starter code can automatically be executed on startup:

```html
<iframe src="https://replite.vercel.app/retro/consoles?kernel=python&code=import numpy as np" width="100%" height="100%">
</iframe>
```

https://user-images.githubusercontent.com/591645/152204519-7980e9f6-ef56-4263-bb79-4fcf3e4fd2be.mp4

## Create your custom deployment

TBD

## Development

```bash
# create a new environment
mamba create -n replite -c conda-forge jupyterlab=3 jupyter-packaging python nodejs -y
conda activate replite

# Install JupyterLite
python -m pip install jupyterlite

# Install package in development mode
python -m pip install -e .

# Link your development version of the extension
jupyter labextension develop . --overwrite

# Rebuild extension TypeScript source after making changes
jlpm run build
```