FROM python:3.11-slim as builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get clean && apt-get install -y libpq-dev curl gcc

COPY requirements.txt /tmp/requirements.txt

RUN pip install --upgrade pip && pip install --no-cache-dir -r /tmp/requirements.txt
RUN pwd

COPY . ./