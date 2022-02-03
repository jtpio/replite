#!/bin/bash

# small script to deploy to Vercel
set -xeu

# bootstrap the environment
yum install tar wget || true

export MAMBA_VERSION=0.20.0
export ZSH_VERSION=""
URL="https://anaconda.org/conda-forge/micromamba/${MAMBA_VERSION}/download/linux-64/micromamba-${MAMBA_VERSION}-0.tar.bz2"
wget -qO- ${URL} | tar -xvj bin/micromamba

./bin/micromamba shell init --shell=bash -p ~/micromamba

source ~/.bashrc

micromamba activate
micromamba install python=3.10 -c conda-forge -y

# install dependencies
python -m pip install -r requirements-deploy.txt

# populate placeholder content to avoid 404s errors in the dev tools console when fetching all.json
mkdir contents
cp README.md contents

# build the JupyterLite site
jupyter lite --version
jupyter lite build --contents contents --output-dir _output

# copy the favicon.ico to the top-level
cp favicon.ico _output/