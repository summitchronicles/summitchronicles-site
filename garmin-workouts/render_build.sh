#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install the local package in editable mode so imports work
echo "Installing local package..."
# Check if setup.py exists, if not create a minimal one
if [ ! -f setup.py ]; then
    echo "Creating minimal setup.py..."
    cat > setup.py <<EOF
from setuptools import setup, find_packages
setup(name='garminworkouts', version='1.0', packages=find_packages())
EOF
fi

pip install -e .

echo "Build complete!"
