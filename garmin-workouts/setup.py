from setuptools import setup, find_packages

setup(
    name='garminworkouts',
    version='1.0.0',
    description='Garmin Health & Activity Metrics Service',
    packages=find_packages(),
    install_requires=[
        'flask',
        'gunicorn',
        'garminconnect',
        'python-dateutil',
    ],
)
