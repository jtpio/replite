# replite

An embeddable REPL, powered by JupyterLite.

![replite-numpy](https://user-images.githubusercontent.com/591645/151983925-6e5dcc1e-b9be-4f1a-91bc-330579103e78.png)

## Usage

To embed the code console in your website:

```html
<iframe src="https://replite.vercel.app/retro/consoles/index.html" width="100%" height="100%"></iframe>
```

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