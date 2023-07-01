# Use the official Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Python script and other necessary files
COPY main.py requirements.txt ./

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Run the Python script with the Discord bot and the HTTP server
CMD [ "python", "main.py" ]
